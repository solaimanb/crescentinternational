"use client";

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";
import FindUsMapLink from "@/components/contact/find-us-map-link";
import { cn } from "@/lib/utils";

function parseLatLng(mapUrl: string): { latitude: number; longitude: number } | null {
  try {
    const parsed = new URL(mapUrl);
    const query = parsed.searchParams.get("q") || parsed.searchParams.get("query") || "";
    const match = query.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (!match) {
      return null;
    }
    const latitude = Number(match[1]);
    const longitude = Number(match[2]);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }
    return { latitude, longitude };
  } catch {
    return null;
  }
}

export default function FindUsMap({
  mapUrl,
  placeLabel,
  address,
  className,
}: {
  mapUrl: string;
  placeLabel: string;
  address?: string;
  className?: string;
}) {
  const coords = parseLatLng(mapUrl);

  if (!coords) {
    return (
      <FindUsMapLink
        href={mapUrl}
        className="mt-2 inline-flex rounded-xs border border-cyan-400 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
      >
        {placeLabel}
      </FindUsMapLink>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <div
        data-lenis-prevent
        className={cn("h-52 overflow-hidden rounded-xs ring-1 ring-white/10", className)}
      >
        <Map center={[coords.longitude, coords.latitude]} zoom={14} theme="light" cooperativeGestures>
          <MapControls showZoom showCompass={false} showLocate={false} />
          <MapMarker longitude={coords.longitude} latitude={coords.latitude}>
            <MarkerContent>
              <div className="size-4 rounded-full border-2 border-white bg-cyan-500 shadow-lg" />
            </MarkerContent>
            <MarkerTooltip>{placeLabel}</MarkerTooltip>
            <MarkerPopup>
              <div className="space-y-2">
                <p className="font-medium text-foreground">{placeLabel}</p>
                {address ? <p className="text-xs leading-5 text-muted-foreground">{address}</p> : null}
                <FindUsMapLink href={mapUrl} className="text-xs font-semibold text-primary underline-offset-4 hover:underline">
                  Directions
                </FindUsMapLink>
              </div>
            </MarkerPopup>
          </MapMarker>
        </Map>
      </div>
      <FindUsMapLink href={mapUrl} className="inline-flex text-sm font-semibold text-cyan-200 transition hover:text-cyan-100">
        {placeLabel}
      </FindUsMapLink>
    </div>
  );
}
