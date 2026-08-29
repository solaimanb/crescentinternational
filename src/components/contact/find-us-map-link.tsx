"use client";

type FindUsMapLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

function extractMapQuery(mapUrl: string): string {
  try {
    const parsed = new URL(mapUrl);
    return parsed.searchParams.get("q") || parsed.searchParams.get("query") || parsed.searchParams.get("destination") || "";
  } catch {
    return "";
  }
}

function buildMobileMapUrl(mapUrl: string): string {
  if (typeof navigator === "undefined") {
    return "";
  }

  const query = extractMapQuery(mapUrl);
  const ua = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) {
    return query ? `comgooglemaps://?q=${encodeURIComponent(query)}` : "";
  }

  if (/android/.test(ua)) {
    return query
      ? `intent://maps.google.com/?q=${encodeURIComponent(query)}#Intent;scheme=https;package=com.google.android.apps.maps;end`
      : "";
  }

  return "";
}

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod|android/.test(ua);
}

export default function FindUsMapLink({ href, className, children }: FindUsMapLinkProps) {
  const safeHref = href || "#";

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isMobileDevice()) {
      return;
    }

    const appUrl = buildMobileMapUrl(safeHref);
    if (!appUrl) {
      return;
    }

    event.preventDefault();

    const fallbackTimer = setTimeout(() => {
      window.location.href = safeHref;
    }, 900);

    window.location.href = appUrl;

    setTimeout(() => {
      clearTimeout(fallbackTimer);
    }, 1500);
  };

  return (
    <a href={safeHref} onClick={handleClick} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
