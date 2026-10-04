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

  // Resizing works in pixels so it stays correct when the element is rotated:
  // the mouse movement is converted into the element's own (tilted) axes, and
  // the top-left corner is kept pinned in place on screen while the box grows.
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { width: W, height: H } = getCanvasSize();
    const theta = (element.rotation * Math.PI) / 180;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    const w0 = (element.width / 100) * W;
    const h0 = (element.height / 100) * H;
    const cx0 = (element.x / 100) * W + w0 / 2;
    const cy0 = (element.y / 100) * H + h0 / 2;

    const pinX = cx0 + (-w0 / 2) * cos - (-h0 / 2) * sin;
    const pinY = cy0 + (-w0 / 2) * sin + (-h0 / 2) * cos;

    const startX = e.clientX;
    const startY = e.clientY;
    const base = element;

    const handleMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const localDx = dx * cos + dy * sin;
      const localDy = -dx * sin + dy * cos;

      const w1 = Math.max(W * 0.05, w0 + localDx);
      const h1 = Math.max(H * 0.05, h0 + localDy);

      const cx1 = pinX + (w1 / 2) * cos - (h1 / 2) * sin;
      const cy1 = pinY + (w1 / 2) * sin + (h1 / 2) * cos;

      onChange({
        ...base,
        x: ((cx1 - w1 / 2) / W) * 100,
        y: ((cy1 - h1 / 2) / H) * 100,
        width: (w1 / W) * 100,
        height: (h1 / H) * 100,
      });
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const b = element.border;
  const innerStyle: React.CSSProperties = {
    border: b && b.width > 0 ? `${b.width}px solid ${b.color}` : undefined,
    borderRadius: b ? `${b.radius}px` : undefined,
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
        outline: selected ? '1px dashed #60a5fa' : 'none',
      }}
    >
      <div className="w-full h-full overflow-hidden flex items-center" style={innerStyle}>
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

        {element.type === 'shape' && element.shape === 'rectangle' && (
          <div className="w-full h-full pointer-events-none" style={{ backgroundColor: element.fillColor }} />
        )}

        {element.type === 'shape' && element.shape === 'arrow' && (
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full pointer-events-none">
            <polygon points="0,15 65,15 65,5 100,20 65,35 65,25 0,25" fill={element.fillColor} />
          </svg>
        )}
      </div>

      {selected && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-blue-400 rounded-sm cursor-nwse-resize"
        />
      )}
    </div>
  );
}
