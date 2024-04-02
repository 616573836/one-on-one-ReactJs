import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactListComponent = () => {
    const [contactsData, setContactsData] = useState([]); 
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
        getContacts();
    }, []);

    let getContacts = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/accounts/contacts/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        let data = await response.json();
        const mappedData = data.map(contact => mapContactData(contact, loggedInUserId));
    
        setContactsData(mappedData);
    };

    const addContact = async () => {
        // Prevent function from running if userId is empty
        if (!userId) {
            alert("Please enter a user ID.");
            return;
        }

        try {
            let response = await fetch('http://127.0.0.1:8000/api/accounts/contacts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ user2: userId }), // Send the userId as "user2"
            });

            if (response.ok) {
                let newContact = await response.json();
                const mappedNewContact = mapContactData(newContact, loggedInUserId);
                setContactsData(prevState => [...prevState, mappedNewContact]);
                setUserId('');
            } else {
                // Handle server-side validation errors, if any
                alert("Failed to add contact");
                console.error("Failed to add contact");
            }
        } catch (error) {
            console.error("There was an error adding the contact:", error);
            alert(error);
        }
    };

    const deleteContact = async (id) => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/accounts/contacts/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
            });

            if (response.ok) {
                // Filter out the deleted contact from the contactsData array
                setContactsData(prevState => prevState.filter(contact => contact.id !== id));            } else {
                console.error("Failed to delete contact");
            }
        } catch (error) {
            console.error("There was an error deleting the contact:", error);
        }
    };

    const loggedInUserId = localStorage.getItem("userid");
    console.log(loggedInUserId);
  
    return (
      <div>
        <h2>Contact list</h2>
        <h2>Add Contact</h2>
        <div>
            <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
            />
            <button onClick={addContact}>Add Contact</button>
        </div>
        {contactsData.map((contact, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>User ID: {contact.userId} - Username: {contact.alias}</span>
                <button onClick={() => deleteContact(contact.id)}>Delete Contact</button>
            </div>
        ))}
      </div>
    );
};
  
export default ContactListComponent;

function mapContactData(contact, currentUserId) {
    currentUserId = String(currentUserId);

    if (String(contact.user1) === currentUserId) {
        return {
            id: contact.id,
            userId: contact.user2,
            alias: contact.alias2 || 'No alias',
        };
    } else {
        return {
            id: contact.id,
            userId: contact.user1,
            alias: contact.alias1 || 'No alias',
        };
    }
}
