"use client";

import { useEffect, useMemo, useState } from "react";

import type { SdgIndicator } from "@/types/sdgs-public";

export function useSdgIndicatorSelection(indicators: SdgIndicator[] | undefined) {
  const [selectedIndicatorCode, setSelectedIndicatorCode] = useState<string>("");

  useEffect(() => {
    if (!indicators?.length) {
      return;
    }

    setSelectedIndicatorCode((currentCode) => {
      const stillExists = indicators.some((indicator) => indicator.code === currentCode);
      return stillExists ? currentCode : indicators[0].code;
    });
  }, [indicators]);

  const selectedIndicator = useMemo(() => {
    if (!indicators?.length) {
      return null;
    }

    return (
      indicators.find((indicator) => indicator.code === selectedIndicatorCode) ??
      indicators[0]
    );
  }, [indicators, selectedIndicatorCode]);

  return {
    selectedIndicator,
    selectedIndicatorCode: selectedIndicator?.code ?? "",
    setSelectedIndicatorCode,
  };
}
