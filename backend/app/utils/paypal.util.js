const ApiError = require("../api-error");

function getPayPalBaseUrl() {
  const mode = (process.env.PAYPAL_MODE || "sandbox").toLowerCase();
  return mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new ApiError(500, "Thiếu PAYPAL_CLIENT_ID hoặc PAYPAL_CLIENT_SECRET");
  }
  const base = getPayPalBaseUrl();
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const resp = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/X-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new ApiError(
      500,
      data?.error_description || "Không lấy được Paypal access token",
    );
  }
  return data;
}

async function paypalCreateOrder({ total, currency = "VND", referenceId }) {
  const base = getPayPalBaseUrl();
  const token = await getAccessToken();

  const resp = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: referenceId || "ORDER",
          amount: { currency_code: currency, value: Number(total).toFixed(2) },
        },
      ],
    }),
  });

  const data = await resp.json();
  if (!resp.ok)
    throw new ApiError(500, data?.message || "Tạo PayPal order thất bại");
  return data;
}

async function paypalCaptureOrder(paypalOrderId) {
  const base = getPayPalBaseUrl();
  const token = await getAccessToken();

  const resp = await fetch(
    `${base}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  const data = await resp.json();
  if (!resp.ok)
    throw new ApiError(500, data?.message || "Capture PayPal order thất bại");
  return data;
}

module.exports = { paypalCaptureOrder, paypalCreateOrder };
