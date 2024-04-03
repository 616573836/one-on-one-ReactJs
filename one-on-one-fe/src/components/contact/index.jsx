import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactListComponent = () => {
    const [contactsData, setContactsData] = useState([]); 
    const [userId, setUserId] = useState('');
    const [viewingContact, setViewingContact] = useState(null);
    const [filterParam, setFilterParam] = useState(''); 

  
    useEffect(() => {
        getContacts();
    }, []);

    let getContacts = async (filter = '') => {
        let url = 'http://127.0.0.1:8000/api/accounts/contacts/';
        if (filter) {
            url += `?filter=${encodeURIComponent(filter)}`;
        }
        let response = await fetch(url, {
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

    const updateContactAlias = async (contactId, newAlias) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/accounts/contacts/${contactId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ alias: newAlias }),
            });
    
            if (response.ok) {
                // Update the alias in the local state without waiting for a response
                setContactsData(prevState => prevState.map(contact => 
                  contact.id === contactId ? { ...contact, alias: newAlias } : contact
                ));
                setViewingContact(null);
            } else {
                console.error("Failed to update contact");
            }
        } catch (error) {
            console.error("There was an error updating the contact:", error);
        }
    };

    const handleClosePopup = () => {
        setViewingContact(null); // Close the popup
      };

      const handleSearch = () => {
        getContacts(filterParam); // Fetch with filter
    };
    

    const loggedInUserId = localStorage.getItem("userid");
    console.log(loggedInUserId);
  
    return (
        <div><h2>Contact List</h2><div>
        <div>
            <input
                type="text"
                placeholder="Search by alias or username"
                value={filterParam}
                onChange={(e) => setFilterParam(e.target.value)}
                style={{ marginRight: '10px' }}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
        <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID to add"
        />
          <button onClick={addContact}>Add Contact</button>
        </div>
          {contactsData.map((contact) => (
            <div key={contact.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>{contact.alias}</span>
              <button onClick={() => setViewingContact(contact)}>View Contact Details</button>
              <button onClick={() => deleteContact(contact.id)}>Delete Contact</button>
            </div>
          ))}
          {viewingContact && 
            <ViewContactPopup
              contact={viewingContact}
              onSave={updateContactAlias}
              onClose={handleClosePopup}
            />
          }
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
            username: contact.username2,
            alias: contact.alias2 || 'No alias',
            email: contact.email2
        };
    } else {
        return {
            id: contact.id,
            userId: contact.user1,
            username: contact.username1,
            alias: contact.alias1 || 'No alias',
            email: contact.email1
        };
    }
}

function ViewContactPopup({ contact, onSave, onClose }) {
  const [alias, setAlias] = useState(contact.alias);

  return (
    <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000, border: '1px solid black' }}>
      <div>Username: {contact.username}</div>
      <div>User ID: {contact.userId}</div>
      <div>Email: {contact.email}</div>
      <div>
        Alias: <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} />
      </div>
      <button onClick={() => onSave(contact.id, alias)}>Update Contact</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
  
