import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { RESUME_RETENTION_DAYS } from "@/content/hiring";

/**
 * Deletes stored resumes older than the retention window.
 * Scheduled by vercel.json; Vercel calls it with `Authorization: Bearer ${CRON_SECRET}`.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ ok: true, deleted: 0, note: "no blob store" });

  const cutoff = Date.now() - RESUME_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  let cursor: string | undefined;
  let deleted = 0;
  do {
    const page = await list({ prefix: "selling-system/resumes/", cursor, limit: 1000 });
    const old = page.blobs.filter((b) => new Date(b.uploadedAt).getTime() < cutoff).map((b) => b.url);
    if (old.length) {
      await del(old);
      deleted += old.length;
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return NextResponse.json({ ok: true, deleted });
}
