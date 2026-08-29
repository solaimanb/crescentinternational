"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export default function CatalogLenis() {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        anchors: { offset: 88 },
        stopInertiaOnNavigate: true,
      }}
    />
  );
}
