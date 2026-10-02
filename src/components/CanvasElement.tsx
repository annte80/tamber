import { useRef, useState, useCallback } from 'react';
import type { TamberElement } from '@/types/tamber';

interface CanvasElementProps {
  element: TamberElement;
  canvasRef: React.RefObject<HTMLDivElement>;
  selected: boolean;
  onSelect: () => void;
  onChange: (updated: TamberElement) => void;
}

export function CanvasElement({ element, canvasRef, selected, onSelect, onChange }: CanvasElementProps) {
  const [editing, setEditing] = useState(false);
  const dragState = useRef<{ startX: number; startY: number; elX: number; elY: number } | null>(null);
  const resizeState = useRef<{ startX: number; startY: number; elW: number; elH: number } | null>(null);

  const getCanvasSize = useCallback(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return { width: rect?.width ?? 1, height: rect?.height ?? 1 };
  }, [canvasRef]);

  const handleDragStart = (e: React.MouseEvent) => {
    onSelect();
    if (editing) return;
    e.stopPropagation();
    dragState.current = { startX: e.clientX, startY: e.clientY, elX: element.x, elY: element.y };

    const handleMove = (moveEvent: MouseEvent) => {
      if (!dragState.current) return;
      const { width, height } = getCanvasSize();
      const dxPct = ((moveEvent.clientX - dragState.current.startX) / width) * 100;
      const dyPct = ((moveEvent.clientY - dragState.current.startY) / height) * 100;
      onChange({ ...element, x: dragState.current.elX + dxPct, y: dragState.current.elY + dyPct });
    };

    const handleUp = () => {
      dragState.current = null;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizeState.current = { startX: e.clientX, startY: e.clientY, elW: element.width, elH: element.height };

    const handleMove = (moveEvent: MouseEvent) => {
      if (!resizeState.current) return;
      const { width, height } = getCanvasSize();
      const dwPct = ((moveEvent.clientX - resizeState.current.startX) / width) * 100;
      const dhPct = ((moveEvent.clientY - resizeState.current.startY) / height) * 100;
      const newWidth = Math.max(5, resizeState.current.elW + dwPct);
      const newHeight = Math.max(5, resizeState.current.elH + dhPct);
      onChange({ ...element, width: newWidth, height: newHeight });
    };

    const handleUp = () => {
      resizeState.current = null;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return (
    <div
      onMouseDown={handleDragStart}
      onDoubleClick={() => {
        if (element.type === 'text') {
          onSelect();
          setEditing(true);
        }
      }}
      style={{
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        transform: `rotate(${element.rotation}deg)`,
        cursor: editing ? 'text' : 'move',
        userSelect: editing ? 'text' : 'none',
        zIndex: element.layer,
      }}
      className={`border flex items-center overflow-hidden ${
        selected ? 'border-dashed border-blue-400' : 'border-transparent'
      }`}
    >
      {element.type === 'text' &&
        (editing ? (
          <textarea
            autoFocus
            value={element.text}
            onChange={(e) => onChange({ ...element, text: e.target.value })}
            onBlur={() => setEditing(false)}
            className="w-full h-full bg-transparent resize-none outline-none p-1"
            style={{
              fontFamily: element.fontFamily,
              fontSize: `${element.fontSize}px`,
              color: element.fontColor,
              textAlign: element.textAlign,
            }}
          />
        ) : (
          <div
            className="w-full h-full p-1 pointer-events-none"
            style={{
              fontFamily: element.fontFamily,
              fontSize: `${element.fontSize}px`,
              color: element.fontColor,
              textAlign: element.textAlign,
            }}
          >
            {element.text}
          </div>
        ))}

      {element.type === 'image' && (
        <img
          src={element.src}
          alt=""
          draggable={false}
          className="w-full h-full pointer-events-none"
          style={{
            objectFit: element.fitMode === 'crop' ? 'cover' : 'fill',
            filter: element.distortion === 'wavy' ? 'url(#tamber-wavy)' : undefined,
          }}
        />
      )}

      {selected && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-blue-400 rounded-sm cursor-nwse-resize"
        />
      )}
    </div>
  );
}
