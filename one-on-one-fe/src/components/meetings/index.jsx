import React, { useState, useEffect } from 'react'
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyMDEzOTg0LCJpYXQiOjE3MTIwMTIxODQsImp0aSI6ImMxN2Q5MGZlM2ViZDQzNDI5MTI2NjUzOGFkNmFhYTliIiwidXNlcl9pZCI6MX0.Oth2pUAT6gxsTBNL-AIr0WT-t1-xJPz-oOPUSKz348o'
const MeetingList = () => {

    let [meetings, setMeetings] = useState([])

    useEffect(() => {
        getMeetings()
    }, [])


    let getMeetings = async () => {

        let response = await fetch('http://127.0.0.1:8000/api/meetings/', {
            method: 'GET', // or 'POST' if you are sending data to the server
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + AUTH_TOKEN
            }
          })
        let data = await response.json()
        setMeetings(data.results)
    }

    return (
        <div>
            <div className="meeting-list">
                {meetings.map((meeting, index) => (
                    <h2 key={index}>{meeting.name} <br></br>
                    Description: {meeting.description} <br></br>
                    Created: {meeting.created_time} <br></br>
                    Current State: {meeting.state}
                    </h2>
                ))}
            </div>
        </div>
    )
}

export default MeetingList