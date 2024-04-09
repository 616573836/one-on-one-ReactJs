import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from "react-router-dom";
import EventList from "../events";
import Event from "../event_detail";

const Calendar = () => {
    let { meetingID, userID } = useParams();
    const [calendarData, setCalendarData] = useState(null);
    const [eventID, setEventID] = useState(null);
    const [events, setEvents] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showEventCreate, setShowEventCreate] = useState(false);
    const [showEventEdit, setShowEventEdit] = useState(false);
    const navigate = useNavigate();

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        fetchCalendarData();
        fetchEvents();
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
            // Extract start and end dates from calendar data
            setStartDate(new Date(response.data.start_date));
            setEndDate(new Date(response.data.end_date));
        } catch (error) {
            console.error('Error fetching calendar data:', error);
            setCalendarData(null);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`/api/meetings/${meetingID}/members/${userID}/calendar/events/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching calendar data:', error);
            setEvents([]);
        }
    };

    const handleEventCreate = () => {
        if(!showEventCreate){
            setShowEventCreate(true);
            setShowEventEdit(false);
        }
        else setShowEventCreate(false);
    };

    const handleEventEdit = (eventId) => {
        if(!showEventEdit){
            setShowEventEdit(true);
            setShowEventCreate(false);
            setEventID(eventId);
        }
        else setShowEventEdit(false);
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
        const hourDifference = 48;

        const rows = [];
        for (let hour = 0; hour < hourDifference; hour++) {
            const cells = [];
            cells.push(
                <td key={`${hour}-time`}>
                    {timeSlots[hour]}
                </td>
            );
            for (let day = 0; day < dayDifference && day < 7; day++) {
                // Calculate the date for the current cell
                const currentDate = new Date(startDate.getDate());
                currentDate.setDate(startDate.getDate() + day);
                currentDate.setHours(startDate.getHours() + hour);

                // Check if there is an event at the current time slot
                const event = events.find(event => {
                    const eventStartTime = new Date(event.start_time);
                    return currentDate.getDate() === eventStartTime.getDate() &&
                        currentDate.getHours() === eventStartTime.getHours();
                });

                // Render a button if there is an event, otherwise render an empty cell
                if (event) {
                    console.warn("current date " + currentDate.getDate() + "; current hour " +
                                currentDate.getHours() + ". event start date " + event.start_time);
                    let buttonColor = '';
                    switch (event.availability) {
                        case 'available':
                            buttonColor = 'green';
                            break;
                        case 'moderate':
                            buttonColor = 'yellow';
                            break;
                        case 'busy':
                            buttonColor = 'red';
                            break;
                        default:
                            buttonColor = 'transparent';
                            break;
                    }

                    // Calculate rowspan if the event spans multiple rows (longer than 30 minutes)
                    const rowspan = Math.ceil((new Date(event.end_time) - currentDate) / (1000 * 60 * 30));

                    // Render a button to display event details
                    cells.push(
                        // rowSpan={rowspan}
                        <td key={`event-${event.id}`} >
                            <button style={{ backgroundColor: buttonColor }}
                                    onClick={() => handleEventEdit(event.id)}>
                            </button>
                        </td>
                    );

                    // Skip additional cells covered by the rowspan
                    // for (let i = 1; i < rowspan; i++) {
                    //     cells.push(null);
                    // }
                } else {
                    // Render an empty cell
                    cells.push(
                        <td key={`${hour}-${day}`} >
                            <button className="transparent-button"
                                    onClick={handleEventCreate}>
                            </button>
                        </td>
                    );
                }
            }
            rows.push(<tr key={hour}>{cells}</tr>);
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
                                return (
                                    <th className="weekday">
                                        <p>{weekday}</p>
                                        <p>{months[startDate.getMonth()]}</p>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
                {showEventCreate && <EventList calendarID={calendarData.id} meetingID={meetingID} userID={userID} flag = {false}/>}
                {showEventEdit && <Event meetingID={meetingID} userID={userID} eventID={eventID} flag = {false}/>}
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