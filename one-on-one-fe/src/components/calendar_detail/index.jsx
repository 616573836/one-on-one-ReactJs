import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CalendarComponent = ({ meetingID, userID }) => {
    const [calendarData, setCalendarData] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                const response = await axios.get(`/api/meetings/${meetingID}/members/${userID}/calendar/`);
                setCalendarData(response.data);

                // Extract start and end dates from calendar data
                setStartDate(new Date(response.data.start_date));
                setEndDate(new Date(response.data.end_date));
            } catch (error) {
                console.error('Error fetching calendar data:', error);
                setCalendarData(null);
            }
        };

        fetchCalendarData();
    }, [meetingID, userID]);

    const renderCalendar = () => {
        if (!calendarData || !startDate || !endDate) {
            return <div>Loading...</div>;
        }

        // Calculate the number of days and hours between start and end dates
        const dayDifference = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const hourDifference = 24;

        // Array to store the table rows
        const rows = [];

        // Loop to generate 48 rows
        for (let hour = 0; hour < hourDifference; hour++) {
            // Array to store cells of each row
            const cells = [];

            // Loop to generate 5 cells for each row (representing 5 days)
            for (let day = 0; day < dayDifference && day < 5; day++) {
                // Calculate the date for the current cell
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + day);
                currentDate.setHours(startDate.getHours() + hour);

                // Push the cell to the row
                cells.push(
                    <td key={`${hour}-${day}`}>
                        {/* Render the cell content (e.g., date and time) */}
                        {currentDate.toLocaleString()}
                    </td>
                );
            }

            // Push the row to the table rows array
            rows.push(<tr key={hour}>{cells}</tr>);
        }

        // Return the generated table
        return (
            <table>
                <tbody>{rows}</tbody>
            </table>
        );
    };

    const handleCreateCalendar = async () => {
        // Implementation remains the same
    };

    return (
        <div>
            {calendarData ? (
                renderCalendar()
            ) : (
                <div>
                    The user has not created a calendar.
                    {userID === calendarData.owner && (
                        <button onClick={handleCreateCalendar}>Create Calendar</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;
