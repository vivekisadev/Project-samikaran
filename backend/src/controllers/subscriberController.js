import { supabase } from '../config/supabase.js';

export const listSubscribers = async (req, res) => {
  const { data: subscribers, error } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, subscribers });
};

export const subscribe = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  const { error } = await supabase.from('subscribers').insert([{ email }]);
  if (error) {
    if (error.code === '23505' || error.message.includes('duplicate')) {
      return res.status(400).json({ success: false, message: 'Already subscribed' });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
  
  return res.status(201).json({ success: true, message: 'Subscribed successfully' });
};

export const deleteSubscriber = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('subscribers').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true });
};
