import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkIfEventsExist } from '../calendar_detail'

const MeetingDetail = () => {

    let { meetingId } = useParams();
    const navigate = useNavigate();
    let [meeting, setMeeting] = useState(null);
    const [eventExistence, setEventExistence] = useState({});
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [userID, setUserID] = useState('');
    const [interaction, setInteraction] = useState({})

    useEffect(() => {
        fetchMeetingDetails();
        getMembers();
        
    }, [meetingId]);

    useEffect(() => {
        submitCalendar();
    }, [meetingId, members])

    const submitCalendar = () => {
        members?.forEach((member) => {
            checkIfEventsExist(meetingId, member.user).then((exist) => {
                setEventExistence((prev) => ({
                    ...prev,
                    [member.user]: exist,
                }));
            });
        });
    }

    const fetchInteractions = async () => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/interaction/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            let data = await response.json();
            setInteraction(data);
        } catch (error) {
            console.error("Failed to fetch calendar details:", error);
        } 
    };

    const getMembers = async () => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/members/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            let data = await response.json();
            setMembers(data);
        } catch (error) {
            console.error("Failed to fetch members details:", error);
        } 
    };


    const fetchMeetingDetails = async () => {
        setLoading(true);
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            let data = await response.json();
            setMeeting(data);
            setUpdatedName(data.name);
            setUpdatedDescription(data.description);
            if (meeting.state == "ready") fetchInteractions();
        } catch (error) {
            console.error("Failed to fetch meeting details:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMeeting = async () => {
        if (window.confirm("Are you sure you want to delete this meeting?")) {
            try {
                await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                navigate(`/meetings`); // Navigate back after deletion
            } catch (error) {
                console.error("Failed to delete meeting:", error);
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    name: updatedName,
                    description: updatedDescription,
                }),
            });
            setShowUpdateForm(false); 
            fetchMeetingDetails();
        } catch (error) {
            console.error("Failed to update meeting:", error);
        }
    };

    let createMember = async (e) => {
        e.preventDefault(); 
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/members/${userID}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
            });
    
            if (response.ok) {
                let data = await response.json();
                console.log(data);
                // Handle successful creation, e.g., show success message, redirect, etc.
            } else {
                throw new Error('Failed to create member');
            }
        } catch (error) {
            console.error(error);
            // Handle error, e.g., show error message to the user
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!meeting) {
        return <div>No meeting found.</div>;
    }

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
            <h1>{meeting.name}</h1>
            <p>Description: {meeting.description}</p>
            <p>State: {meeting.state}</p>
            <p>Created: {formatTimestamp(meeting.created_time)}</p>
            <button style={styles.backButton} onClick={() => navigate("/meetings")}>
                Back
            </button>
            <button style={styles.button} onClick={() => deleteMeeting()}>
                Delete
            </button>
            <button style={styles.button} onClick={() => setShowUpdateForm(true)}>
                Update
            </button>
            {showUpdateForm && (
                <form onSubmit={handleUpdate} style={styles.form}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input
                            type="text"
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>
                        Submit Update
                    </button>
                </form>
            )}
                <div>
                {Object.entries(interaction).map(([key, { "start time": startTime, "end time": endTime }]) => (
                    <div key={key}>
                    <p>Interaction {key}:</p>
                    <p>Start Time: {new Date(startTime).toLocaleString()}</p>
                    <p>End Time: {new Date(endTime).toLocaleString()}</p>
                    </div>
                ))}
                </div>
             {members?.map((member, index) => (
                <div key={index} style={styles.meetingItem}>
                    <p>User: {member.username}</p>
                    <p>Role: {member.role}</p>
                    {eventExistence[member.user] ? <p>Submitted</p> : <p>Not submitted</p>}
                    <a href={`/meetings/${meetingId}/members/${member.user}/`}
                       style={styles.detailButton}>Detail</a>
                    <button onClick={() => navigate(`/meetings/${meetingId}/members/${member.user}/calendar/`)}
                       style={styles.calendarButton}>Calendar</button>
                </div>
            ))}
            <form onSubmit={createMember}>
                <input
                    type="text"
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
                    placeholder="Enter User ID"
                    required
                />
                <button type="submit">Create Member</button>
            </form>
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
    backButton: {
        display: 'inline-block',
        marginTop: '10px',
        marginRight: '5px',
        marginLeft: '5px',
        marginBottom: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
    },
    calendarButton: {
        display: 'inline-block',
        marginTop: '10px',
        marginRight: '5px',
        marginLeft: '5px',
        marginBottom: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#9933ff',
    },
    button: {
        display: 'inline-block',
        marginTop: '10px',
        marginRight: '5px',
        marginLeft: '5px',
        marginBottom: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#f4511e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
    },
    form: {
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
    },
    input: {
        display: 'block',
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    label: {
        marginTop: '10px',
        marginBottom: '5px',
        display: 'block',
        fontSize: '18px',
    },
    detailButton: {
        display: 'inline-block',
        padding: '5px 10px',
        marginTop: '10px',
        textDecoration: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '5px',
    }
};

export default MeetingDetail;