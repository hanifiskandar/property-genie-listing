import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { page, sort } = req.query;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const url = new URL(`${base}/properties-mock`);
  if (page) url.searchParams.set("page", String(page));
  if (sort) url.searchParams.set("sort", String(sort));

  try {
    const upstream = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: "Upstream API unreachable", detail: String(err) });
  }
}
