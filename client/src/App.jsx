import { useEffect, useState } from 'react';
import './App.css'; 

function App() {
  const [events, setEvents] = useState([]);

  // Form States
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // This URL is your Live Backend on Render
  const API_URL = "https://temple-app-x27s.onrender.com";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    fetch(`${API_URL}/events`)
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error("Error:", error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = { title, date, location, description, image };

    try {
      const response = await fetch(`${API_URL}/create-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        alert("✨ Festival Added Successfully!");
        // Clear form
        setTitle("");
        setDate("");
        setLocation("");
        setDescription("");
        setImage("");
        // Refresh list
        fetchEvents();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      try {
        await fetch(`${API_URL}/events/${id}`, {
          method: 'DELETE',
        });
        fetchEvents();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  return (
    <div className="app-container">

      {/* Header Section */}
      <header className="header">
        <h1>🕉️ Temple Manager</h1>
        <p>Organize festivals, events, and darshan timings.</p>
      </header>

      {/* Form Section */}
      <div className="form-container">
        <h2>➕ Add New Festival</h2>
        <form onSubmit={handleSubmit} className="input-group">
          <input
            type="text"
            placeholder="Event Title (e.g. Diwali Mahotsav)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <input
              type="text"
              placeholder="Location (e.g. Main Hall)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          <input
            type="text"
            placeholder="Image URL (Paste a link from Google Images)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={{ width: '100%' }}
          />
          <textarea
            placeholder="Description of the event..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="3"
          />
          <button type="submit" className="submit-btn">Add Event</button>
        </form>
      </div>

      {/* Events Display Section */}
      <div className="events-section">
        <h2 style={{ color: '#333', marginBottom: '20px' }}>📅 Upcoming Events</h2>

        {events.length === 0 ? (
          <p className="empty-message">No upcoming events. Add one above! 🌸</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                
                {/* 1. Image Section (Now at the top) */}
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "15px" }}
                  />
                )}

                {/* 2. Header Section (Title + Delete Button) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0 }}>{event.title}</h3>
                  <button
                    onClick={() => handleDelete(event._id)}
                    style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    🗑️
                  </button>
                </div>

                {/* 3. Details Section */}
                <div className="card-details">
                  <p><strong>📅 Date:</strong> {new Date(event.date).toDateString()}</p>
                  <p><strong>📍 Loc:</strong> {event.location}</p>
                </div>
                <p style={{ marginTop: '10px', color: '#555' }}>{event.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default App;