import { supabase } from '../config/supabase.js';

export const listAnnouncements = async (req, res) => {
  const { data: announcements, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, announcements });
};

export const getAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { data: announcement, error } = await supabase.from('announcements').select('*').eq('id', id).single();
  if (error || !announcement) return res.status(404).json({ success: false, message: 'Not found' });
  return res.status(200).json({ success: true, announcement });
};

export const createAnnouncement = async (req, res) => {
  const { data: announcement, error } = await supabase.from('announcements').insert([req.body]).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(201).json({ success: true, announcement });
};

export const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { data: announcement, error } = await supabase.from('announcements').update(req.body).eq('id', id).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, announcement });
};

export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true });
};
