import { useState } from 'react';
import type { TextElement } from '@/types/tamber';
import { Canvas } from '@/components/Canvas';
import { PropertyPanel } from '@/components/PropertyPanel';

function makeTextElement(id: string): TextElement {
  return {
    id,
    type: 'text',
    x: 10 + Math.random() * 20,
    y: 10 + Math.random() * 20,
    width: 40,
    height: 15,
    rotation: 0,
    layer: 1,
    text: 'New text box',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 20,
    fontColor: '#ffffff',
    textAlign: 'left',
  };
}

function App() {
  const [elements, setElements] = useState<TextElement[]>([
    { ...makeTextElement('test-1'), x: 20, y: 30, text: 'Double-click to edit me' },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedElement = elements.find((el) => el.id === selectedId) ?? null;

  const updateElement = (updated: TextElement) => {
    setElements((prev) => prev.map((el) => (el.id === updated.id ? updated : el)));
  };

  const addElement = () => {
    const newEl = makeTextElement(`text-${Date.now()}`);
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 gap-4">
      <h1 className="text-xl font-bold text-white">Tamber — canvas test</h1>
      <button
        onClick={addElement}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition"
      >
        + Add Text Box
      </button>
      <div className="flex gap-4 items-start w-full max-w-5xl">
        <Canvas
          elements={elements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={updateElement}
        />
        <PropertyPanel element={selectedElement} onChange={updateElement} />
      </div>
    </div>
  );
}

export default App;
