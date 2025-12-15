import { json } from "../lib/helpers.js";
import { getTokenFromEvent, verifyAccessToken } from "../lib/auth.js";
import { db } from "../lib/db.js";
import { users } from "../db/schema/user.js";
import { eq } from "drizzle-orm";

export async function handler(event) {
  const token = getTokenFromEvent(event);

  if (!token) {
    return json(401, { message: "missing token" });
  }

  try {
    // Verify JWT
    const claims = verifyAccessToken(token);

    // Fetch user from Postgres
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, claims.sub))
      .limit(1);

    if (!user) {
      return json(401, { message: "user not found" });
    }

    // Shape response exactly like before
    return json(200, {
      user: {
        id: user.id,
        email: user.email,
        role: claims.role || user.role,
      },
    });

  } catch (err) {
    return json(401, { message: "invalid or expired token" });
  }
}
