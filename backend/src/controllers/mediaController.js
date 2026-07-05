import { supabase } from '../config/supabase.js';

export const listMedia = async (req, res) => {
  const { data: media, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, media });
};

export const createMedia = async (req, res) => {
  const { data: media, error } = await supabase.from('media').insert([req.body]).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(201).json({ success: true, media });
};

export const updateMedia = async (req, res) => {
  const { id } = req.params;
  const { data: media, error } = await supabase.from('media').update(req.body).eq('id', id).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, media });
};

export const deleteMedia = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true });
};
