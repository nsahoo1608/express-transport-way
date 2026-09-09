import { cookies } from "next/headers";
import { verifyAdminSession } from "./session";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) {
    return null;
  }

  return verifyAdminSession(token);
}
