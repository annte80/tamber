import type { TamberElement, ElementBorder } from '@/types/tamber';
import { AlignLeft, AlignCenter, AlignRight, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface PropertyPanelProps {
  element: TamberElement | null;
  onChange: (updated: TamberElement) => void;
  onDelete: () => void;
  onLayerChange: (direction: 'forward' | 'backward') => void;
}

export function PropertyPanel({ element, onChange, onDelete, onLayerChange }: PropertyPanelProps) {
  if (!element) {
    return (
      <div className="w-56 shrink-0 bg-slate-900 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-500 text-sm">Select an element to edit its properties.</p>
      </div>
    );
  }

  const border: ElementBorder = element.border ?? { width: 0, color: '#ffffff', radius: 0 };
  const setBorder = (patch: Partial<ElementBorder>) =>
    onChange({ ...element, border: { ...border, ...patch } });

  return (
    <div className="w-56 shrink-0 bg-slate-900 border border-slate-700 rounded-lg p-4 flex flex-col gap-4">
      {element.type === 'text' && (
        <>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Font size</label>
            <input
              type="number"
              min={8}
              max={200}
              value={element.fontSize}
              onChange={(e) => onChange({ ...element, fontSize: Number(e.target.value) || element.fontSize })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Font color</label>
            <input
              type="color"
              value={element.fontColor}
              onChange={(e) => onChange({ ...element, fontColor: e.target.value })}
              className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Text align</label>
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map((align) => {
                const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight;
                return (
                  <button
                    key={align}
                    onClick={() => onChange({ ...element, textAlign: align })}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg border transition ${
                      element.textAlign === align
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {element.type === 'image' && (
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Fit mode</label>
          <div className="flex gap-1">
            {(['stretch', 'crop'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onChange({ ...element, fitMode: mode })}
                className={`flex-1 py-1.5 rounded-lg border capitalize text-xs transition ${
                  element.fitMode === mode
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-950 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}

      {element.type === 'shape' && (
        <>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Shape</label>
            <div className="flex gap-1">
              {(['rectangle', 'arrow'] as const).map((shape) => (
                <button
                  key={shape}
                  onClick={() => onChange({ ...element, shape })}
                  className={`flex-1 py-1.5 rounded-lg border capitalize text-xs transition ${
                    element.shape === shape
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Fill color</label>
            <input
              type="color"
              value={element.fillColor}
              onChange={(e) => onChange({ ...element, fillColor: e.target.value })}
              className="w-full h-9 rounded-lg border border-slate-700 bg-slate-950 cursor-pointer"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Rotation ({Math.round(element.rotation)}°)</label>
        <input
          type="range"
          min={0}
          max={360}
          value={element.rotation}
          onChange={(e) => onChange({ ...element, rotation: Number(e.target.value) })}
          className="w-full cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Border</label>
        <div className="flex gap-1 items-center">
          <input
            type="number"
            min={0}
            max={30}
            value={border.width}
            onChange={(e) => setBorder({ width: Math.max(0, Number(e.target.value) || 0) })}
            title="Width"
            className="w-14 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500"
          />
          <input
            type="color"
            value={border.color}
            onChange={(e) => setBorder({ color: e.target.value })}
            title="Color"
            className="flex-1 h-8 rounded-lg border border-slate-700 bg-slate-950 cursor-pointer"
          />
          <input
            type="number"
            min={0}
            max={200}
            value={border.radius}
            onChange={(e) => setBorder({ radius: Math.max(0, Number(e.target.value) || 0) })}
            title="Corner roundness"
            className="w-14 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
        <p className="text-[10px] text-slate-500 mt-1">width · color · roundness</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Layer order</label>
        <div className="flex gap-1">
          <button
            onClick={() => onLayerChange('backward')}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800 transition text-xs"
          >
            <ChevronDown className="w-3.5 h-3.5" /> Back
          </button>
          <button
            onClick={() => onLayerChange('forward')}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800 transition text-xs"
          >
            <ChevronUp className="w-3.5 h-3.5" /> Front
          </button>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-900 bg-red-950/40 text-red-400 hover:bg-red-950 transition text-sm font-medium"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
    </div>
  );
}
