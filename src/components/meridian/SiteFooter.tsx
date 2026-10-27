import { isTodo, site } from "@/content/site";

/** Footer from the previous NODO site, shared by the page and every project overlay. */
export function SiteFooter({ id }: { id?: string }) {
  const { footer, contact } = site;
  // "mailto" links go to the studio email once it is filled in; until then, to the footer.
  const href = (h: string) =>
    h === "mailto" ? (isTodo(contact.email) ? "#contact" : `mailto:${contact.email}`) : h;
  return (
    <footer id={id} className="nd-footer">
      <div className="nd-footer__top">
        <p>{footer.topLeft}</p>
        <p>{footer.topCenter}</p>
        <p>{footer.topRight}</p>
      </div>

      <div className="nd-footer__center">
        <div className="nd-footer__frame">
          <p className="nd-footer__statement">
            {footer.statementLines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="nd-footer__cols">
        {footer.columns.map((col) => (
          <div key={col.label}>
            <p className="nd-footer__label">{col.label}</p>
            <div className={col.links && !col.lines ? "nd-footer__nav" : undefined}>
              {col.lines?.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {col.links?.map((link) => (
                <a key={link.label} href={href(link.href)} className="nd-footer__link">
                  {link.label}
                </a>
              ))}
              {col.socials &&
                contact.socials.map((social) =>
                  isTodo(social.href) ? (
                    <p key={social.label} title={social.href}>
                      {social.label} (TODO)
                    </p>
                  ) : (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="nd-footer__link"
                    >
                      {social.label}
                    </a>
                  ),
                )}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
