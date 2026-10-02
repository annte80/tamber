import { createClient } from '@supabase/supabase-js';
import type { TamberElement, TamberPresentation } from '@/types/tamber';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const EDIT_TOKEN_KEY = 'tamber_edit_token';

export async function createPresentation(): Promise<{ editToken: string; shareCode: string }> {
  const { data, error } = await supabase.rpc('tamber_create_presentation');
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  localStorage.setItem(EDIT_TOKEN_KEY, row.edit_token);
  return { editToken: row.edit_token, shareCode: row.share_code };
}

export async function loadPresentation(editToken: string): Promise<TamberPresentation> {
  const { data, error } = await supabase.rpc('tamber_get_by_edit_token', { p_edit_token: editToken });
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    slides: data.slides,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function savePresentation(editToken: string, title: string, elements: TamberElement[]): Promise<void> {
  const slides = [{ id: 'slide-1', elements }];
  const { error } = await supabase.rpc('tamber_save', {
    p_edit_token: editToken,
    p_title: title,
    p_slides: slides,
  });
  if (error) throw error;
}

export function getStoredEditToken(): string | null {
  return localStorage.getItem(EDIT_TOKEN_KEY);
}

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('tamber-media').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('tamber-media').getPublicUrl(path);
  return data.publicUrl;
}
