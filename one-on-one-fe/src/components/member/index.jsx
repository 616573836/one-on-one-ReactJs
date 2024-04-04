import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MemberDetail = () => {
    
    let { meetingId, memberID } = useParams();
    const navigate = useNavigate();
    let [member, setMember] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMember();
    }, [meetingId,memberID]);

    const getMember = async () => {
        setLoading(true);
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/members/${memberID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            let data = await response.json();
            setMember(data);
        } catch (error) {
            console.error("Failed to fetch members details:", error);
        } 
        finally {
            setLoading(false);
        }
    };
        

    return (
        <div style={styles.container}>
            <h1>{member.user}</h1>
            <p>role: {member.role}</p>
            <button style={styles.backButton} onClick={() => navigate("/meetings")}>
                Back
            </button>
            
        </div>
    );

}


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
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        display: 'inline-block',
        textDecoration: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '5px',
    },
    button: {
        display: 'block',
        marginTop: '10px',
        marginRight: '5px',
        marginBottom: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
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

export default MemberDetail;