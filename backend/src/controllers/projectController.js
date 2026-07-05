import { supabase } from '../config/supabase.js';

export const listProjects = async (req, res) => {
  const { data: projects, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, projects });
};

export const getProject = async (req, res) => {
  const { id } = req.params;
  const { data: project, error } = await supabase.from('projects').select('*').eq('id', id).single();
  if (error || !project) return res.status(404).json({ success: false, message: 'Not found' });
  return res.status(200).json({ success: true, project });
};

export const createProject = async (req, res) => {
  const { data: project, error } = await supabase.from('projects').insert([req.body]).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(201).json({ success: true, project });
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { data: project, error } = await supabase.from('projects').update(req.body).eq('id', id).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, project });
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true });
};
