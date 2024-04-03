// EventList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EventList({ match }) {
    const { meetingId, memberId } = useParams(); 
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        name: '',
        description: '',
        availability: 'busy', // default
        start_time: '',
        end_time: '',
        calendar: 1,
    });

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/members/${memberId}/calendar/events/`, {
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
        const { name, value } = e.target; // Destructuring to get name and value from the event target
        setNewEvent(prevState => ({
            ...prevState, // Spread to copy the existing state
            [name]: value // Use computed property name to update the right property based on the input name
        }));
    };

    let handleSubmit = async (e) => {
        e.preventDefault(); 
        let response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/members/${memberId}/calendar/events/`, {
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
    };

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
      
        return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
    }

    useEffect(() => {
        fetchEvents();
    }, []); 

    return (
        <div>
            <h2>Events</h2>
            <div>
                {events?.map((event, index) => (
                    <div key={index}>
                        <h5>Event No.{event.id}: {event.name}</h5>
                        <p>{event.description}</p>
                        <p>Availability: {event.availability}</p>
                        <p>Start Time: {formatTimestamp(event.start_time)}</p>
                        <p>End Time: {formatTimestamp(event.end_time)}</p>
                        <p>Created Time: {formatTimestamp(event.created_time)}</p>
                    </div>
                ))}
            </div>
            <h4>Add New Event</h4>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" value={newEvent.name} onChange={handleInputChange} required />
                <input name="description" placeholder="Description" value={newEvent.description} onChange={handleInputChange} />
                <select name="availability" value={newEvent.availability} onChange={handleInputChange}>
                    <option value="busy">Busy</option>
                    <option value="moderate">Moderate</option>
                    <option value="available">Available</option>
                </select>
                <input name="start_time" type="datetime-local" value={newEvent.start_time} onChange={handleInputChange} required />
                <input name="end_time" type="datetime-local" value={newEvent.end_time} onChange={handleInputChange} required />
                <input name="calendar" type="number" value={newEvent.calendar} onChange={handleInputChange} required />
                <button type="submit">Add Event</button>
            </form>
        </div>
    );
}

export default EventList;