'use server'

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function fetchAdminUsers() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw new Error(error.message);
  
  // Return only the safe, serializable data we need for the table
  return data.users.map(u => ({
    id: u.id,
    email: u.email,
    created_at: new Date(u.created_at).toLocaleDateString(),
    last_sign_in: u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'
  }));
}

export async function deleteAdminUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  return true;
}

export async function updateAdminPassword(userId: string, newPassword: string) {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword });
  if (error) throw new Error(error.message);
  return true;
}