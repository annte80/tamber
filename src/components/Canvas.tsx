import { useRef } from 'react';
import type { TamberElement } from '@/types/tamber';
import { CanvasElement } from './CanvasElement';

interface CanvasProps {
  elements: TamberElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (updated: TamberElement) => void;
}

export function Canvas({ elements, selectedId, onSelect, onChange }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        ref={canvasRef}
        onMouseDown={() => onSelect(null)}
        className="relative w-full bg-slate-900 border border-slate-700 rounded-lg overflow-hidden"
        style={{ aspectRatio: '16 / 9' }}
      >
        {elements.map((el) => (
          <CanvasElement
            key={el.id}
            element={el}
            canvasRef={canvasRef}
            selected={el.id === selectedId}
            onSelect={() => onSelect(el.id)}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
