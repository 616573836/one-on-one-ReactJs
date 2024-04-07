import React, {useEffect, useRef, useState} from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import axios from 'axios';
import {useParams, useNavigate} from "react-router-dom";
import EventList from "../events";
import Event from "../event_detail";
import "./CalendarStyles.css";

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
    const calendarRef = useRef()

    const editEvent = async (e) => {
        const dp = calendarRef.current.control;
        const modal = await DayPilot.Modal.prompt("Update event text:", e.text());
        if (!modal.result) { return; }
        e.data.text = modal.result;
        dp.events.update(e);
    };

    const [calendarConfig, setCalendarConfig] = useState({
        viewType: "Week",
        durationBarVisible: false,
        timeRangeSelectedHandling: "Enabled",
        onTimeRangeSelected: async args => {
            const dp = calendarRef.current.control;
            const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
            dp.clearSelection();
            if (!modal.result) { return; }
            dp.events.add({
                start: args.start,
                end: args.end,
                id: DayPilot.guid(),
                text: modal.result
            });
        },
        onEventClick: async args => {
            await editEvent(args.e);
        },
        contextMenu: new DayPilot.Menu({
            items: [
                {
                    text: "Delete",
                    onClick: async args => {
                        const dp = calendarRef.current.control;
                        dp.events.remove(args.source);
                    },
                },
                {
                    text: "-"
                },
                {
                    text: "Edit...",
                    onClick: async args => {
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


            const participants = args.data.participants;
            if (participants > 0) {
                // show one icon for each participant
                for (let i = 0; i < participants; i++) {
                    args.data.areas.push({
                        bottom: 5,
                        right: 5 + i * 30,
                        width: 24,
                        height: 24,
                        action: "None",
                        image: `https://picsum.photos/24/24?random=${i}`,
                        style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
                    });
                }
            }
        }
    });

    useEffect(() => {
        const events = [
            {
                id: 1,
                text: "Event 1",
                start: "2023-10-02T10:30:00",
                end: "2023-10-02T13:00:00",
                participants: 2,
            },
            {
                id: 2,
                text: "Event 2",
                start: "2023-10-03T09:30:00",
                end: "2023-10-03T11:30:00",
                backColor: "#6aa84f",
                participants: 1,
            },
            {
                id: 3,
                text: "Event 3",
                start: "2023-10-03T12:00:00",
                end: "2023-10-03T15:00:00",
                backColor: "#f1c232",
                participants: 3,
            },
            {
                id: 4,
                text: "Event 4",
                start: "2023-10-01T11:30:00",
                end: "2023-10-01T14:30:00",
                backColor: "#cc4125",
                participants: 4,
            },
        ];

        const startDate = "2023-10-02";

        calendarRef.current.control.update({startDate, events});
    }, []);

    return (
        <div style={styles.wrap}>
            <div style={styles.left}>
                <DayPilotNavigator
                    selectMode={"Week"}
                    showMonths={3}
                    skipMonths={3}
                    startDate={"2023-10-02"}
                    selectionDay={"2023-10-02"}
                    onTimeRangeSelected={ args => {
                        calendarRef.current.control.update({
                            startDate: args.day
                        });
                    }}
                />
            </div>
            <div style={styles.main}>
                <DayPilotCalendar
                    {...calendarConfig}
                    ref={calendarRef}
                />
            </div>
        </div>
    );
}

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