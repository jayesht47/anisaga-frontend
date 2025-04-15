import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session-management";
import { cache } from "react";
import { redirect } from "next/navigation";


export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  if (!session?.userName) {
    redirect("/login");
  }
  return { isAuth: true, userName: session?.userName };
});
