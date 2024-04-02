import React, { useState, useEffect } from 'react'
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyMDIyNzA1LCJpYXQiOjE3MTIwMjA5MDUsImp0aSI6IjVhYjBkZGM3MDI2YjQwYWM5YTk4YjRkOTQ1YWEzY2MyIiwidXNlcl9pZCI6MX0.0ZPhy_RAidEiILjBXG47Yyl37IJT5E870LenOuJk32c'

const MeetingList = () => {
    let [meetings, setMeetings] = useState([]);
    let [meetingName, setMeetingName] = useState('');
    let [meetingDescription, setMeetingDescription] = useState('');

    useEffect(() => {
        getMeetings();
    }, []);

    let getMeetings = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/meetings/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + AUTH_TOKEN
            }
        });
        let data = await response.json();
        setMeetings(data.results);
    };

    let createMeeting = async (e) => {
        e.preventDefault(); 
        let response = await fetch('http://127.0.0.1:8000/api/meetings/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + AUTH_TOKEN
            },
            body: JSON.stringify({
                name: meetingName,
                description: meetingDescription,
            }),
        });

        if(response.ok) {
            setMeetingName('');
            setMeetingDescription('');
            getMeetings();
        }
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

    return (
        <div style={styles.container}>
            <form onSubmit={createMeeting} style={styles.form}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Meeting Name"
                    value={meetingName}
                    onChange={(e) => setMeetingName(e.target.value)}
                />
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Meeting Description"
                    value={meetingDescription}
                    onChange={(e) => setMeetingDescription(e.target.value)}
                />
                <button type="submit" style={styles.button}>Create Meeting</button>
            </form>
            <div style={styles.meetingList}>
                {meetings.map((meeting, index) => (
                    <div key={index} style={styles.meetingItem}>
                        <h2>{meeting.name}</h2>
                        <p>Description: {meeting.description}</p>
                        <p>Created: {formatTimestamp(meeting.created_time)}</p>
                        <p>Current State: {meeting.state}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    form: {
        marginBottom: '20px',
    },
    input: {
        marginRight: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '200px',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer',
    },
    meetingList: {
        marginTop: '20px',
    },
    meetingItem: {
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
        marginBottom: '10px',
    },
};

export default MeetingList;