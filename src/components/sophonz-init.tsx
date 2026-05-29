"use client";

import { useEffect, useRef } from "react";
import sophonz from "@sophonz/browser-sdk";

export function SophonzInit() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    sophonz.init({
      collectorUrl: "https://in.v0.sophonz.com",
      serviceVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      serviceName: "crosspoint-reader-docs",
      serviceNamespace: "crosspoint-reader",
      serviceKey:
        "veMLLNLutaagaPdDrO3ICGCiq1zRnlZVDDho1qroUSP_DNzfSLM4E_zfI94P8LPbtjXwl00qFySWXac.e_AosC-VWDQwyqbkFsE3Eg",
      deploymentEnvironment: process.env.NODE_ENV,
    });
  }, []);

  return null;
}
