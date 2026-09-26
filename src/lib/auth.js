import supabase from '@/api/supabaseClient';

function mapUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    full_name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      '',
    role: user.user_metadata?.role || 'user',
  };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return mapUser(user);
}

export async function redirectToLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email, password,
  });
  if (error) throw error;
  return mapUser(data.user);
}

export async function signUpWithEmail(email, password, fullName = '') {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;
  return mapUser(data.user);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/';
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? mapUser(session.user) : null);
  });
}

// ── NEW: Check subscription status from backend ──
export async function checkSubscription() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { subscribed: false, expiry_date: null };

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(
      `${supabaseUrl}/functions/v1/subscription-status`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Subscription check failed:', response.status);
      return { subscribed: false, expiry_date: null };
    }

    const data = await response.json();
    return {
      subscribed: data.subscribed === true,
      expiry_date: data.expiry_date || null,
    };
  } catch (err) {
    console.error('checkSubscription error:', err);
    return { subscribed: false, expiry_date: null };
  }
}