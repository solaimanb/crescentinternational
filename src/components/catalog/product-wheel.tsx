"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/catalog/types";

const AUTO_ADVANCE_MS = 4200;
const RESUME_AFTER_INTERACTION_MS = 1800;
const FALLBACK_STEP = 236;
const DRAG_THRESHOLD_PX = 10;
const CLICK_SUPPRESS_AFTER_DRAG_MS = 200;

export default function ProductWheel({ products = [] }: { products?: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const suppressClickUntilRef = useRef(0);
  const [isAutoPaused, setIsAutoPaused] = useState(false);

  const getStepSize = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return FALLBACK_STEP;
    }

    const firstCard = container.querySelector(".catalog-wheel-card");
    if (!(firstCard instanceof HTMLElement)) {
      return FALLBACK_STEP;
    }

    const style = window.getComputedStyle(container);
    const gap = Number.parseFloat(style.columnGap || style.gap || "16");
    return firstCard.getBoundingClientRect().width + (Number.isFinite(gap) ? gap : 16);
  }, []);

  const scheduleAutoResume = useCallback(() => {
    setIsAutoPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = setTimeout(() => {
      setIsAutoPaused(false);
    }, RESUME_AFTER_INTERACTION_MS);
  }, []);

  const moveCarousel = useCallback(
    (direction: number, behavior: ScrollBehavior = "smooth") => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) {
        return;
      }

      const step = getStepSize();
      let target = container.scrollLeft + direction * step;

      if (direction > 0 && target >= maxScroll - step / 2) {
        target = 0;
      }

      if (direction < 0 && target <= step / 2) {
        target = maxScroll;
      }

      container.scrollTo({
        left: target,
        behavior,
      });
    },
    [getStepSize]
  );

  useEffect(() => {
    if (products.length <= 1) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      if (isAutoPaused || isDraggingRef.current) {
        return;
      }

      moveCarousel(1, "smooth");
    }, AUTO_ADVANCE_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAutoPaused, products.length, moveCarousel]);

  useEffect(
    () => () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    },
    []
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = event.clientX;
    scrollStartRef.current = container.scrollLeft;
    scheduleAutoResume();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;
    if (!hasDraggedRef.current && Math.abs(deltaX) <= DRAG_THRESHOLD_PX) {
      return;
    }

    hasDraggedRef.current = true;
    container.scrollLeft = scrollStartRef.current - deltaX;
  };

  const handlePointerEnd = () => {
    isDraggingRef.current = false;

    if (hasDraggedRef.current) {
      suppressClickUntilRef.current = performance.now() + CLICK_SUPPRESS_AFTER_DRAG_MS;
    }

    hasDraggedRef.current = false;
    scheduleAutoResume();
  };

  if (products.length === 0) {
    return <p className="text-sm text-slate-500">No featured products available right now.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500">Swipe or drag cards. Auto-scroll continues when idle.</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              scheduleAutoResume();
              moveCarousel(-1);
            }}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-300 bg-white px-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            aria-label="Scroll featured products left"
          >
            {"<"}
          </button>
          <button
            type="button"
            onClick={() => {
              scheduleAutoResume();
              moveCarousel(1);
            }}
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-300 bg-white px-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            aria-label="Scroll featured products right"
          >
            {">"}
          </button>
        </div>
      </div>

      <div className="catalog-wheel-wrap">
        <button
          type="button"
          onClick={() => {
            scheduleAutoResume();
            moveCarousel(-1);
          }}
          className="catalog-wheel-nav catalog-wheel-nav-left"
          aria-label="Scroll featured products left"
        >
          {"<"}
        </button>

        <div
          ref={containerRef}
          className="catalog-wheel-scroll"
          onMouseEnter={() => setIsAutoPaused(true)}
          onMouseLeave={scheduleAutoResume}
          onFocusCapture={() => setIsAutoPaused(true)}
          onBlurCapture={scheduleAutoResume}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onPointerLeave={handlePointerEnd}
        >
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="catalog-wheel-card"
              onClick={(event) => {
                if (performance.now() < suppressClickUntilRef.current) {
                  event.preventDefault();
                }
              }}
            >
              {product.images[0] ? (
                <Image
                  suppressHydrationWarning
                  src={product.images[0]}
                  alt={product.name}
                  width={220}
                  height={220}
                  className="h-36 w-full rounded-xs bg-slate-100 object-cover"
                />
              ) : (
                <div className="h-36 w-full rounded-xs bg-slate-100" />
              )}
              <p className="mt-3 text-sm font-semibold text-slate-800">{product.name}</p>
              <p className="mt-1 text-xs text-cyan-700">{product.priceRange}</p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            scheduleAutoResume();
            moveCarousel(1);
          }}
          className="catalog-wheel-nav catalog-wheel-nav-right"
          aria-label="Scroll featured products right"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
