import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No auth header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── Verify user ──
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── Get Razorpay credentials from secrets ──
    const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID') ?? '';
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay credentials');
      return new Response(JSON.stringify({ error: 'Server config error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── Fetch recent payments from Razorpay ──
    // We look for payments in the last 7 days matching this user's email
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const fromTimestamp = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
    const paymentsUrl = `https://api.razorpay.com/v1/payments?from=${fromTimestamp}&count=100`;

    const paymentsRes = await fetch(paymentsUrl, {
      headers: { 'Authorization': `Basic ${auth}` },
    });

    if (!paymentsRes.ok) {
      console.error('Razorpay API error:', await paymentsRes.text());
      return new Response(JSON.stringify({ error: 'Failed to verify with Razorpay' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const paymentsData = await paymentsRes.json();
    const payments = paymentsData.items || [];

    // ── Find a matching payment ──
    // Match by: captured + amount ₹500 (50000 paise) + email matches user
    const matchingPayment = payments.find((p: any) => {
      const amountOk = p.amount === 50000;
      const statusOk = p.status === 'captured';
      const emailOk =
        p.email?.toLowerCase() === user.email?.toLowerCase() ||
        p.notes?.user_email?.toLowerCase() === user.email?.toLowerCase();
      return amountOk && statusOk && emailOk;
    });

    if (!matchingPayment) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No valid payment found. Please complete payment on leamindai.com first.'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── Write to subscriptions ──
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();

    // Check if this user already has this payment applied
    const { data: existing } = await serviceClient
      .from('subscriptions')
      .select('id, razorpay_payment_id')
      .eq('user_email', user.email)
      .maybeSingle();

    if (existing?.razorpay_payment_id === matchingPayment.id) {
      // Already applied — just return success
      return new Response(JSON.stringify({
        success: true,
        expiry_date: expires,
        payment_id: matchingPayment.id,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (existing) {
      await serviceClient
        .from('subscriptions')
        .update({
          status: 'active',
          start_date: new Date().toISOString(),
          expiry_date: expires,
          razorpay_payment_id: matchingPayment.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await serviceClient.from('subscriptions').insert({
        user_id: user.id,
        user_email: user.email,
        status: 'active',
        start_date: new Date().toISOString(),
        expiry_date: expires,
        razorpay_payment_id: matchingPayment.id,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      expiry_date: expires,
      payment_id: matchingPayment.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});