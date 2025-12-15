import { count, ilike, desc } from 'drizzle-orm';
import { db } from '../lib/db';
import { products } from '../db/schema/product';
import { CreateProduct } from '../lib/helpers'; // assuming you have this
import { requireAdmin } from '../lib/auth';
import { json, intOr } from '../lib/helpers';

export async function handler(event) {
  try {
    // LIST PRODUCTS
    if (event.httpMethod === 'GET') {
      const qs = event.queryStringParameters || {};
      const page = Math.max(1, intOr(qs.page, 1));
      const pageSize = Math.min(100, Math.max(1, intOr(qs.pageSize ?? qs.limit, 12)));
      const q = (qs.q || qs.name || '').trim();

      let query = db.select().from(products);
      let countQuery = db.select({ count: count() }).from(products);

      if (products.createdAt) {
        // Use desc() wrapper function
        query = query.orderBy(desc(products.createdAt));
      }

      if (q) {
        // FIX: Pass string pattern directly, not sql`` tag
        const searchPattern = `%${q}%`;
        query = query.where(ilike(products.name, searchPattern));
        countQuery = countQuery.where(ilike(products.name, searchPattern));
      }

      const totalResult = await countQuery;
      const items = await query.limit(pageSize).offset((page - 1) * pageSize);
      const total = Number(totalResult[0].count);
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      console.log({ page, pageSize, total: totalResult[0].count, items })
return json(200, {
  page,
  pageSize,
  total,
  totalPages,
  items,
});
    }

    // CREATE PRODUCT
    if (event.httpMethod === "POST") {

      let gate = requireAdmin(event)
      if(!gate.ok) return json(gate.status, gate.body);

      let body;
      try {
        body = JSON.parse(event.body || "{}");
      } catch {
        return json(400, { message: "invalid JSON body" });
      }

      const parsed = CreateProduct.safeParse(body);
      if (!parsed.success) {
        return json(400, {
          message: "invalid body",
          issues: parsed.error.format(),
        });
      }

      const [doc] = await db.insert(products).values(parsed.data).returning();
      return json(201, doc);
    }

    return json(405, { message: "Method not allowed" });
  } catch (e) {
    console.error(e);
    return json(500, { message: "server error", error: String(e) });
  }
}

