'use client';

import { useState, useEffect, useRef, useMemo, useCallback, useId } from 'react';
import ForceGraph3D from './ForceGraph3D';
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

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterSourceType, setFilterSourceType] = useState<string>('All');
  const categoryId = useId();
  const sourceTypeId = useId();
  const autoRotateId = useId();

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
  const graphData = useMemo(() => {
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

    filteredTools.forEach((tool) => {
      // Tool Node
      nodes.push({
        id: tool.slug,
        name: tool.name,
        group: 'tool',
        val: tool.githubStars ? Math.max(2, Math.min(10, Math.log10(tool.githubStars))) : 2,
        tool,
        color: tool.sourceType === '开源' ? '#10b981' : tool.sourceType === '闭源' ? '#f59e0b' : '#3b82f6',
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

    return { nodes, links };
  }, [filterCategory, filterSourceType]);

  const renderNode = useCallback((node: any) => {
    const isHighlighted = highlightNodes.has(node.id) || highlightNodes.size === 0;
    const opacity = isHighlighted ? 1 : 0.1;
    
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
        emissiveIntensity: isHighlighted ? 0.5 : 0
      });
      return new THREE.Mesh(geometry, material);
    }
  }, [highlightNodes]);

  // Auto Rotate Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fgRef.current && fgRef.current.controls()) {
        fgRef.current.controls().autoRotate = autoRotate;
        fgRef.current.controls().autoRotateSpeed = 1.0;
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [autoRotate]);

  // Bloom Effect
  useEffect(() => {
    if (fgRef.current) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      bloomPass.strength = 1.2;
      bloomPass.radius = 1;
      bloomPass.threshold = 0.1;
      fgRef.current.postProcessingComposer().addPass(bloomPass);
    }
  }, []);

  // Hover Interaction
  const handleNodeHover = (node: Node | null) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node.id);
      graphData.links.forEach((link) => {
        const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
        const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
        if (sourceId === node.id || targetId === node.id) {
          highlightLinks.add(link);
          highlightNodes.add(sourceId === node.id ? targetId : sourceId);
        }
      });
    }

    setHoverNode(node || null);
    setHighlightNodes(new Set(highlightNodes));
    setHighlightLinks(new Set(highlightLinks));
  };

  // Click Interaction (Focus)
  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
    if (fgRef.current && node.x !== undefined && node.y !== undefined && node.z !== undefined) {
      // Aim at node from outside it
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[calc(100vh-73px)] overflow-hidden bg-black">
      {/* 3D Graph */}
      {dimensions.width > 0 && (
        <ForceGraph3D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
        nodeLabel="name"
        nodeThreeObject={renderNode}
        linkColor={(link: any) => highlightLinks.has(link) ? '#ffffff' : 'rgba(255,255,255,0.1)'}
        linkWidth={(link) => (highlightLinks.has(link as any) ? 2 : 0.5)}
        linkDirectionalParticles={(link) => (highlightLinks.has(link as any) ? 4 : 0)}
        linkDirectionalParticleWidth={2}
        onNodeHover={handleNodeHover as any}
        onNodeClick={handleNodeClick as any}
        backgroundColor="#000000"
        showNavInfo={false}
      />
      )}

      {/* Overlay UI - Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 bg-bg-surface/80 p-4 rounded-xl border border-border-color backdrop-blur-md">
        <h2 className="text-lg font-bold text-text-primary">图谱控制 (Graph Controls)</h2>
        
        <div className="flex flex-col gap-2 text-sm">
          <label htmlFor={categoryId} className="text-text-secondary">类别 (Category):</label>
          <select 
            id={categoryId}
            className="bg-bg-subtle border border-border-color rounded p-1 text-text-primary"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {primaryCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label htmlFor={sourceTypeId} className="text-text-secondary mt-2">开源类型 (Source Type):</label>
          <select 
            id={sourceTypeId}
            className="bg-bg-subtle border border-border-color rounded p-1 text-text-primary"
            value={filterSourceType}
            onChange={(e) => setFilterSourceType(e.target.value)}
          >
            <option value="All">All</option>
            <option value="开源">开源 (Open Source)</option>
            <option value="闭源">闭源 (Closed Source)</option>
            <option value="部分开源">部分开源 (Partial)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id={autoRotateId} 
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
          />
          <label htmlFor={autoRotateId} className="text-sm text-text-primary">自动旋转 (Auto Rotate)</label>
        </div>
      </div>

      {/* Overlay UI - Tool Details */}
      {selectedNode && selectedNode.group === 'tool' && selectedNode.tool && (
        <div className="absolute top-4 right-4 z-10 w-80 bg-bg-surface/90 p-6 rounded-xl border border-border-color backdrop-blur-md shadow-2xl transition-all animate-in slide-in-from-right-8">
          <button 
            type="button"
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
          <h3 className="text-2xl font-bold text-accent-cyan mb-1">{selectedNode.tool.name}</h3>
          <p className="text-sm text-text-secondary mb-4">{selectedNode.tool.tagline}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 text-xs rounded-full bg-accent-orange/20 text-accent-orange">
              {selectedNode.tool.primaryCategory}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
              {selectedNode.tool.sourceType}
            </span>
          </div>

          <p className="text-sm text-text-primary mb-4 leading-relaxed line-clamp-4">
            {selectedNode.tool.summary}
          </p>

          <div className="flex flex-col gap-2 text-sm text-text-secondary mb-4">
            <div><strong className="text-text-primary">Vendor:</strong> {selectedNode.tool.vendor}</div>
            <div><strong className="text-text-primary">Region:</strong> {selectedNode.tool.region}</div>
            {selectedNode.tool.githubStars && (
              <div><strong className="text-text-primary">Stars:</strong> ⭐ {selectedNode.tool.githubStars}</div>
            )}
          </div>

          <div className="flex gap-3">
            {selectedNode.tool.homepageUrl && (
              <a href={selectedNode.tool.homepageUrl} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-accent-cyan/10 text-accent-cyan rounded hover:bg-accent-cyan/20 transition">
                Homepage
              </a>
            )}
            {selectedNode.tool.githubUrl && (
              <a href={selectedNode.tool.githubUrl} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-bg-subtle text-text-primary rounded hover:bg-border-color transition">
                GitHub
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
