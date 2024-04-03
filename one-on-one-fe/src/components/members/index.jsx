import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const Memebers = () => {
    let { meetingId } = useParams();
    const navigate = useNavigate();
    let [members, setMembers] = useState(null);
    

    useEffect(() => {
        getMembers();
    }, [meetingId]);

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

    return (
        <div style={styles.meetingList}>
                {members?.map((member, index) => (
                    <div key={index} style={styles.meetingItem}>
                        <p>User: {member.username}</p>
                        <p>Role: {member.role}</p>
                        <a href={`/meetings/${meetingId}/members/${member.user}/`} style={styles.detailButton}>Detail</a>

                       
                    </div>
                ))}
            </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    form: {
        marginBottom: '20px',
    },
    input: {
        marginRight: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '200px',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer',
    },
    meetingList: {
        marginTop: '20px',
    },
    meetingItem: {
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
        marginBottom: '10px',
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

export default Memebers;