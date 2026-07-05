import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

const NEW_PASSWORD = 'admin123';
const ADMIN_EMAIL = 'admin@samikaran.org';

async function resetAdmin() {
  // First check what admins exist
  const { data: admins, error: listErr } = await supabase.from('admins').select('id, name, email, role');
  
  if (listErr) {
    console.error('Error listing admins:', listErr.message);
    return;
  }

  console.log('\n=== Existing Admin Accounts ===');
  admins.forEach(a => console.log(`  ${a.email} (${a.role}) - ID: ${a.id}`));

  if (admins.length === 0) {
    console.log('\nNo admins found. Creating one...');
    const hash = await bcrypt.hash(NEW_PASSWORD, 10);
    const { error } = await supabase.from('admins').insert([{
      name: 'Admin',
      email: ADMIN_EMAIL,
      password_hash: hash,
      role: 'superadmin'
    }]);
    if (error) {
      console.error('Failed to create admin:', error.message);
    } else {
      console.log(`\n✅ Admin created!`);
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${NEW_PASSWORD}`);
    }
  } else {
    // Reset password for first admin
    const target = admins[0];
    const hash = await bcrypt.hash(NEW_PASSWORD, 10);
    const { error } = await supabase.from('admins').update({ password_hash: hash }).eq('id', target.id);
    if (error) {
      console.error('Failed to reset password:', error.message);
    } else {
      console.log(`\n✅ Password reset!`);
      console.log(`   Email:    ${target.email}`);
      console.log(`   Password: ${NEW_PASSWORD}`);
    }
  }
}

resetAdmin();
