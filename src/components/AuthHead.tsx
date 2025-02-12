"use client";

import { useAuthCheck } from "@/utils/auth";
import Image from "next/image";
import "@/lib/i18n"; // Import i18n setup
import { useTranslation } from "react-i18next";

export default function AuthHeader() {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = useAuthCheck();

  //   if (!user) return null; // Prevent rendering while checking auth

  return (
    <div className="w-full flex justify-center items-center p-4">
      {!user ? (
        <div className="flex justify-center items-center">
          <Image
            src="/gad_family.png"
            alt="Gad Family"
            width={150}
            height={150}
          />
        </div>
      ) : (
        <div className="w-full md:w-1/2 flex justify-between items-center mt-6">
          <div className="flex justify-center items-center mt-6">
            <Image
              src="/gad_family.png"
              alt="Gad Family"
              width={50}
              height={50}
            />
            <div>
              <p className="font-bold">Gad</p>
              <p className="font-bold">Family</p>
            </div>
          </div>
          <div>
            <h1 className="font-bold">Shalom, {t("dear")}</h1>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
