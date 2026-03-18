"use client";

import { useCallback } from "react";

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

export function useWhatsAppContact() {
  const getWhatsAppUrl = useCallback(
    (phone: string, projectTitle: string): string => {
      const formattedPhone = formatPhoneNumber(phone);
      const message = encodeURIComponent(
        `Halo, saya tertarik untuk bergabung dengan proyek "${projectTitle}" yang Bapak/Ibu posting di SDGs Hub. Bisakah saya mengetahui informasi lebih lanjut?`
      );
      return `https://wa.me/${formattedPhone}?text=${message}`;
    },
    []
  );

  const openWhatsApp = useCallback(
    (phone: string, projectTitle: string): void => {
      const url = getWhatsAppUrl(phone, projectTitle);
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [getWhatsAppUrl]
  );

  return { getWhatsAppUrl, openWhatsApp };
}
