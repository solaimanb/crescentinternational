export type ContactOption = {
  label: string;
  value: string;
};

export type HomeContent = {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: string;
  bannerImageAlt: string;
  logoImage: string;
  logoImageAlt: string;
  wheelTitle: string;
  wheelCtaLabel: string;
  wheelCtaHref: string;
  wheelProductsPerCategory: number;
};

export type ContactContent = {
  title: string;
  intro: string;
  phoneLabel: string;
  phoneValue: string;
  emailLabel: string;
  emailValue: string;
  purchaseSectionTitle: string;
  whatsappButtonLabel: string;
  emailButtonLabel: string;
  phoneButtonLabel: string;
  tempButtonLabel: string;
  whatsappPopupTitle: string;
  emailPopupTitle: string;
  phonePopupTitle: string;
  defaultWhatsappHref: string;
  defaultTempHref: string;
  whatsappOptions: ContactOption[];
  phoneOptions: ContactOption[];
  emailOptions: ContactOption[];
};

export type FooterContent = {
  brandName: string;
  description: string;
  homeButtonLabel: string;
  homeButtonHref: string;
  categoriesButtonLabel: string;
  categoriesButtonHref: string;
  contactButtonLabel: string;
  contactButtonHref: string;
  aboutButtonLabel: string;
  aboutButtonHref: string;
  findUsLabel: string;
  mapPlaceLabel: string;
  mapUrl: string;
  phoneLabel: string;
  phones: string[];
  emailLabel: string;
  emails: string[];
  addressLabel: string;
  addressValue: string;
  footerNote: string;
};

export type ProductContact = {
  whatsappHref: string;
  phoneValue: string;
  emailValue: string;
};
