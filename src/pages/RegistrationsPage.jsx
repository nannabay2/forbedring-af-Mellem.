import { useEffect, useState } from "react";
import { Link } from "react-router";
import Footer from "../components/Footer";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_APIKEY;
const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

export default function RegistrationsPage() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);

  useEffect(() => {
    async function getAllData() {
      try {
        const [eventsResponse, registrationsResponse] = await Promise.all([
          fetch(`${SUPABASE_URL}/events?order=date.asc`, { headers }),
          fetch(`${SUPABASE_URL}/registrations?order=createdAt.desc`, {
            headers,
          }),
        ]);

        if (!eventsResponse.ok) {
          throw new Error(`Kunne ikke hente events: ${eventsResponse.status}`);
        }

        if (!registrationsResponse.ok) {
          throw new Error(
            `Kunne ikke hente tilmeldinger: ${registrationsResponse.status}`,
          );
        }

        const eventsData = await eventsResponse.json();
        const registrationsData = await registrationsResponse.json();

        setEvents(eventsData);
        setRegistrations(registrationsData);
        setRegistrationCount(registrationsData.length);
      } catch (error) {
        console.error(error);
        setEvents([]);
        setRegistrations([]);
        setRegistrationCount(0);
      }
    }

    getAllData();
  }, []);

  const groupedEvents = events.map((event) => {
    const attendees = registrations.filter((registration) => {
      const eventIds = [
        registration.event_id,
        registration.eventId,
        registration.event?.id,
      ].filter(Boolean);

      const titleMatches =
        registration.eventTitle === event.title ||
        registration.event_title === event.title ||
        registration.title === event.title;

      return eventIds.includes(event.id) || titleMatches;
    });

    return {
      ...event,
      attendees,
    };
  });

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        <div className="registration-grid">
          {groupedEvents.length === 0 ? (
            <p className="registration-empty-state">Ingen events fundet.</p>
          ) : (
            groupedEvents.map((event) => (
              <article className="event-card registration-card" key={event.id}>
                <div className="event-card-content">
                  <div className="registration-card-header">
                    <p className="event-category registration-category">
                      {event.category || "Event"}
                    </p>
                    <Link
                      className="registration-event-link"
                      to={`/events/${event.id}`}
                    >
                      {event.title}
                    </Link>
                  </div>

                  <div className="registration-attendees">
                    {event.attendees.length > 0 ? (
                      event.attendees.map((registration) => {
                        const fullName =
                          [registration.first_name, registration.last_name]
                            .filter(Boolean)
                            .join(" ") ||
                          registration.name ||
                          "Ukendt";

                        return (
                          <div
                            className="registration-person"
                            key={registration.id}
                          >
                            <strong>{fullName}</strong>
                            <small>
                              {registration.email || "Ingen email registreret"}
                            </small>
                          </div>
                        );
                      })
                    ) : (
                      <div className="registration-empty">
                        Ingen tilmeldte endnu.
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
