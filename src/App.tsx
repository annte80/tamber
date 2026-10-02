import { useState } from 'react';
import type { TextElement } from '@/types/tamber';
import { Canvas } from '@/components/Canvas';

function App() {
  const [element, setElement] = useState<TextElement>({
    id: 'test-1',
    type: 'text',
    x: 20,
    y: 35,
    width: 40,
    height: 15,
    rotation: 0,
    layer: 1,
    text: 'Double-click to edit me',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 20,
    fontColor: '#ffffff',
    textAlign: 'left',
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
      <h1 className="text-xl font-bold text-white">Tamber — canvas test</h1>
      <p className="text-slate-400 text-sm">Drag to move, drag the corner to resize, double-click to edit the text.</p>
      <Canvas element={element} onChange={setElement} />
    </div>
  );
}

export default App;
