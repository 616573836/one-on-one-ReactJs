import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyMDI3MTQ2LCJpYXQiOjE3MTIwMjUzNDYsImp0aSI6IjFlNDdmMzY0Mjk2NDQwNTNiMjFkZTgzMzI4N2Y1MTU3IiwidXNlcl9pZCI6MX0.n9pma4CsAcS02Jj--A6IotfPIIYFGBjQr5vl68xvPFA'

const MeetingDetail = () => {
    let { meetingId } = useParams(); // This hooks allows us to access the parameter in the URL
    let [meeting, setMeeting] = useState(null);

    useEffect(() => {
        let fetchMeetingDetails = async () => {
            let response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AUTH_TOKEN
                }
            });
            let data = await response.json();
            setMeeting(data);
        };

        fetchMeetingDetails();
    }, [meetingId]);

  if (!meeting) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1>{meeting.name}</h1>
      <p>Description: {meeting.description}</p>
      <p>State: {meeting.state}</p>
      <p>Created: {meeting.created_time}</p>
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
};

export default MeetingDetail;