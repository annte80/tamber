import { useRef } from 'react';
import type { TextElement } from '@/types/tamber';
import { CanvasElement } from './CanvasElement';

interface CanvasProps {
  element: TextElement;
  onChange: (updated: TextElement) => void;
}

export function Canvas({ element, onChange }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        ref={canvasRef}
        className="relative w-full bg-slate-900 border border-slate-700 rounded-lg overflow-hidden"
        style={{ aspectRatio: '16 / 9' }}
      >
        <CanvasElement element={element} canvasRef={canvasRef} onChange={onChange} />
      </div>
    </div>
  );
}
