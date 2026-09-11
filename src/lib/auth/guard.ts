import { cookies } from "next/headers";
import { verifyAdminSession, verifyOwnerSession } from "./session";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_admin_session")?.value;

  if (!token) {
    return null;
  }

  return verifyAdminSession(token);
}

export async function requireOwner() {
  const cookieStore = await cookies();
  const token = cookieStore.get("etw_owner_session")?.value;

  if (!token) {
    return null;
  }

  return verifyOwnerSession(token);
}
