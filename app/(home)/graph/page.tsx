import { ToolGraph } from '@/components/graph/ToolGraph';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Graph | Claw VS',
  description: 'Interactive 3D graph visualization of all AI Agent tools.',
};

export default function GraphPage() {
  return (
    <div className="w-full h-full">
      <ToolGraph />
    </div>
  );
}
