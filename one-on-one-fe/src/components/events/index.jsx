
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function EventList({ calendarID, meetingID, userID, startTime, flag = true}) {
    let {meetingId, memberId} = useParams();
    if(meetingID && userID){
        meetingId = meetingID;
        memberId = userID;
    }

    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { calendarId } = location.state || {};
    const [newEvent, setNewEvent] = useState({
        name: '',
        description: '',
        availability: 'available',
        start_time: startTime ? startTime : '',
        end_time: startTime ? startTime : '',
        calendar: calendarId ? calendarId : calendarID,
    });

    const redirectToDetailPage = (eventId) => {
        navigate(`/meetings/${meetingId}/members/${memberId}/calendar/events/${eventId}`);
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch(`/api/meetings/${meetingId}/members/${memberId}/calendar/events/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            let data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    let handleSubmit = async (e) => {
        e.preventDefault();
        console.warn(newEvent);
        let response = await fetch(`/api/meetings/${meetingId}/members/${memberId}/calendar/events/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(newEvent)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchEvents();
        if (!flag) window.location.reload();
    };

    const handleBack = () => {
        navigate(`/meetings/${meetingId}/members/${memberId}/calendar`);
        window.location.reload();
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div>
            <h2>Events</h2>
            <h4>Add New Event</h4>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.label}>Name</label>
                    <input
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={newEvent.name}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="description" style={styles.label}>Description</label>
                    <input
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={newEvent.description}
                        onChange={handleInputChange}
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="availability" style={styles.label}>Availability</label>
                    <select
                        id="availability"
                        name="availability"
                        value={newEvent.availability}
                        onChange={handleInputChange}
                        style={styles.select}
                    >
                        <option value="busy">Busy</option>
                        <option value="moderate">Moderate</option>
                        <option value="available">Available</option>
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="start_time" style={styles.label}>Start Time</label>
                    <input
                        id="start_time"
                        name="start_time"
                        type="datetime-local"
                        value={newEvent.start_time}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="end_time" style={styles.label}>End Time</label>
                    <input
                        id="end_time"
                        name="end_time"
                        type="datetime-local"
                        value={newEvent.end_time}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>

                <button type="submit" style={styles.button}>Add Event</button>
                <button style={styles.backButton} onClick={handleBack}> Back to calendar</button>
            </form>
            <div>
                {flag && events?.map((event, index) => (
                    <div key={index}>
                        <h5>Event No.{index+1}: {event.name}</h5>
                        <p>{event.description}</p>
                        <p>Availability: {event.availability}</p>
                        <p>Start Time: {formatTimestamp(event.start_time)}</p>
                        <p>End Time: {formatTimestamp(event.end_time)}</p>
                        <p>Created Time: {formatTimestamp(event.created_time)}</p>
                        <button onClick={() => redirectToDetailPage(event.id)}>Detail</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    backButton: {
        display: 'inline-block',
        marginTop: '10px',
        marginRight: '5px',
        marginLeft: '5px',
        marginBottom: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#f4511e',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '500px',
        margin: '20px auto', // Center the form with some margin around it
        padding: '20px', // Padding inside the form for spacing
        border: '2px solid #ccc', // Visible frame around the form
        borderRadius: '8px', // Optional: rounded corners for the frame
        backgroundColor: '#fff', // Background color for the form
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Optional: subtle shadow for depth
    },
    formGroup: {
        marginBottom: '15px',
        textAlign: 'left', // Ensure text aligns to the left
    },
    label: {
        display: 'block', // Ensure the label takes its own line
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    input: {
        padding: '8px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        textAlign: 'left', // Text inside inputs left-aligned
    },
    select: {
        padding: '8px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        textAlign: 'left', // Make sure text in select is left-aligned, might not apply in all browsers
    },
    button: {
        padding: '10px 15px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        textAlign: 'center', // Center text in the button, though it's the default
    }
}

export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
}

export default EventList;
