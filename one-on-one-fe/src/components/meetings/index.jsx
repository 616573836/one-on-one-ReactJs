import React, { useState, useEffect } from 'react'
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyMDEzOTg0LCJpYXQiOjE3MTIwMTIxODQsImp0aSI6ImMxN2Q5MGZlM2ViZDQzNDI5MTI2NjUzOGFkNmFhYTliIiwidXNlcl9pZCI6MX0.Oth2pUAT6gxsTBNL-AIr0WT-t1-xJPz-oOPUSKz348o'

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
        e.preventDefault(); // Prevent default form submission behavior
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
            getMeetings(); // Refresh the list after adding new meeting
        }
    };

    return (
        <div>
            <form onSubmit={createMeeting}>
                <input
                    type="text"
                    placeholder="Meeting Name"
                    value={meetingName}
                    onChange={(e) => setMeetingName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Meeting Description"
                    value={meetingDescription}
                    onChange={(e) => setMeetingDescription(e.target.value)}
                />
                <button type="submit">Create Meeting</button>
            </form>
            <div className="meeting-list">
                {meetings.map((meeting, index) => (
                    <h2 key={index}>{meeting.name} <br/>
                    Description: {meeting.description} <br/>
                    Created: {meeting.created_time} <br/>
                    Current State: {meeting.state}
                    </h2>
                ))}
            </div>
        </div>
    );
};

export default MeetingList;