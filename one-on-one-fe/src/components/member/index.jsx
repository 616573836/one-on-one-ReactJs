import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MemberDetail = () => {
    
    let { meetingId, memberID } = useParams();
    const navigate = useNavigate();
    let [member, setMember] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updatedRole, setUpdatedRole] = useState('');


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
            setUpdatedRole(data.role);
        } catch (error) {
            console.error("Failed to fetch members details:", error);
        } 
        finally {
            setLoading(false);
        }
    };



    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/members/${memberID}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    role: updatedRole,   
                }),
            });
            
            setShowUpdateForm(false); 
            getMember();
        } catch (error) {
            
            console.error("Failed to update meeting:", error);
        }
    };

    const deleteMember = async () => {
        if (window.confirm("Are you sure you want to delete this meeting?")) {
            try {
                await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/members/${memberID}/`, {
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

    
    if (!member) {
        return <div>no member</div>;
        
    }
        

    return (
        <div style={styles.container}>
            <h1>{member.username}</h1>
            <p>role: {member.role}</p>
            <button style={styles.backButton} onClick={() => navigate(`/meetings/${meetingId}/`)}>
                Back
            </button>
            <button style={styles.button} onClick={() => setShowUpdateForm(true)}>
                Update
            </button>
            <button style={styles.button} onClick={() => deleteMember()}>
                Delete
            </button>
            {showUpdateForm && (
                <form onSubmit={handleUpdate} style={styles.form}>
                    <div>
                        <label>Role:</label>
                        <select
                            value={updatedRole}
                            onChange={(e) => setUpdatedRole(e.target.value)}
                            style={styles.input}
                        >
                            <option value="host">Host</option>
                            <option value="member">Member</option>
                        </select>
                    </div>
                    <button type="submit" style={styles.button}>
                        Submit Update
                    </button>
                </form>
            )}

            
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