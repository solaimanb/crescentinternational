export type CategoryDefinition = {
  slug: string;
  name: string;
};

export type CategoryGroup = CategoryDefinition & {
  products: Product[];
};

export type CategorySettings = {
  slug: string;
  name: string;
  description: string;
  order: number;
  homepageDesktopCount: number;
  homepageMobileCount: number;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  priceRange: string;
  shortDescription: string;
  images: string[];
  contactWhatsapp: string;
  contactEmail: string;
  contactPhone: string;
  contactTemp: string;
  seoHashtags: string[];
  description: string;
};
