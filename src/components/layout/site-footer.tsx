import CmsLink from "@/components/layout/cms-link";
import FindUsMapLink from "@/components/contact/find-us-map-link";
import type { FooterContent } from "@/lib/content/types";

function phoneToHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export default function SiteFooter({ footerContent }: { footerContent: FooterContent }) {
  const buttons = [
    { label: footerContent.homeButtonLabel, href: footerContent.homeButtonHref },
    { label: footerContent.categoriesButtonLabel, href: footerContent.categoriesButtonHref },
    { label: footerContent.contactButtonLabel, href: footerContent.contactButtonHref },
    { label: footerContent.aboutButtonLabel, href: footerContent.aboutButtonHref },
  ];

  return (
    <footer className="mt-12 border-t border-slate-300 bg-slate-900 text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <section>
            <h2 className="text-lg font-bold tracking-tight md:text-xl">{footerContent.brandName}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">{footerContent.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {buttons.map((button) => (
                <CmsLink
                  key={`${button.href}-${button.label}`}
                  href={button.href}
                  className="rounded-full border border-slate-500 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700"
                >
                  {button.label}
                </CmsLink>
              ))}
            </div>
          </section>

          <section>
            <p id="site-footer-find-us" className="text-xs font-bold uppercase tracking-wide text-slate-300">
              {footerContent.findUsLabel}
            </p>
            <FindUsMapLink
              href={footerContent.mapUrl}
              className="mt-2 inline-flex rounded-xs border border-cyan-400 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
            >
              {footerContent.mapPlaceLabel}
            </FindUsMapLink>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">{footerContent.phoneLabel}</p>
                <div className="mt-1 flex flex-col gap-1">
                  {footerContent.phones.map((phone) => (
                    <a
                      key={phone}
                      href={phoneToHref(phone)}
                      className="text-sm font-medium text-slate-100 transition hover:text-cyan-200"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">{footerContent.emailLabel}</p>
                <div className="mt-1 flex flex-col gap-1">
                  {footerContent.emails.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="text-sm font-medium text-slate-100 transition hover:text-cyan-200"
                    >
                      {email}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-300">{footerContent.addressLabel}</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{footerContent.addressValue}</p>
          </section>
        </div>

        <p className="mt-8 border-t border-slate-700 pt-4 text-xs text-slate-400">{footerContent.footerNote}</p>
      </div>
    </footer>
  );
}
