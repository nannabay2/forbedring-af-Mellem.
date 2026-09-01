import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_APIKEY;
const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getEvent() {
      const response = await fetch(`${SUPABASE_URL}/events?id=eq.${eventId}`, {
        headers,
      });
      const data = await response.json();
      setEvent(data[0]);
    }

    getEvent();
  }, [eventId]);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();
    setErrorMessage("");

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErrorMessage("Udfyld fornavn, efternavn og e-mail.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setErrorMessage("Indtast en gyldig e-mailadresse.");
      return;
    }

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      status: "Ny",
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: `${event.venueName}, ${event.venueCity}`,
    };

    try {
      const response = await fetch(`${SUPABASE_URL}/registrations`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let errorDetails = "";

      try {
        const parsed = JSON.parse(responseText);
        if (parsed?.message) {
          errorDetails = parsed.message;
        }
      } catch {
        errorDetails = responseText || "";
      }

      if (!response.ok) {
        throw new Error(
          errorDetails || `Kunne ikke tilmelde: ${response.status}`,
        );
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      window.alert("Din tilmelding er sendt.");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Der opstod en fejl. Prøv igen.",
      );
    }
  }

  if (!event) {
    return null;
  }

  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img src={event.image} alt="" />
          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>
            <h1>{event.title}</h1>
            <p className="lead">{event.summary}</p>
            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Sted</strong>
                <span>
                  {event.venueName}
                  <br />
                  {event.venueAddress}, {event.venuePostalCode}{" "}
                  {event.venueCity}
                  {event.venueWebsite && (
                    <>
                      <br />
                      <a href={event.venueWebsite}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>
              <p>
                <strong>Pris</strong>
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>
            <p>{event.description}</p>
          </div>
        </section>

        <section className="signup-panel">
          <div>
            <p className="eyebrow dark">Tilmelding</p>
            <h2>Reserver din plads</h2>
            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <label>
              Fornavn
              <input
                value={firstName}
                onChange={(inputEvent) => setFirstName(inputEvent.target.value)}
              />
            </label>
            <label>
              Efternavn
              <input
                value={lastName}
                onChange={(inputEvent) => setLastName(inputEvent.target.value)}
              />
            </label>
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(inputEvent) => setEmail(inputEvent.target.value)}
              placeholder="dig@example.com"
            />
            {errorMessage && <p role="alert">{errorMessage}</p>}
            <button type="submit">Tilmeld mig</button>
          </form>
        </section>
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
          <p className="footer-meta">© 2025 Mellemrum</p>
          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}
