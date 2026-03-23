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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const amount = Number(body?.amount ?? 0);
    const orderId = String(body?.orderId ?? "").trim();

    if (!Number.isFinite(amount) || amount <= 0 || !orderId) {
      return new Response("Invalid payload", { status: 400, headers: corsHeaders });
    }

    const merchantId = Deno.env.get("PF_MERCHANT_ID");
    const merchantKey = Deno.env.get("PF_MERCHANT_KEY");
    const passphrase = Deno.env.get("PF_PASSPHRASE") ?? "";

    if (!merchantId || !merchantKey) {
      return new Response("Missing PayFast credentials", { status: 500, headers: corsHeaders });
    }

    const origin = new URL(req.url).origin;
    const data: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: body?.returnUrl ?? `${origin}/`,
      cancel_url: body?.cancelUrl ?? `${origin}/`,
      notify_url: `${origin}/notify`,
      name_first: body?.firstName ?? "",
      name_last: body?.lastName ?? "",
      email_address: body?.email ?? "",
      m_payment_id: orderId,
      amount: amount.toFixed(2),
      item_name: body?.itemName ?? `Order ${orderId}`,
      item_description: body?.itemDescription ?? `Order ${orderId}`,
      custom_str1: orderId,
    };

    const signatureOrder: Array<[string, string]> = [
      ["merchant_id", data.merchant_id],
      ["merchant_key", data.merchant_key],
      ["return_url", data.return_url],
      ["cancel_url", data.cancel_url],
      ["notify_url", data.notify_url],
      ["name_first", data.name_first],
      ["name_last", data.name_last],
      ["email_address", data.email_address],
      ["m_payment_id", data.m_payment_id],
      ["amount", data.amount],
      ["item_name", data.item_name],
      ["item_description", data.item_description],
      ["custom_str1", data.custom_str1],
    ];

    const signature = await generateSignature(signatureOrder, passphrase);

    const processUrl =
      Deno.env.get("PF_PROCESS_URL") ?? "https://sandbox.payfast.co.za/eng/process";

    return new Response(
      JSON.stringify({
        url: processUrl,
        data: { ...data, signature },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("create-payment error", error);
    return new Response("Server error", { status: 500, headers: corsHeaders });
  }
});
