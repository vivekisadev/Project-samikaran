import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../../data/testimonials.json');

// Helper to read/write local file
const readData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};
const writeData = (data) => {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing testimonials.json', err);
  }
};

export const listTestimonials = async (req, res) => {
  try {
    // --- SUPABASE IMPLEMENTATION (COMMENTED OUT FOR NOW) ---
    /*
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, testimonials: data });
    */
    
    // --- LOCAL FILE FALLBACK ---
    const testimonials = readData();
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, role, text, avatar, is_active } = req.body;
    
    if (!name || !text) {
      return res.status(400).json({ success: false, message: 'Name and text are required' });
    }

    // --- SUPABASE IMPLEMENTATION (COMMENTED OUT FOR NOW) ---
    /*
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{ name, role, text, avatar, is_active: is_active !== undefined ? is_active : true }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ success: true, testimonial: data, message: 'Testimonial created successfully' });
    */

    // --- LOCAL FILE FALLBACK ---
    const testimonials = readData();
    const newTestimonial = {
      id: crypto.randomUUID(),
      name,
      role: role || '',
      text,
      avatar: avatar || '',
      is_active: is_active !== undefined ? is_active : true,
      created_at: new Date().toISOString()
    };
    testimonials.unshift(newTestimonial); // Add to front
    writeData(testimonials);
    
    res.status(201).json({ success: true, testimonial: newTestimonial, message: 'Testimonial created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, text, avatar, is_active } = req.body;

    // --- SUPABASE IMPLEMENTATION (COMMENTED OUT FOR NOW) ---
    /*
    const { data, error } = await supabase
      .from('testimonials')
      .update({ name, role, text, avatar, is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, testimonial: data, message: 'Testimonial updated successfully' });
    */

    // --- LOCAL FILE FALLBACK ---
    const testimonials = readData();
    const index = testimonials.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Not found' });
    
    testimonials[index] = { ...testimonials[index], name, role, text, avatar, is_active };
    writeData(testimonials);

    res.json({ success: true, testimonial: testimonials[index], message: 'Testimonial updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    // --- SUPABASE IMPLEMENTATION (COMMENTED OUT FOR NOW) ---
    /*
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.json({ success: true, message: 'Testimonial deleted successfully' });
    */

    // --- LOCAL FILE FALLBACK ---
    const testimonials = readData();
    const newTestimonials = testimonials.filter(t => t.id !== id);
    writeData(newTestimonials);

    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
