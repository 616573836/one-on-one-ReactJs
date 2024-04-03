import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MemberDetail = () => {
    const { meetingId, userId } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMemberDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/meetings/${meetingId}/members/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include authorization header if needed
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Member details could not be fetched');
                }
                const data = await response.json();
                setMember(data);
            } catch (error) {
                console.error("Failed to fetch member details:", error);
                setError('Failed to fetch member details.');
            } finally {
                setLoading(false);
            }
        };

        fetchMemberDetails();
    }, [meetingId, userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!member) return <div>Member not found.</div>;

    return (
        <div >
            <h1>Member Details</h1>
            <p>Role: {member.role}</p>
            {/* Display other details as needed */}
            <button onClick={() => navigate(-1)}>
                Back
            </button>
        </div>
    );
};

// Styles remain the same

export default MemberDetail;