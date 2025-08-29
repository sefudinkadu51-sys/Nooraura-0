/* ========== Supabase Client ========== */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL  = 'https://cukpxysglsjrnhjkgqhk.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1a3B4eXNnbHNqcm5oamtncWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NDY1NTUsImV4cCI6MjA3MjAyMjU1NX0.Y_hSMQgpkiNxefVCAh4vu3PrtWUmYyXvNYw7BIqkVpQ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ========== Products ========== */
const PRODUCTS_TABLE = 'products';
export async function getProducts() {
  const { data, error } = await supabase.from(PRODUCTS_TABLE).select('*').order('id');
  if (error) console.error('getProducts:', error);
  return data || [];
}
export async function addProduct(p) {
  const { data, error } = await supabase.from(PRODUCTS_TABLE).insert([p]).select();
  if (error) console.error('addProduct:', error);
  return data ? data[0] : null;
}
export async function updateProduct(id, updates) {
  const { data, error } = await supabase.from(PRODUCTS_TABLE).update(updates).eq('id', id).select();
  if (error) console.error('updateProduct:', error);
  return data ? data[0] : null;
}
export async function deleteProduct(id) {
  const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq('id', id);
  return !error;
}

/* ========== Settings ========== */
const SETTINGS_TABLE = 'settings';
export async function getSettings() {
  const { data, error } = await supabase.from(SETTINGS_TABLE).select('*').single();
  if (error) console.error('getSettings:', error);
  return data || {};
}
export async function saveSettings(obj) {
  const { data, error } = await supabase.from(SETTINGS_TABLE).update(obj).eq('id', 1).select();
  if (error) console.error('saveSettings:', error);
  return data ? data[0] : null;
}

/* ========== Real-time listeners ========== */
export function onProductsChange(cb) {
  return supabase
    .channel('products-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: PRODUCTS_TABLE }, cb)
    .subscribe();
}
export function onSettingsChange(cb) {
  return supabase
    .channel('settings-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: SETTINGS_TABLE }, cb)
    .subscribe();
}
