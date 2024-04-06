
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from "react-router-dom";

const Calendar = () => {
    let { meetingID, userID } = useParams();
    const [calendarData, setCalendarData] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const navigate = useNavigate();

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        fetchCalendarData();
    }, [meetingID, userID]);

    const fetchCalendarData = async () => {
        try {
            const response = await axios.get(`/api/meetings/${meetingID}/members/${userID}/calendar/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setCalendarData(response.data);
            if(response.data) console.warn("has data")
            else console.warn("no data")
            // Extract start and end dates from calendar data
            setStartDate(new Date(response.data.start_date));
            setEndDate(new Date(response.data.end_date));
        } catch (error) {
            console.error('Error fetching calendar data:', error);
            setCalendarData(null);
        }
    };

    const renderCalendar = () => {
        if (!calendarData || !startDate || !endDate) {
            return <div>Loading...</div>;
        }

        const timeSlots = [];
        for (let i = 0; i < 24; i++) {
            const time = i % 2 === 0 ? `${Math.floor(i / 2)}:00 AM` : `${Math.floor(i / 2)}:30 AM`;
            timeSlots.push(time);
        }

        for (let i = 24; i < 48; i++) {
            const time = i % 2 === 0 ? `${Math.floor(i / 2)}:00 PM` : `${Math.floor(i / 2)}:30 PM`;
            timeSlots.push(time);
        }
        
        // Calculate the number of days and hours between start and end dates
        const dayDifference = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const hourDifference = 24;

        const rows = [];
        for(let day = 0; day < dayDifference && day < 5; day++){
            for(let hour = 0; hour < hourDifference; hour++){
                // Calculate the date for the current cell
                // const currentDate = new Date(startDate);
                // currentDate.setDate(startDate.getDate() + day);
                // currentDate.setHours(startDate.getHours() + hour);
                //
                // // Push the cell to the row
                // cells.push(
                //     <td key={`${hour}-${day}`}>
                //         {/* Render the cell content (e.g., date and time) */}
                //         {currentDate.toLocaleString()}
                //     </td>
                // );
            }
            // Push the row to the table rows array
            // rows.push(<tr key={hour}>{cells}</tr>);
        }

        // Return the generated table
        return (
            <>
                <h1>{calendarData.owner}'s Calendar</h1>
                <h2>{months[startDate.getMonth()]} {startDate.getFullYear()}</h2>
                <div>
                    <button title="Previous week" type="button">
                        &lt;
                    </button>
                    <button title="Next week" type="button">
                        &gt;
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th/>
                            {weekdays.map((weekday) => {
                                return <th className="weekday"><p>{weekday}</p></th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((time, index) => (
                            <tr key={index}>
                                <td>{time}</td>
                                {weekdays.map((day, idx) => (
                                    <td key={idx}>
                                        <button className="transparent-button"
                                                onClick={() => console.log(`Clicked ${day} at ${time}`)}>
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    };

    return (
        <div>
            {calendarData ? (renderCalendar()) : (<div>The user has not created a calendar.</div>)}
            <button style={styles.eventsButton} onClick={
                () => navigate(`/meetings/${meetingID}/members/${userID}/calendar/events`,
                    { state: { calendarId: calendarData.id }})}>
                Events
            </button>
        </div>
    );
};

export default Calendar;

export async function checkIfEventsExist(meetingId, userId) {
    try {
        // Make a GET request to fetch the list of events for the specified calendar
        const response = await axios.get(`/api/meetings/${meetingId}/members/${userId}/calendar/events/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        // Check if the response is successful (status code 200)
        if (response.data) {
            const eventData = await response.data;

            // Check if the list of events is not empty
            return eventData.length > 0;
        } else {
            // Handle the case where the request is not successful
            console.error('Failed to fetch events:', response.statusText);
            return false;
        }
    } catch (error) {
        // Handle any errors that occur during the fetch operation
        console.error('Error fetching events:', error.message);
        return false;
    }
}

const styles = {
    eventsButton: {
        padding: '10px 20px',
        textDecoration: 'none',
        transition: 'all 0.5s',
        textAlign: 'center',
        display: 'inline-block',
        marginTop: '10px',
        marginRight: '5px',
        marginLeft: '5px',
        marginBottom: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
    },
}