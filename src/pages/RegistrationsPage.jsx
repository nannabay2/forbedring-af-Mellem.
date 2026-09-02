import { useEffect, useState } from "react";
import { Link } from "react-router";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_APIKEY;
const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);

  useEffect(() => {
    async function getRegistrations() {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/registrations?order=createdAt.desc`,
          { headers },
        );

        if (!response.ok) {
          throw new Error(`Kunne ikke hente tilmeldinger: ${response.status}`);
        }

        const data = await response.json();
        setRegistrations(data);
        setRegistrationCount(data.length);
      } catch (error) {
        console.error(error);
        setRegistrations([]);
        setRegistrationCount(0);
      }
    }

    getRegistrations();
  }, []);

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        <div className="registration-list">
          <div className="registration-row registration-labels">
            <span>Navn</span>
            <span>Event</span>
            <span>Dato</span>
            <span>Status</span>
          </div>
          {registrations.map((registration) => {
            const fullName =
              [registration.first_name, registration.last_name]
                .filter(Boolean)
                .join(" ") ||
              registration.name ||
              "Ukendt";

            return (
              <div className="registration-row" key={registration.id}>
                <div>
                  <strong>{fullName}</strong>
                  <small>{registration.email}</small>
                </div>
                <span>{registration.eventTitle}</span>
                <span>
                  {new Date(registration.eventDate).toLocaleDateString("da-DK")}
                </span>
                <span className="status">{registration.status}</span>
              </div>
            );
          })}
        </div>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-intro">
            <p className="footer-brand">
              mellemrum<span>.</span>
            </p>
            <p>Udvalgte kulturoplevelser og nye perspektiver på Aarhus.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <div className="footer-link-group">
              <p className="footer-heading">Udforsk</p>
              <Link to="/">Events</Link>
              <Link to="/om">Om Mellemrum</Link>
            </div>
            <div className="footer-link-group">
              <p className="footer-heading">For arrangører</p>
              <Link to="/tilmeldinger">Se tilmeldinger</Link>
              <a href="mailto:hej@mellemrum.dk">Kontakt os</a>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-meta">© 2026 Mellemrum</p>
          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}
