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
    const [events, setEvents] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [showEventCreate, setShowEventCreate] = useState(false);
    const [showEventEdit, setShowEventEdit] = useState(false);
    const navigate = useNavigate();
    const calendarRef = useRef()

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
        // const modal = await DayPilot.Modal.prompt("Update event text:", e.text());
        // if (!modal.result) { return; }
        // e.data.text = modal.result;
        handleEventEdit(e.data.id);
        dp.events.update(e);
    };

    // TODO: Event Config
    useEffect(() => {
        const currEvents = modifyEventData(events);
        const dp = calendarRef.current.control;
        dp.update({startDate, events: currEvents});
    }, [events]);

    const [calendarConfig, setCalendarConfig] = useState({
        viewType: "Week",
        durationBarVisible: false,
        timeRangeSelectedHandling: "Enabled",
        contextMenu: new DayPilot.Menu({
            items: [
                {
                    text: "Delete", onClick: async args => {
                        const dp = calendarRef.current.control;
                        dp.events.remove(args.source);
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
        onBeforeEventRender: args => {
            args.data.areas = [
                {
                    top: 3,
                    right: 3,
                    width: 20,
                    height: 20,
                    symbol: "icons/daypilot.svg#minichevron-down-2",
                    fontColor: "#fff",
                    toolTip: "Show context menu",
                    action: "ContextMenu",
                },
                {
                    top: 3,
                    right: 25,
                    width: 20,
                    height: 20,
                    symbol: "icons/daypilot.svg#x-circle",
                    fontColor: "#fff",
                    action: "None",
                    toolTip: "Delete event",
                    onClick: async args => {
                        const dp = calendarRef.current.control;
                        dp.events.remove(args.source);
                    }
                }
            ];
        },

        // TODO: modify to Event Create Page
        onTimeRangeSelected: async args => {
            // const dp = calendarRef.current.control;
            // const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
            // dp.clearSelection();
            // if (!modal.result) { return; }
            // dp.events.add({
            //     start: args.start,
            //     end: args.end,
            //     id: DayPilot.guid(),
            //     text: modal.result
            // });
            handleEventCreate();
        },
        // TODO: Change to Event Edit
        onEventClick: async args => {
            await editEvent(args.e);
        },
    });

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
                    <button style={styles.eventsButton} onClick={
                        () => navigate(`/meetings/${meetingID}/members/${userID}/calendar/events`,
                            {state: {calendarId: calendarData.id}})}>
                        Events
                    </button>
                </div>
                <div style={styles.main}>
                    <DayPilotCalendar {...calendarConfig} ref={calendarRef}/>
                </div>
            </div>
            <div style={styles.wrap}>
                <div style={styles.main}>
                    {showEventEdit && <Event meetingID={meetingID} userID={userID} eventID={eventID} flag={false}/>}
                    {showEventCreate && <EventList calendarID={calendarData.id} meetingID={meetingID} userID={userID} flag={false}/>}
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