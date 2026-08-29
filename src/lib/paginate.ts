import type { Route } from "next";

export const ADMIN_PAGE_SIZE = 5;

export function paginate<T>(items: T[], pageParam: unknown, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const raw = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const page = Math.min(Math.max(Number(raw) || 1, 1), totalPages);
  return {
    page,
    totalPages,
    items: items.slice((page - 1) * pageSize, page * pageSize),
  };
}

export function pageHref(pathname: string, page: number, query: Record<string, string> = {}): Route {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) {
      params.set(key, value);
    }
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const search = params.toString();
  return (search ? `${pathname}?${search}` : pathname) as Route;
}

export function pageNumbers(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const set = new Set([1, total, current - 1, current, current + 1]);
  const numbers = [...set].filter((item) => item >= 1 && item <= total).sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];

  for (const item of numbers) {
    const previous = items.at(-1);
    if (typeof previous === "number" && item - previous > 1) {
      items.push("ellipsis");
    }
    items.push(item);
  }

  return items;
}
