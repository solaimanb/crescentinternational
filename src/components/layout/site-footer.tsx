import CmsLink from "@/components/layout/cms-link";
import FindUsMap from "@/components/contact/find-us-map";
import type { FooterContent } from "@/lib/content/types";

function copyrightYear() {
  return new Date().getFullYear();
}

function phoneToHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

const labelClass = "text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400";
const linkClass = "text-sm text-slate-200 transition hover:text-white";

export default async function SiteFooter({ footerContent }: { footerContent: FooterContent }) {
  const year = copyrightYear();
  const links = [
    { label: footerContent.homeButtonLabel, href: footerContent.homeButtonHref },
    { label: footerContent.categoriesButtonLabel, href: footerContent.categoriesButtonHref },
    { label: footerContent.contactButtonLabel, href: footerContent.contactButtonHref },
    { label: footerContent.aboutButtonLabel, href: footerContent.aboutButtonHref },
  ];

  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <section className="lg:col-span-4">
            <h2 className="text-xl font-semibold tracking-tight">{footerContent.brandName}</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">{footerContent.description}</p>
          </section>

          <nav aria-label={footerContent.brandName} className="lg:col-span-2">
            <ul className="space-y-2.5">
              {links.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <CmsLink href={item.href} className={linkClass}>
                    {item.label}
                  </CmsLink>
                </li>
              ))}
            </ul>
          </nav>

          <section className="space-y-5 lg:col-span-3">
            <div>
              <p className={labelClass}>{footerContent.addressLabel}</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{footerContent.addressValue}</p>
            </div>
            <div>
              <p className={labelClass}>{footerContent.phoneLabel}</p>
              <div className="mt-2 flex flex-col gap-1">
                {footerContent.phones.map((phone) => (
                  <a key={phone} href={phoneToHref(phone)} className={linkClass}>
                    {phone}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className={labelClass}>{footerContent.emailLabel}</p>
              <div className="mt-2 flex flex-col gap-1">
                {footerContent.emails.map((email) => (
                  <a key={email} href={`mailto:${email}`} className={linkClass}>
                    {email}
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section id="site-footer-find-us" className="scroll-mt-24 lg:col-span-3">
            <p className={labelClass}>{footerContent.findUsLabel}</p>
            <FindUsMap
              mapUrl={footerContent.mapUrl}
              placeLabel={footerContent.mapPlaceLabel}
              address={footerContent.addressValue}
              className="h-48 overflow-hidden rounded-xs ring-1 ring-white/10 lg:h-56"
            />
          </section>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {footerContent.brandName} —{" "}
            <a
              href="https://mrsolo.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition hover:text-white"
            >
              MR.SOLO
            </a>
          </p>
          {footerContent.footerNote ? <p>{footerContent.footerNote}</p> : null}
        </div>
      </div>
    </footer>
  );
}
