import { useState, useEffect, useRef } from 'react';
import type { TamberElement, TextElement, ImageElement } from '@/types/tamber';
import { Canvas } from '@/components/Canvas';
import { PropertyPanel } from '@/components/PropertyPanel';
import {
  createPresentation,
  loadPresentation,
  savePresentation,
  getStoredEditToken,
  uploadImage,
} from '@/lib/supabase';

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

function makeImageElement(id: string, src: string): ImageElement {
  return {
    id,
    type: 'image',
    x: 10 + Math.random() * 20,
    y: 10 + Math.random() * 20,
    width: 30,
    height: 30,
    rotation: 0,
    layer: 1,
    src,
    fitMode: 'crop',
  };
}

function App() {
  const [elements, setElements] = useState<TamberElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editToken, setEditToken] = useState<string | null>(null);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedOnce = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const existingToken = getStoredEditToken();
      try {
        if (existingToken) {
          const presentation = await loadPresentation(existingToken);
          setElements(presentation.slides[0]?.elements ?? []);
          setEditToken(existingToken);
        } else {
          const { editToken: newToken, shareCode: newShareCode } = await createPresentation();
          setEditToken(newToken);
          setShareCode(newShareCode);
        }
      } catch (err) {
        console.error('Failed to load/create presentation', err);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading || !editToken) return;
    if (!hasLoadedOnce.current) {
      hasLoadedOnce.current = true;
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    saveTimer.current = setTimeout(async () => {
      try {
        await savePresentation(editToken, 'Untitled Presentation', elements);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Save failed', err);
      }
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, editToken, loading]);

  const selectedElement = elements.find((el) => el.id === selectedId) ?? null;

  const updateElement = (updated: TamberElement) => {
    setElements((prev) => prev.map((el) => (el.id === updated.id ? updated : el)));
  };

  const addTextElement = () => {
    const newEl = makeTextElement(`text-${Date.now()}`);
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
  };

  const handleImagePick = () => fileInputRef.current?.click();

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      const newEl = makeImageElement(`image-${Date.now()}`, url);
      setElements((prev) => [...prev, newEl]);
      setSelectedId(newEl.id);
    } catch (err) {
      console.error('Image upload failed', err);
    }
    setUploading(false);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const changeLayer = (direction: 'forward' | 'backward') => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId
          ? { ...el, layer: direction === 'forward' ? el.layer + 1 : Math.max(0, el.layer - 1) }
          : el,
      ),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 gap-4">
      <h1 className="text-xl font-bold text-white">Tamber — canvas test</h1>
      <p className="text-xs text-slate-500">
        {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : ''}
        {shareCode && <span className="ml-3">Share code: {shareCode}</span>}
      </p>
      <div className="flex gap-2">
        <button
          onClick={addTextElement}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition"
        >
          + Add Text Box
        </button>
        <button
          onClick={handleImagePick}
          disabled={uploading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
        >
          {uploading ? 'Uploading...' : '+ Add Image'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
      </div>
      <div className="flex gap-4 items-start w-full max-w-5xl">
        <Canvas
          elements={elements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={updateElement}
        />
        <PropertyPanel
          element={selectedElement}
          onChange={updateElement}
          onDelete={deleteSelected}
          onLayerChange={changeLayer}
        />
      </div>
    </div>
  );
}

export default App;
