import { supabase } from '../config/supabase.js';

export const getSettings = async (req, res) => {
  let { data: doc, error } = await supabase.from('settings').select('*').maybeSingle();
  if (!doc) {
    const defaultSettings = {
      address: '123 NGO Street, Social Welfare Area, New Delhi, India', 
      phone: '+91 98765 43210', 
      email: 'contact@samikaran.org',
      impact_stats: {
        studentsReached: '1650+',
        institutions: '14+',
        workshops: '20+'
      }
    };
    const { data: newDoc } = await supabase.from('settings').insert([defaultSettings]).select().single();
    doc = newDoc;
  }
  
  const formatted = { ...doc, impactStats: doc?.impact_stats || { studentsReached: '1650+', institutions: '14+', workshops: '20+' } };
  delete formatted.impact_stats;
  
  return res.status(200).json({ success: true, settings: formatted });
};

export const updateSettings = async (req, res) => {
  let { data: doc } = await supabase.from('settings').select('*').maybeSingle();
  if (!doc) {
    const defaultSettings = {
      address: '123 NGO Street, Social Welfare Area, New Delhi, India', 
      phone: '+91 98765 43210', 
      email: 'contact@samikaran.org',
      impact_stats: {
        studentsReached: '1650+',
        institutions: '14+',
        workshops: '20+'
      }
    };
    const { data: newDoc } = await supabase.from('settings').insert([defaultSettings]).select().single();
    doc = newDoc;
  }
  
  const updates = {
    address: req.body.address ?? doc.address,
    phone: req.body.phone ?? doc.phone,
    email: req.body.email ?? doc.email,
    impact_stats: req.body.impactStats ?? doc.impact_stats
  };
  
  const { data: updated, error } = await supabase.from('settings').update(updates).eq('id', doc.id).select().single();
  if (error) return res.status(500).json({ success: false, message: error.message });
  
  const formatted = { ...updated, impactStats: updated.impact_stats };
  delete formatted.impact_stats;
  
  return res.status(200).json({ success: true, settings: formatted });
};
