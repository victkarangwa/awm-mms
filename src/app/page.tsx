"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // A component you may already have for displaying text styles
import { useTranslation } from "react-i18next";
import "@/lib/i18n"; // Import i18n setup

export default function WelcomePage() {
  const router = useRouter();
  // const { t, i18n } = useTranslation();

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-center">
            Welcome to Gad Family - ZTCC Gatenga
          </h2>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This form will help verify if you are a member of the Gad Family
            at Zion Temple CC Gatenga.
            <br /> 
            Rest assured, your details will be securely stored and used solely
            for church purposes.
          </p>
          <div className="text-center">
            <Button onClick={() => router.push("/check")} className="w-full my-2">
              Check Registration
            </Button>
            <div className="relative flex items-center my-4">
              <div className="w-full border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <Button
              className="my-2 w-full"
              variant="secondary"
              onClick={() => router.push("/register")}
            >
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
