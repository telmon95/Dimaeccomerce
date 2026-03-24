import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const encodeValue = (value: string) => {
  const encoded = encodeURIComponent(value.trim()).replace(/%20/g, "+");
  return encoded.replace(/%[0-9a-f]{2}/gi, (match) => match.toUpperCase());
};

const md5 = (input: string) => {
  const utf8 = unescape(encodeURIComponent(input));
  const x = md5blk(utf8);
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const oldA = a;
    const oldB = b;
    const oldC = c;
    const oldD = d;

    a = ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = add32(a, oldA);
    b = add32(b, oldB);
    c = add32(c, oldC);
    d = add32(d, oldD);
  }

  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
};

const md5blk = (s: string) => {
  const blocks = [];
  for (let i = 0; i < 64; i += 4) {
    blocks[i >> 2] =
      s.charCodeAt(i) |
      (s.charCodeAt(i + 1) << 8) |
      (s.charCodeAt(i + 2) << 16) |
      (s.charCodeAt(i + 3) << 24);
  }
  return blocks;
};

const rhex = (n: number) => {
  const hexChr = "0123456789abcdef";
  let s = "";
  for (let j = 0; j < 4; j++) {
    s +=
      hexChr.charAt((n >> (j * 8 + 4)) & 0x0f) +
      hexChr.charAt((n >> (j * 8)) & 0x0f);
  }
  return s;
};

const cmn = (q: number, a: number, b: number, x: number, s: number, t: number) =>
  add32(((a + q + x + t) << s) | ((a + q + x + t) >>> (32 - s)), b);

const ff = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
  cmn((b & c) | (~b & d), a, b, x, s, t);

const gg = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
  cmn((b & d) | (c & ~d), a, b, x, s, t);

const hh = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
  cmn(b ^ c ^ d, a, b, x, s, t);

const ii = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) =>
  cmn(c ^ (b | ~d), a, b, x, s, t);

const add32 = (a: number, b: number) => (a + b) & 0xffffffff;

const buildSignaturePayload = (
  orderedPairs: Array<[string, string]>,
  passphrase?: string
) => {
  const pairs = orderedPairs
    .filter(([, value]) => value !== "")
    .map(([key, value]) => `${key}=${encodeValue(value)}`);

  if (passphrase) {
    pairs.push(`passphrase=${encodeValue(passphrase)}`);
  }

  return pairs.join("&");
};

const generateSignature = (
  orderedPairs: Array<[string, string]>,
  passphrase?: string
) => md5(buildSignaturePayload(orderedPairs, passphrase));

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

    const signaturePairs = Object.entries(data).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    const signaturePayload = buildSignaturePayload(signaturePairs, passphrase);
    const signature = md5(signaturePayload);

    if (Deno.env.get("PF_DEBUG_SIGNATURE") === "true") {
      console.log("PayFast signature payload (no secrets):", signaturePayload.replace(/passphrase=[^&]*/i, "passphrase=REDACTED"));
      console.log("PayFast data payload:", data);
    }

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
