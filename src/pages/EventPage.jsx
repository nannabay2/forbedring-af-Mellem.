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
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

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
    setFormMessage({ type: "", text: "" });

    const nextErrors = {
      firstName: !firstName.trim() ? "Fornavn er påkrævet." : "",
      lastName: !lastName.trim() ? "Efternavn er påkrævet." : "",
      email: !email.trim()
        ? "E-mail er påkrævet."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
          ? "Indtast en gyldig e-mailadresse."
          : "",
    };

    setFieldErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      setFormMessage({
        type: "error",
        text: "Ret de markerede felter for at fortsætte.",
      });
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    const buildPayload = (useLegacyName = false) => ({
      ...(useLegacyName
        ? { name: fullName }
        : {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          }),
      email: email.trim(),
      status: "Ny",
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: `${event.venueName}, ${event.venueCity}`,
    });
    const payload = buildPayload(false);

    const submitPayload = async (payload) => {
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

      return true;
    };

    try {
      await submitPayload(payload);

      setFirstName("");
      setLastName("");
      setEmail("");
      setFieldErrors({ firstName: "", lastName: "", email: "" });
      setFormMessage({ type: "success", text: "Din tilmelding er sendt." });
    } catch (error) {
      const legacySchemaError =
        error instanceof Error &&
        /(first_name|last_name|column.*registrations|schema cache)/i.test(
          error.message,
        );

      if (legacySchemaError) {
        try {
          await submitPayload(buildPayload(true));
          setFirstName("");
          setLastName("");
          setEmail("");
          window.alert("Din tilmelding er sendt.");
          return;
        } catch (legacyError) {
          console.error(legacyError);
          setFormMessage({
            type: "error",
            text:
              legacyError instanceof Error && legacyError.message
                ? legacyError.message
                : "Der opstod en fejl. Prøv igen.",
          });
          return;
        }
      }

      console.error(error);
      setFormMessage({
        type: "error",
        text:
          error instanceof Error && error.message
            ? error.message
            : "Der opstod en fejl. Prøv igen.",
      });
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
            <label htmlFor="firstName">Fornavn</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(inputEvent) => {
                setFirstName(inputEvent.target.value);
                setFieldErrors((current) => ({
                  ...current,
                  firstName: inputEvent.target.value.trim()
                    ? ""
                    : "Fornavn er påkrævet.",
                }));
              }}
              aria-invalid={Boolean(fieldErrors.firstName)}
              aria-describedby={
                fieldErrors.firstName ? "firstName-error" : undefined
              }
              autoComplete="given-name"
            />
            {fieldErrors.firstName && (
              <p id="firstName-error" role="alert">
                {fieldErrors.firstName}
              </p>
            )}

            <label htmlFor="lastName">Efternavn</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={lastName}
              onChange={(inputEvent) => {
                setLastName(inputEvent.target.value);
                setFieldErrors((current) => ({
                  ...current,
                  lastName: inputEvent.target.value.trim()
                    ? ""
                    : "Efternavn er påkrævet.",
                }));
              }}
              aria-invalid={Boolean(fieldErrors.lastName)}
              aria-describedby={
                fieldErrors.lastName ? "lastName-error" : undefined
              }
              autoComplete="family-name"
            />
            {fieldErrors.lastName && (
              <p id="lastName-error" role="alert">
                {fieldErrors.lastName}
              </p>
            )}

            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(inputEvent) => {
                const nextEmail = inputEvent.target.value;
                setEmail(nextEmail);
                setFieldErrors((current) => ({
                  ...current,
                  email: nextEmail.trim()
                    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail.trim())
                      ? ""
                      : "Indtast en gyldig e-mailadresse."
                    : "E-mail er påkrævet.",
                }));
              }}
              placeholder="dig@example.com"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p id="email-error" role="alert">
                {fieldErrors.email}
              </p>
            )}

            {formMessage.text && (
              <p
                role={formMessage.type === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {formMessage.text}
              </p>
            )}

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
              <a href="mailto:hej@mellemrum.dk">Kontakt os</a>
            </div>
            <div className="footer-link-group">
              <p className="footer-heading">For arrangører</p>
              <Link to="/tilmeldinger">Se tilmeldinger</Link>
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
