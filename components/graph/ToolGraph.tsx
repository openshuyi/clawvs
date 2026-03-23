'use client';

import { useState, useEffect, useRef, useMemo, useCallback, useId } from 'react';
import ForceGraph3D from './ForceGraph3D';
import ForceGraph2D from './ForceGraph2D';
import { tools } from '@/lib/tools';
import { ToolProfile, primaryCategories, toolTags } from '@/lib/tools/types';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import SpriteText from 'three-spritetext';

type Node = {
  id: string;
  name: string;
  group: string;
  val: number;
  color?: string;
  tool?: ToolProfile;
  x?: number;
  y?: number;
  z?: number;
};

type Link = {
  source: string;
  target: string;
};

export function ToolGraph() {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<Link>>(new Set());
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  
  // New toggles
  const [layoutMode, setLayoutMode] = useState<'force' | 'dag'>('force');
  const [sizeMapping, setSizeMapping] = useState(true);
  const [enableEffects, setEnableEffects] = useState(true);
  const [dimOthersOnHover, setDimOthersOnHover] = useState(false);
  const [fixNodesOnDrag, setFixNodesOnDrag] = useState(false);
  const [showBloomConfig, setShowBloomConfig] = useState(false);
  const [showPhysicsConfig, setShowPhysicsConfig] = useState(false);
  
  // Bloom parameters
  const [bloomStrength, setBloomStrength] = useState(0.2);
  const [bloomRadius, setBloomRadius] = useState(1.5);
  const [bloomThreshold, setBloomThreshold] = useState(0.1);

  // Physics parameters
  const [chargeStrength, setChargeStrength] = useState(-120);
  const [linkDistance, setLinkDistance] = useState(40);

  // Color mapping
  const [colorBy, setColorBy] = useState<'sourceType' | 'primaryCategory' | 'region'>('sourceType');

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterSourceType, setFilterSourceType] = useState<string>('All');
  const categoryId = useId();
  const sourceTypeId = useId();
  const colorById = useId();
  const autoRotateId = useId();
  const layoutModeId = useId();
  const sizeMappingId = useId();
  const effectsId = useId();
  const dimHoverId = useId();
  const fixDragId = useId();
  const bloomStrengthId = useId();
  const bloomRadiusId = useId();
  const bloomThresholdId = useId();
  const chargeStrengthId = useId();
  const linkDistanceId = useId();

  // Handle resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    
    observer.observe(containerRef.current);
    
    // Initial size
    setDimensions({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight
    });
    
    return () => observer.disconnect();
  }, []);

  // Generate Graph Data
  const { graphData, legendData } = useMemo(() => {
    const nodes: Node[] = [];
    const links: Link[] = [];

    // Filter tools
    const filteredTools = tools.filter((t) => {
      if (filterCategory !== 'All' && t.primaryCategory !== filterCategory) return false;
      if (filterSourceType !== 'All' && t.sourceType !== filterSourceType) return false;
      return true;
    });

    const categorySet = new Set<string>();
    const tagSet = new Set<string>();

    // Pre-calculate unique values for color mapping
    const uniqueValues = Array.from(new Set(filteredTools.map(t => String(t[colorBy] || 'Unknown'))));
    const colorPalette = [
      '#00f0ff', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', 
      '#3b82f6', '#f43f5e', '#14b8a6', '#f97316', '#eab308'
    ];

    const getToolColor = (tool: ToolProfile) => {
      if (colorBy === 'sourceType') {
        return tool.sourceType === '开源' ? '#10b981' : tool.sourceType === '闭源' ? '#f59e0b' : '#3b82f6';
      }
      const val = String(tool[colorBy] || 'Unknown');
      const index = uniqueValues.indexOf(val);
      return colorPalette[index % colorPalette.length];
    };

    // Calculate Legend Data
    const legendData = colorBy === 'sourceType' 
      ? [
          { label: '开源', color: '#10b981' },
          { label: '闭源', color: '#f59e0b' },
          { label: '部分开源', color: '#3b82f6' }
        ].filter(item => filteredTools.some(t => t.sourceType === item.label))
      : uniqueValues.map((val, index) => ({
          label: val,
          color: colorPalette[index % colorPalette.length]
        }));

    filteredTools.forEach((tool) => {
      // Calculate size based on stars. 
      // Log scale ensures massive star projects don't overwhelm, but we give a better baseline.
      const starCount = tool.githubStars || 0;
      // Size logic: base size 4, max size ~16 based on log(stars)
      const calculatedSize = sizeMapping 
        ? (starCount > 0 ? 4 + Math.min(12, Math.log10(starCount) * 2.5) : 4)
        : 6;

      // Tool Node
      nodes.push({
        id: tool.slug,
        name: tool.name,
        group: 'tool',
        val: calculatedSize,
        tool,
        color: getToolColor(tool),
      });

      // Category Node & Link
      if (tool.primaryCategory) {
        if (!categorySet.has(tool.primaryCategory)) {
          categorySet.add(tool.primaryCategory);
          nodes.push({
            id: `cat-${tool.primaryCategory}`,
            name: tool.primaryCategory,
            group: 'category',
            val: 8,
            color: '#8b5cf6',
          });
        }
        links.push({
          source: tool.slug,
          target: `cat-${tool.primaryCategory}`,
        });
      }

      // Tag Nodes & Links
      tool.tags.forEach((tag) => {
        // Only include tags if we are not filtering heavily, to avoid clutter. 
        // Let's limit tags to those that appear multiple times or just include all.
        if (!tagSet.has(tag)) {
          tagSet.add(tag);
          nodes.push({
            id: `tag-${tag}`,
            name: tag,
            group: 'tag',
            val: 1,
            color: '#6366f1',
          });
        }
        links.push({
          source: tool.slug,
          target: `tag-${tag}`,
        });
      });
    });

    return { graphData: { nodes, links }, legendData };
  }, [filterCategory, filterSourceType, sizeMapping, colorBy]);

  const renderNode = useCallback((node: any) => {
    const isHighlighted = highlightNodes.has(node.id) || selectedNode?.id === node.id;
    const isGlobalHighlight = highlightNodes.size > 0 || selectedNode !== null;
    
    let opacity = 1;
    if (dimOthersOnHover && isGlobalHighlight && !isHighlighted) {
      opacity = 0.1;
    }
    
    if (node.group === 'category') {
      const sprite = new SpriteText(node.name);
      sprite.color = node.color;
      sprite.textHeight = 8;
      sprite.material.opacity = opacity;
      return sprite;
    } else if (node.group === 'tag') {
      const sprite = new SpriteText(node.name);
      sprite.color = node.color;
      sprite.textHeight = 4;
      sprite.material.opacity = opacity;
      return sprite;
    } else {
      // Tool nodes
      const geometry = new THREE.SphereGeometry(node.val);
      const material = new THREE.MeshLambertMaterial({ 
        color: node.color, 
        transparent: true, 
        opacity,
        emissive: node.color,
        emissiveIntensity: enableEffects && isHighlighted ? 0.6 : (enableEffects ? 0.2 : 0)
      });
      return new THREE.Mesh(geometry, material);
    }
  }, [highlightNodes, dimOthersOnHover, selectedNode, enableEffects]);

  // Auto Rotate Effect
  useEffect(() => {
    if (viewMode !== '3d') return;
    const timer = setTimeout(() => {
      if (fgRef.current && fgRef.current.controls()) {
        fgRef.current.controls().autoRotate = autoRotate;
        fgRef.current.controls().autoRotateSpeed = 1.0;
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [autoRotate, viewMode]);

  // Bloom Effect
  useEffect(() => {
    if (viewMode !== '3d') return;
    
    if (fgRef.current && fgRef.current.postProcessingComposer) {
      const composer = fgRef.current.postProcessingComposer();
      // Remove old passes
      while(composer.passes.length > 1) {
        composer.removePass(composer.passes[composer.passes.length - 1]);
      }
      
      if (enableEffects) {
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          1.5,
          0.4,
          0.85
        );
        bloomPass.strength = bloomStrength;
        bloomPass.radius = bloomRadius;
        bloomPass.threshold = bloomThreshold;
        composer.addPass(bloomPass);
      }
    }
  }, [viewMode, enableEffects, bloomStrength, bloomRadius, bloomThreshold]);

  // Physics Effect
  useEffect(() => {
    // We reference viewMode here so eslint knows it's a dependency to re-run on remount
    const is3D = viewMode === '3d';
    if (fgRef.current && layoutMode === 'force') {
      const chargeForce = fgRef.current.d3Force('charge');
      if (chargeForce) {
        chargeForce.strength(chargeStrength);
      }
      
      const linkForce = fgRef.current.d3Force('link');
      if (linkForce) {
        linkForce.distance(linkDistance);
      }

      if (fgRef.current.d3ReheatSimulation) {
        fgRef.current.d3ReheatSimulation();
      }
    }
  }, [chargeStrength, linkDistance, layoutMode, viewMode]);

  // Hover Interaction
  const handleNodeHover = (node: Node | null) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node.id);
      graphData.links.forEach((link: any) => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        if (sourceId === node.id || targetId === node.id) {
          highlightLinks.add(link);
          highlightNodes.add(sourceId === node.id ? targetId : sourceId);
        }
      });
    }

    setHoverNode(node || null);
    setHighlightNodes(new Set(highlightNodes));
    setHighlightLinks(new Set(highlightLinks));
    
    // Disable auto-rotate when hovering for better inspection
    if (node && autoRotate) {
      if (fgRef.current && fgRef.current.controls) {
        const controls = fgRef.current.controls();
        if (controls) controls.autoRotate = false;
      }
    } else if (!node && autoRotate) {
      if (fgRef.current && fgRef.current.controls) {
        const controls = fgRef.current.controls();
        if (controls) controls.autoRotate = true;
      }
    }
  };

  // Drag Interaction
  const handleNodeDragEnd = useCallback((node: any) => {
    if (fixNodesOnDrag) {
      node.fx = node.x;
      node.fy = node.y;
      node.fz = node.z;
    }
  }, [fixNodesOnDrag]);
  // Click Interaction (Focus)
  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
    if (fgRef.current && node.x !== undefined && node.y !== undefined) {
      if (viewMode === '3d' && node.z !== undefined) {
        // Aim at node from outside it
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        fgRef.current.cameraPosition(
          { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
          node, // lookAt ({ x, y, z })
          1000 // ms transition duration (speeded up)
        );
      } else if (viewMode === '2d') {
        fgRef.current.centerAt(node.x, node.y, 1000);
        fgRef.current.zoom(4, 1000);
      }
    }
  }, [viewMode]);

  return (
    <div ref={containerRef} className="relative w-full h-[calc(100vh-73px)] overflow-hidden bg-black">
      {/* Graph Canvas */}
      {dimensions.width > 0 && (
        viewMode === '3d' ? (
          <ForceGraph3D
            ref={fgRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeLabel="name"
            nodeThreeObject={renderNode}
            linkColor={(link: any) => highlightLinks.has(link) ? '#ffffff' : 'rgba(255,255,255,0.4)'}
            linkWidth={(link) => (highlightLinks.has(link as any) ? 2 : 0.8)}
            linkDirectionalParticles={(link) => (highlightLinks.has(link as any) ? 4 : 0)}
            linkDirectionalParticleWidth={2}
            onNodeHover={handleNodeHover as any}
            onNodeClick={handleNodeClick as any}
            onNodeDragEnd={handleNodeDragEnd as any}
            backgroundColor="#000000"
            showNavInfo={false}
            dagMode={layoutMode === 'dag' ? 'td' : undefined}
            dagLevelDistance={layoutMode === 'dag' ? 50 : undefined}
          />
        ) : (
          <ForceGraph2D
            ref={fgRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeLabel="name"
            nodeRelSize={4}
            nodeVal={(node: any) => node.val}
            nodeColor={(node: any) => {
              const isHighlighted = highlightNodes.has(node.id) || highlightNodes.size === 0;
              return isHighlighted ? node.color : 'rgba(255,255,255,0.1)';
            }}
            linkColor={(link: any) => highlightLinks.has(link) ? '#ffffff' : 'rgba(255,255,255,0.3)'}
            linkWidth={(link) => (highlightLinks.has(link as any) ? 2 : 0.8)}
            linkDirectionalParticles={(link) => (highlightLinks.has(link as any) ? 4 : 0)}
            linkDirectionalParticleWidth={2}
            onNodeHover={handleNodeHover as any}
            onNodeClick={handleNodeClick as any}
            onNodeDragEnd={handleNodeDragEnd as any}
            backgroundColor="#000000"
            dagMode={layoutMode === 'dag' ? 'td' : undefined}
            dagLevelDistance={layoutMode === 'dag' ? 50 : undefined}
          />
        )
      )}

      {/* Overlay UI - Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 ui-panel p-5 rounded-2xl w-72 max-h-[calc(100vh-100px)] overflow-y-auto">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)]"></span>
          图谱控制

        </h2>
        
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={categoryId} className="text-text-secondary text-xs font-medium uppercase tracking-wider">类别 (Category)</label>
            <select 
              id={categoryId}
              className="bg-bg-subtle/80 border border-border-color/50 rounded-lg p-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {primaryCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={sourceTypeId} className="text-text-secondary text-xs font-medium uppercase tracking-wider">开源类型 (Source Type)</label>
            <select 
              id={sourceTypeId}
              className="bg-bg-subtle/80 border border-border-color/50 rounded-lg p-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all"
              value={filterSourceType}
              onChange={(e) => setFilterSourceType(e.target.value)}
            >
              <option value="All">All</option>
              <option value="开源">开源 (Open Source)</option>
              <option value="闭源">闭源 (Closed Source)</option>
              <option value="部分开源">部分开源 (Partial)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={colorById} className="text-xs text-text-secondary uppercase tracking-wider">
              Color By (着色)
            </label>
            <select 
              id={colorById}
              className="bg-bg-subtle text-sm text-text-primary rounded-md p-2 border border-border-color focus:border-accent-cyan outline-none transition"
              value={colorBy}
              onChange={(e) => setColorBy(e.target.value as any)}
            >
              <option value="sourceType">开源类型 (Source Type)</option>
              <option value="primaryCategory">主分类 (Category)</option>
              <option value="region">区域 (Region)</option>
            </select>
          </div>
        </div>

        <div className="h-px w-full bg-border-color/30 my-1"></div>

        {/* Toggles */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id={autoRotateId} 
                className="sr-only peer"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                disabled={viewMode === '2d'}
              />
              <div className={`w-9 h-5 bg-bg-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border-color after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${viewMode === '3d' ? 'peer-checked:bg-accent-cyan' : 'opacity-50 cursor-not-allowed'}`}></div>
            </label>
            <label htmlFor={autoRotateId} className={`text-sm font-medium flex-1 ${viewMode === '3d' ? 'text-text-primary cursor-pointer' : 'text-text-secondary cursor-not-allowed'}`}>自动旋转 (Auto Rotate)</label>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id={sizeMappingId} 
                className="sr-only peer"
                checked={sizeMapping}
                onChange={(e) => setSizeMapping(e.target.checked)}
              />
              <div className="w-9 h-5 bg-bg-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border-color after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-cyan"></div>
            </label>
            <label htmlFor={sizeMappingId} className="text-sm font-medium flex-1 text-text-primary cursor-pointer">大小映射 (Size by Stars)</label>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id={effectsId} 
                className="sr-only peer"
                checked={enableEffects}
                onChange={(e) => setEnableEffects(e.target.checked)}
                disabled={viewMode === '2d'}
              />
              <div className={`w-9 h-5 bg-bg-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border-color after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${viewMode === '3d' ? 'peer-checked:bg-accent-cyan' : 'opacity-50 cursor-not-allowed'}`}></div>
            </label>
            <label htmlFor={effectsId} className={`text-sm font-medium flex-1 ${viewMode === '3d' ? 'text-text-primary cursor-pointer' : 'text-text-secondary cursor-not-allowed'}`}>发光特效 (Bloom FX)</label>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id={dimHoverId} 
                className="sr-only peer"
                checked={dimOthersOnHover}
                onChange={(e) => setDimOthersOnHover(e.target.checked)}
              />
              <div className="w-9 h-5 bg-bg-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border-color after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-cyan"></div>
            </label>
            <label htmlFor={dimHoverId} className="text-sm font-medium flex-1 text-text-primary cursor-pointer">悬停变暗 (Dim on Hover)</label>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id={fixDragId} 
                className="sr-only peer"
                checked={fixNodesOnDrag}
                onChange={(e) => setFixNodesOnDrag(e.target.checked)}
              />
              <div className="w-9 h-5 bg-bg-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border-color after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-cyan"></div>
            </label>
            <label htmlFor={fixDragId} className="text-sm font-medium flex-1 text-text-primary cursor-pointer">拖拽固定 (Fix on Drag)</label>
          </div>
        </div>

        {enableEffects && viewMode === '3d' && (
          <>
            <div className="h-px w-full bg-border-color/30 my-1"></div>
            <div className="flex flex-col gap-2">
              <button 
                type="button"
                onClick={() => setShowBloomConfig(!showBloomConfig)}
                className="flex items-center justify-between text-xs font-medium text-text-secondary uppercase tracking-wider mb-1 hover:text-text-primary transition-colors"
              >
                <span>特效参数 (Bloom Config)</span>
                <span className={`transform transition-transform ${showBloomConfig ? 'rotate-180' : ''}`}>▼</span>
              </button>
              
              {showBloomConfig && (
                <div className="flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <label htmlFor={bloomStrengthId} className="text-text-primary">强度 (Strength)</label>
                      <span className="text-text-secondary">{bloomStrength.toFixed(1)}</span>
                    </div>
                    <input 
                      id={bloomStrengthId}
                      type="range" 
                      min="0" max="3" step="0.1" 
                      value={bloomStrength} 
                      onChange={(e) => setBloomStrength(parseFloat(e.target.value))}
                      className="w-full accent-accent-cyan cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <label htmlFor={bloomRadiusId} className="text-text-primary">范围 (Radius)</label>
                      <span className="text-text-secondary">{bloomRadius.toFixed(1)}</span>
                    </div>
                    <input 
                      id={bloomRadiusId}
                      type="range" 
                      min="0" max="2" step="0.1" 
                      value={bloomRadius} 
                      onChange={(e) => setBloomRadius(parseFloat(e.target.value))}
                      className="w-full accent-accent-cyan cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <label htmlFor={bloomThresholdId} className="text-text-primary">阈值 (Threshold)</label>
                      <span className="text-text-secondary">{bloomThreshold.toFixed(2)}</span>
                    </div>
                    <input 
                      id={bloomThresholdId}
                      type="range" 
                      min="0" max="1" step="0.05" 
                      value={bloomThreshold} 
                      onChange={(e) => setBloomThreshold(parseFloat(e.target.value))}
                      className="w-full accent-accent-cyan cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Physics Config */}
        <div className="h-px w-full bg-border-color/30 my-1"></div>
        <div className="flex flex-col gap-2">
          <button 
            type="button"
            onClick={() => setShowPhysicsConfig(!showPhysicsConfig)}
            className="flex items-center justify-between text-xs font-medium text-text-secondary uppercase tracking-wider mb-1 hover:text-text-primary transition-colors"
          >
            <span>物理引擎 (Physics)</span>
            <span className={`transform transition-transform ${showPhysicsConfig ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {showPhysicsConfig && (
            <div className="flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor={chargeStrengthId} className="text-text-primary">排斥力 (Charge)</label>
                  <span className="text-text-secondary">{chargeStrength}</span>
                </div>
                <input 
                  id={chargeStrengthId}
                  type="range" 
                  min="-500" max="0" step="10" 
                  value={chargeStrength} 
                  onChange={(e) => setChargeStrength(parseFloat(e.target.value))}
                  className="w-full accent-accent-cyan cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor={linkDistanceId} className="text-text-primary">连线张力 (Link Dist)</label>
                  <span className="text-text-secondary">{linkDistance}</span>
                </div>
                <input 
                  id={linkDistanceId}
                  type="range" 
                  min="10" max="200" step="5" 
                  value={linkDistance} 
                  onChange={(e) => setLinkDistance(parseFloat(e.target.value))}
                  className="w-full accent-accent-cyan cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        <div className="h-px w-full bg-border-color/30 my-1"></div>

        {/* Modes */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center bg-bg-subtle/80 rounded-lg p-1 border border-border-color/50">
            <button
              type="button"
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${layoutMode === 'force' ? 'bg-accent-cyan text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setLayoutMode('force')}
            >
              Force
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${layoutMode === 'dag' ? 'bg-accent-cyan text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setLayoutMode('dag')}
            >
              DAG (树状)
            </button>
          </div>

          <div className="flex items-center bg-bg-subtle/80 rounded-lg p-1 border border-border-color/50">
            <button
              type="button"
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === '2d' ? 'bg-accent-cyan text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setViewMode('2d')}
            >
              2D
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === '3d' ? 'bg-accent-cyan text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setViewMode('3d')}
            >
              3D
            </button>
          </div>
        </div>
      </div>

      {/* Overlay UI - Tool Details */}
      {selectedNode && selectedNode.group === 'tool' && selectedNode.tool && (
        <div className="absolute top-4 right-4 z-10 w-80 ui-panel p-6 rounded-2xl transition-all animate-in slide-in-from-right-8 fade-in">
          <button 
            type="button"
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 text-text-secondary hover:text-accent-cyan transition-colors"
          >
            ✕
          </button>
          <h3 className="text-2xl font-bold text-accent-cyan mb-1">{selectedNode.tool.name}</h3>
          <p className="text-sm text-text-secondary mb-4">{selectedNode.tool.tagline}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 text-xs rounded-full bg-accent-orange/20 border border-accent-orange/30 text-accent-orange">
              {selectedNode.tool.primaryCategory}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 border border-green-500/30 text-green-400">
              {selectedNode.tool.sourceType}
            </span>
          </div>

          <p className="text-sm text-text-primary mb-4 leading-relaxed line-clamp-4">
            {selectedNode.tool.summary}
          </p>

          <div className="flex flex-col gap-2 text-sm text-text-secondary mb-4 p-3 bg-bg-surface-strong/50 rounded-lg border border-border-color/50">
            <div><strong className="text-text-primary">Vendor:</strong> {selectedNode.tool.vendor}</div>
            <div><strong className="text-text-primary">Region:</strong> {selectedNode.tool.region}</div>
            {selectedNode.tool.githubStars && (
              <div><strong className="text-text-primary">Stars:</strong> ⭐ {selectedNode.tool.githubStars}</div>
            )}
          </div>

          <div className="flex gap-3">
            {selectedNode.tool.homepageUrl && (
              <a href={selectedNode.tool.homepageUrl} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded-lg hover:bg-accent-cyan hover:text-bg-main transition-all font-medium text-sm">
                Homepage
              </a>
            )}
            {selectedNode.tool.githubUrl && (
              <a href={selectedNode.tool.githubUrl} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-bg-surface-strong border border-border-color text-text-primary rounded-lg hover:border-text-primary transition-all font-medium text-sm">
                GitHub
              </a>
            )}
          </div>
        </div>
      )}
      {/* Legend Panel */}
      {legendData.length > 0 && (
        <div className="absolute bottom-4 left-4 z-10 ui-panel p-4 rounded-xl flex flex-col gap-2 max-h-64 overflow-y-auto pointer-events-auto">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 sticky top-0 bg-bg-surface/80 backdrop-blur-sm pb-1">
            {colorBy === 'sourceType' ? '开源类型' : colorBy === 'primaryCategory' ? '主分类' : '区域'} 图例
          </h3>
          <div className="flex flex-col gap-2">
            {legendData.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
                />
                <span className="text-xs text-text-primary whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
