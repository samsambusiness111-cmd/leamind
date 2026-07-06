import supabase from '@/api/supabaseClient';

export async function getUserProgress(email) {
  if (!email) return null;
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('created_by', email)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listUserProgress() {
  const { data, error } = await supabase.from('user_progress').select('*');
  if (error) throw error;
  return data || [];
}

export async function createUserProgress(record) {
  const { data, error } = await supabase
    .from('user_progress')
    .insert(record)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUserProgress(id, updates) {
  const { data, error } = await supabase
    .from('user_progress')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteUserProgress(email) {
  const { error } = await supabase
    .from('user_progress')
    .delete()
    .eq('created_by', email);
  if (error) throw error;
}

export async function isPaymentIdUsedByOther(paymentId, email) {
  if (!paymentId) return false;
  const { data, error } = await supabase.rpc('check_payment_id_used', {
    p_id: paymentId,
    user_email: email,
  });
  if (error) throw error;
  return !!data;
}
