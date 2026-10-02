import type { TextElement } from '@/types/tamber';
import { AlignLeft, AlignCenter, AlignRight, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface PropertyPanelProps {
  element: TextElement | null;
  onChange: (updated: TextElement) => void;
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

  return (
    <div className="w-56 shrink-0 bg-slate-900 border border-slate-700 rounded-lg p-4 flex flex-col gap-4">
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
