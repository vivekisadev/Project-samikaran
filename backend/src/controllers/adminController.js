import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const { data: user, error } = await supabase.from('admins').select('*').eq('email', email).single();
    if (error || !user) {
      if (error && error.code === 'PGRST116') {
        return res.status(400).json({ success: false, message: 'Account not found. Click "Initialize Local Core Environment" below if this is a new setup.' });
      }
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const secret = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev_secret' : '');
    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '7d' });
    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const listAdmins = async (req, res) => {
  const { data: admins, error } = await supabase.from('admins').select('id, name, email, role, created_at');
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true, admins });
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role = 'admin' } = req.body;
    const { data: existing } = await supabase.from('admins').select('id').eq('email', email).maybeSingle();
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const { data: admin, error } = await supabase.from('admins').insert([{ name, email, password_hash, role }]).select().single();
    if (error) throw error;
    return res.status(201).json({ success: true, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('admins').delete().eq('id', id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  return res.status(200).json({ success: true });
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const { error } = await supabase.from('admins').update({ password_hash }).eq('id', id);
    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const bootstrap = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const { count, error: countError } = await supabase.from('admins').select('id', { count: 'exact', head: true });
    if (countError) throw countError;
    if (count > 0) {
      return res.status(403).json({ success: false, message: 'Bootstrap not allowed' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const { data: admin, error } = await supabase.from('admins').insert([{ name, email, password_hash, role: 'superadmin' }]).select().single();
    if (error) {
      if (error.code === '42501') {
         return res.status(403).json({ success: false, message: 'Supabase RLS is blocking access. Please add SUPABASE_SERVICE_ROLE_KEY to backend/.env to bypass security locally.' });
      }
      throw error;
    }
    return res.status(201).json({ success: true, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
