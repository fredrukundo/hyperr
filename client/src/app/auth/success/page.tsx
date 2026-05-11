"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveToken } from "@/services/auth.service";

export default function AuthSuccess() {
  const router = useRouter();
  const params = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    // Save token (both localStorage + cookie)
    saveToken(token);

    // Small delay to ensure cookie is set before redirect
    setTimeout(() => {
      setIsProcessing(false);
      router.replace("/library");
    }, 100);

  }, [params, router]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Logging you in...</p>
      </div>
    );
  }

  return null;
}