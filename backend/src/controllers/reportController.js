import { supabase } from '../config/supabase.js';

export const listReports = async (req, res) => {
  const { data: reports, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, reports });
};

export const getReport = async (req, res) => {
  const { id } = req.params;
  const { data: report, error } = await supabase.from('reports').select('*').eq('id', id).single();
  if (error || !report) return res.status(404).json({ success: false, message: 'Not found' });
  return res.status(200).json({ success: true, report });
};

export const createReport = async (req, res) => {
  const { data: report, error } = await supabase.from('reports').insert([req.body]).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(201).json({ success: true, report });
};

export const updateReport = async (req, res) => {
  const { id } = req.params;
  const { data: report, error } = await supabase.from('reports').update(req.body).eq('id', id).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, report });
};

export const deleteReport = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('reports').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true });
};
