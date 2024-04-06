import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EventDetail() {
    const { meetingId, memberId, eventId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [eventDetail, setEventDetail] = useState({
        name: '',
        description: '',
        availability: '',
        start_time: '',
        end_time: '',
    });

    useEffect(() => {
        const fetchEventDetail = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/members/${memberId}/calendar/events/${eventId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const adjustedData = {
                    ...data,
                    start_time: data.start_time.slice(0, 16),
                    end_time: data.end_time.slice(0, 16), 
                };                
                setEventDetail(adjustedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event detail:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchEventDetail();
    }, [meetingId, memberId, eventId]);
    
    const handleChange = (e) => {
        setEventDetail({
            ...eventDetail,
            [e.target.name]: e.target.value,
        });
    };

    const handleBack = () => {
        navigate(`/meetings/${meetingId}/members/${memberId}/calendar/events`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        const submissionData = {
            ...eventDetail,
            start_time: new Date(eventDetail.start_time).toISOString().slice(0, 19) + 'Z',
            end_time: new Date(eventDetail.end_time).toISOString().slice(0, 19) + 'Z',
        };
        
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/members/${memberId}/calendar/events/${eventId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify(submissionData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const updatedEvent = await response.json();

            setEventDetail({
                ...updatedEvent,
                start_time: updatedEvent.start_time.slice(0, 16), // For displaying in the input fields correctly
                end_time: updatedEvent.end_time.slice(0, 16),
            });
            alert('Event updated successfully');
        } catch (error) {
            console.error('Error updating event:', error);
            setError(error);
        }
    };
    
    const handleDelete = async () => {
        const isConfirmed = window.confirm("Are you sure to delete this event?");
        if (!isConfirmed) {
            return;
        }
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/members/${memberId}/calendar/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            navigate(`/meetings/${meetingId}/members/${memberId}/calendar/events`);
        } catch (error) {
            console.error('Error deleting event:', error);
            setError(error);
        }
    };
    
    function transformDateTime(dateTimeString) {
        const datePart = dateTimeString.substring(0, 10);
        const timePart = dateTimeString.substring(11, 16);
        return `${datePart}, ${timePart}`;
    }

    return (
        <div style={styles.container}>
            <h2>Event Detail</h2>
            <h5>Event No.{eventDetail.id}: {eventDetail.name}</h5>
            <p>{eventDetail.description}</p>
            <p>Availability: {eventDetail.availability}</p>
            <p>Start Time: {eventDetail.start_time.replace("T", ", ")}</p>
            <p>End Time: {eventDetail.end_time.replace("T", ", ")}</p>
            <p>Created Time: {transformDateTime(eventDetail.created_time)}</p>
            <br></br>
            <hr></hr>
            <br></br>
            <form>
                <input type="text" name="name" value={eventDetail.name} onChange={handleChange} style={styles.largeInput} />
                <textarea name="description" value={eventDetail.description} onChange={handleChange} style={styles.largeTextarea} ></textarea>
                <select name="availability" value={eventDetail.availability} onChange={handleChange}>
                    <option value="busy">Busy</option>
                    <option value="moderate">Moderate</option>
                    <option value="available">Available</option>
                </select>
                <input type="datetime-local" name="start_time" value={eventDetail.start_time || ''} onChange={handleChange} />
                <input type="datetime-local" name="end_time" value={eventDetail.end_time || ''} onChange={handleChange} />
                <select name="calendarId" value={eventDetail.calendarId || ''} onChange={handleChange}></select>
                <button style={styles.button} type="button" onClick={handleUpdate}>Update Event</button>
                <br></br>
                <button style={styles.button} type="button" onClick={handleDelete}>Delete Event</button>
            </form>
            <button style={styles.backButton} onClick={handleBack}>Back</button>
        </div>
    );
}

const styles = {
    largeInput: {
        width: '100%',
        maxWidth: '500px',
        marginBottom: '15px',
        border: '1px solid #ccc', 
        padding: '8px', 
        borderRadius: '4px',
    },
    largeTextarea: {
        width: '100%',
        maxWidth: '500px',
        height: '150px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        padding: '8px', 
        borderRadius: '4px',
    },
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        lineHeight: '1.6',
        maxWidth: '600px',
        margin: '20px auto',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    button: {
        display: 'inline-block',
        marginTop: '10px',
        marginRight: '5px',
        marginLeft: '5px',
        marginBottom: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#f4511e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
    },
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
        backgroundColor: '#007bff',
    },
}

export default EventDetail;