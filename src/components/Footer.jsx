import { Link } from "react-router";

const footerGroups = [
  {
    title: "Udforsk",
    links: [{ label: "Events", to: "/" }],
  },
  {
    title: "Om Mellemrum",
    links: [
      { label: "Om Mellemrum", to: "/om" },
      { label: "Kontakt os", href: "mailto:hej@mellemrum.dk" },
    ],
  },
  {
    title: "For arrangører",
    links: [{ label: "Se tilmeldinger", to: "/tilmeldinger" }],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-intro">
          <p className="footer-brand">
            mellemrum<span>.</span>
          </p>
          <p>Udvalgte kulturoplevelser og nye perspektiver på Aarhus.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          {footerGroups.map((group) => (
            <div key={group.title} className="footer-link-group">
              <p className="footer-heading">{group.title}</p>
              {group.links.map((link) =>
                link.to ? (
                  <Link key={link.label} to={link.to}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ),
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <p className="footer-meta">© 2026 Mellemrum</p>
        <p>Aarhus, Danmark</p>
      </div>
    </footer>
  );
}
