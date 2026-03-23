import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const encodeValue = (value: string) =>
  encodeURIComponent(value.trim()).replace(/%20/g, "+");

const generateSignature = (
  orderedPairs: Array<[string, string]>,
  passphrase?: string
) => {
  const pairs = orderedPairs
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `${key}=${encodeValue(value)}`);

  if (passphrase) {
    pairs.push(`passphrase=${encodeValue(passphrase)}`);
  }

  const payload = pairs.join("&");
  return crypto.subtle
    .digest("MD5", new TextEncoder().encode(payload))
    .then((hash) =>
      Array.from(new Uint8Array(hash))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
    );
};

const validateWithPayFast = async (body: string) => {
  const validateUrl =
    Deno.env.get("PF_VALIDATE_URL") ??
    "https://sandbox.payfast.co.za/eng/query/validate";

  const response = await fetch(validateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  return response.text();
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const passphrase = Deno.env.get("PF_PASSPHRASE") ?? "";

    const signature = params.get("signature") ?? "";
    const signaturePairs: Array<[string, string]> = [];
    for (const [key, value] of params.entries()) {
      if (key === "signature") continue;
      signaturePairs.push([key, value]);
    }

    const localSignature = await generateSignature(signaturePairs, passphrase);
    if (signature !== localSignature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const validationResult = await validateWithPayFast(body);
    if (validationResult.trim() !== "VALID") {
      return new Response("Invalid payment", { status: 400 });
    }

    const paymentStatus = params.get("payment_status") ?? "";
    const orderId = params.get("custom_str1") ?? "";
    const amountGross = Number(params.get("amount_gross") ?? params.get("amount") ?? "0");

    if (!orderId) {
      return new Response("Missing order ID", { status: 400 });
    }

    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");

    if (!serviceRoleKey || !supabaseUrl) {
      return new Response("Missing Supabase configuration", { status: 500 });
    }

    const orderResponse = await fetch(
      `${supabaseUrl}/rest/v1/orders?order_id=eq.${orderId}&select=total`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );

    if (!orderResponse.ok) {
      return new Response("Order lookup failed", { status: 500 });
    }

    const orderRows = await orderResponse.json();
    const expectedTotal = Number(orderRows?.[0]?.total ?? 0);
    if (!Number.isFinite(expectedTotal) || expectedTotal <= 0) {
      return new Response("Invalid order total", { status: 400 });
    }

    if (Number.isFinite(amountGross) && Math.abs(expectedTotal - amountGross) > 0.01) {
      return new Response("Amount mismatch", { status: 400 });
    }

    const updatePayload = {
      m_payment_id: params.get("m_payment_id") ?? orderId,
      pf_payment_id: params.get("pf_payment_id") ?? null,
      amount_gross: params.get("amount_gross") ?? null,
      pf_fee_amount: params.get("amount_fee") ?? null,
      payment_date: params.get("payment_date") ?? null,
    };

    if (paymentStatus === "COMPLETE") {
      await fetch(`${supabaseUrl}/rest/v1/orders?order_id=eq.${orderId}`, {
        method: "PATCH",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          payment_status: "paid",
          order_status: "paid",
          status: "paid",
          ...updatePayload,
        }),
      });
    } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
      await fetch(`${supabaseUrl}/rest/v1/orders?order_id=eq.${orderId}`, {
        method: "PATCH",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          payment_status: "failed",
          order_status: "new",
          status: "failed",
          ...updatePayload,
        }),
      });
    }

    return new Response("OK", { headers: corsHeaders });
  } catch (error) {
    console.error("notify error", error);
    return new Response("Server error", { status: 500 });
  }
});
