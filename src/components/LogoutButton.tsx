"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { deleteCookie } from "cookies-next";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    deleteCookie("authToken"); // Remove token
    router.push("/login");
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
