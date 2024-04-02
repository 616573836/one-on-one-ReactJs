import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyMDI5MTIxLCJpYXQiOjE3MTIwMjczMjEsImp0aSI6IjlkMDA0ZWEzZWZhZjRiYjliNmQyMDdiMGViMmU3MjM3IiwidXNlcl9pZCI6MX0.EvCCrSS-r0_znqJC23FMdxxpXRsP4M03PLoSZX7MlMQ'

const MeetingDetail = () => {
    let { meetingId } = useParams();
    const navigate = useNavigate();
    let [meeting, setMeeting] = useState(null);

    useEffect(() => {
        let fetchMeetingDetails = async () => {
            try {
                let response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                let data = await response.json();
                setMeeting(data);
            } catch (error) {
                console.error("Failed to fetch meeting details:", error);
            }
        };

        fetchMeetingDetails();
    }, [meetingId]);

    if (!meeting) {
        return <div>Requested meeting does not exist or unauthorized</div>;
    }

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

    return (
        <div style={styles.container}>
            <h1>{meeting.name}</h1>
            <p>Description: {meeting.description}</p>
            <p>State: {meeting.state}</p>
            <p>Created: {formatTimestamp(meeting.created_time)}</p>
            <button style={styles.backButton} onClick={() => navigate("/meetings")}>
                Back
            </button>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        lineHeight: '1.6',
        maxWidth: '600px',
        margin: '20px auto',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    backButton: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        display: 'inline-block',
        textDecoration: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '5px',
    },
};

export default MeetingDetail;