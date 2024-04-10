import React, {useEffect, useRef, useState} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import "./CalendarStyles.css";
import EventList from "../events";
import Event from "../event_detail";

const styles = {
    wrap: {
        display: "flex"
    },
    wrapRow: {
        display: "flex",
        flexDirection: "column",
    },
    left: {
        marginRight: "10px"
    },
    main: {
        flexGrow: "1"
    },
    right: {
        marginLeft: "10px"
    },
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
};

const Calendar = () => {
    let { meetingID, userID } = useParams();
    const [calendarData, setCalendarData] = useState(null);
    const [eventID, setEventID] = useState(null);
    const [eventStartTime, setEventStartTime] = useState(null);
    const [events, setEvents] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [showEventCreate, setShowEventCreate] = useState(false);
    const [showEventEdit, setShowEventEdit] = useState(false);
    const navigate = useNavigate();
    const calendarRef = useRef()
    const [calendarConfig, setCalendarConfig] = useState(null)

    useEffect(() => {
        fetchCalendarData();
        fetchEvents();
    }, [meetingID, userID]);

    useEffect(() => {
        setCalendarConfig({
            viewType: "Week",
            durationBarVisible: false,
            timeRangeSelectedHandling: "Enabled",
            contextMenu: new DayPilot.Menu({
                items: [
                    {
                        text: "Delete", onClick: async args => {
                            const dp = calendarRef.current.control;
                            dp.events.remove(args.source);
                            try {
                                const response = await fetch(`/api/meetings/${meetingID}/members/${userID}/calendar/events/${eventID}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                                    },
                                });

                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                window.location.reload();
                            } catch (error) {
                                console.error('Error deleting event:', error);
                            }
                        },
                    },
                    {
                        text: "-"
                    },
                    {
                        text: "Edit...", onClick: async args => {
                            await editEvent(args.source);
                        }
                    }
                ]
            }),
            onTimeRangeSelected: args => {
                const dp = calendarRef.current.control;
                dp.clearSelection();
                setEventStartTime(args.start);
                handleEventCreate();
            },
            onEventClick: args => {
                editEvent(args.e);
            },
            onEventResized: async args => {
                updateEvent(args.e, calendarData?.id)
            },
            onEventMoved: async args => {
                updateEvent(args.e, calendarData?.id)
            },
        })
    }, [calendarData, eventID]);

    useEffect(() => {
        const currEvents = modifyEventData(events);
        const dp = calendarRef.current.control;
        dp.update({startDate, events: currEvents});
    }, [events]);

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
            setStartDate(new Date(response.data.start_date));
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

    const editEvent = async (e) => {
        const dp = calendarRef.current.control;
        handleEventEdit(e.data.id);
        dp.events.update(e);
    };

    const updateEvent = async (e, calendarID) => {
        fetchCalendarData();
        console.log("daypilot start time " + e.data.start.value)

        const submissionData = {
            name: e.data.text,
            calendar: calendarID,
            start_time: e.data.start.value + 'Z',
            end_time: e.data.end.value + 'Z',
        };

        try {
            const response = await fetch(`/api/meetings/${meetingID}/members/${userID}/calendar/events/${e.data.id}/`, {
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
        } catch (error) {
            console.error('Error updating event:', error);
        }
    }

    return (
        <>
            <div style={styles.wrap}>
                <div style={styles.left}>
                    <DayPilotNavigator
                        selectMode={"Week"}
                        showMonths={2} skipMonths={2}
                        startDate={startDate} selectionDay={startDate}
                        onTimeRangeSelected={args => {
                            calendarRef.current.control.update({
                                startDate: args.day
                            });
                        }}
                    />
                    <div style={styles.wrapRow}>
                        <button style={styles.eventsButton} onClick={
                            () => navigate(`/meetings/${meetingID}/members/${userID}/calendar/events`,
                                {state: {calendarId: calendarData.id}})}>
                            Events
                        </button>
                        <button style={styles.eventsButton} onClick={
                            () => navigate(`/meetings/${meetingID}/members/${userID}/`)}>
                            Back
                        </button>
                    </div>
                </div>
                <div style={styles.main}>
                    <DayPilotCalendar {...calendarConfig} ref={calendarRef}/>
                </div>
            </div>
            <div style={styles.wrap}>
                <div style={styles.main}>
                    {showEventEdit && <Event meetingID={meetingID} userID={userID} eventID={eventID} flag={false}/>}
                    {showEventCreate && <EventList calendarID={calendarData.id} meetingID={meetingID} userID={userID}
                                                   startTime={eventStartTime} flag={false}/>}
                </div>
            </div>
        </>
    );
}

const modifyEventData = (events) => {
    return events.map(event => {
        let backColor;
        switch (event.availability) {
            case 'available':
                backColor = 'green';
                break;
            case 'moderate':
                backColor = 'yellow';
                break;
            case 'busy':
                backColor = 'red';
                break;
            default:
                backColor = 'transparent';
                break;
        }
        console.log("backend start time " + event.start_time);
        return {
            id: event.id,
            text: event.name,
            start: new DayPilot.Date(event.start_time),
            end: new DayPilot.Date(event.end_time),
            backColor: backColor
        };
    });
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