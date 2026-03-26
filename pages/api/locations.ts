import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { keyword } = req.query;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const url = new URL(`${base}/locations-mock`);
  if (keyword) url.searchParams.set("keyword", String(keyword));

  try {
    const upstream = await fetch(url.toString());
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: "Upstream API unreachable", detail: String(err) });
  }
}
