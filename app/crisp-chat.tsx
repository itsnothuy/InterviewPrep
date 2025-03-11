"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  const websiteId = "c181c3dc-e7c2-4585-9cd4-4221c6e03b75";
  useEffect(() => {
    console.log("Crisp websiteId:", websiteId);
    if (websiteId) {
      Crisp.configure("c181c3dc-e7c2-4585-9cd4-4221c6e03b75");
    } else {
      console.error("Crisp websiteId is not set");
    }
  }, [websiteId]);

  return null;
};
