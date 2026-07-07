'use client';

import { motion } from 'motion/react';
import {
  BookOpen,
  Bot,
  MessageSquareText,
  Network,
  ScrollText,
  Sparkles,
  Zap
} from 'lucide-react';

type DiagramNode = {
  icon: typeof ScrollText;
  label: string;
  x: number;
  y: number;
};

const SOURCE_NODES: DiagramNode[] = [
  { icon: ScrollText, label: 'Contexts', x: 10, y: 16 },
  { icon: BookOpen, label: 'Instructions', x: 6, y: 50 },
  { icon: Zap, label: 'Skills', x: 10, y: 84 }
];

const CLIENT_NODES: DiagramNode[] = [
  { icon: Bot, label: 'Claude', x: 90, y: 16 },
  { icon: MessageSquareText, label: 'ChatGPT', x: 96, y: 50 },
  { icon: Sparkles, label: 'Cursor', x: 90, y: 84 }
];

const CENTER = { x: 50, y: 50 };

function ConnectorNode({ node, delay }: { node: DiagramNode; delay: number }) {
  const Icon = node.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className='absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5'
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <div className='border-border bg-background flex h-9 w-9 shrink-0 items-center justify-center rounded-md border shadow-sm'>
        <Icon className='text-primary h-4 w-4' />
      </div>
      <span className='text-muted-foreground text-[10px] font-medium whitespace-nowrap'>
        {node.label}
      </span>
    </motion.div>
  );
}

function FlowLine({
  from,
  to,
  delay
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay: number;
}) {
  return (
    <>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        className='stroke-border'
        strokeWidth={0.4}
      />
      <motion.circle
        r={1.1}
        className='fill-primary'
        animate={{
          cx: [from.x, to.x],
          cy: [from.y, to.y],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay
        }}
      />
    </>
  );
}

export default function HeroNetworkDiagram() {
  return (
    <div className='relative h-80 w-full sm:h-88'>
      <svg
        viewBox='0 0 100 100'
        preserveAspectRatio='none'
        className='absolute inset-0 h-full w-full'
      >
        {SOURCE_NODES.map((node, idx) => (
          <FlowLine
            key={node.label}
            from={node}
            to={CENTER}
            delay={idx * 0.4}
          />
        ))}
        {CLIENT_NODES.map((node, idx) => (
          <FlowLine
            key={node.label}
            from={CENTER}
            to={node}
            delay={0.8 + idx * 0.4}
          />
        ))}
      </svg>

      {SOURCE_NODES.map((node, idx) => (
        <ConnectorNode key={node.label} node={node} delay={0.5 + idx * 0.1} />
      ))}
      {CLIENT_NODES.map((node, idx) => (
        <ConnectorNode key={node.label} node={node} delay={0.8 + idx * 0.1} />
      ))}

      {/* Center: MCP server */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className='absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5'
        style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
      >
        <div className='border-primary/30 bg-primary/10 relative flex h-14 w-14 items-center justify-center rounded-full border'>
          <motion.span
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className='bg-primary/20 absolute inset-0 rounded-full'
          />
          <Network className='text-primary relative h-6 w-6' />
        </div>
        <span className='text-foreground text-xs font-semibold whitespace-nowrap'>
          MCP Server
        </span>
      </motion.div>
    </div>
  );
}
