import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactListComponent = () => {
    const [contactsData, setContactsData] = useState([]); 
    const [addContPop, setAddContPop] = useState(false);
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

    const addContact = async (userId) => {
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
                body: JSON.stringify({ user2: userId }),
            });

            if (response.ok) {
                let newContact = await response.json();
                const mappedNewContact = mapContactData(newContact, loggedInUserId);
                setContactsData(prevState => [...prevState, mappedNewContact]);
            } else {
                let data = await response.json();
                alert("Failed to add contact: " + data.error);
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
        setViewingContact(null);
      };

      const handleSearch = () => {
        getContacts(filterParam);
    };
    

    const loggedInUserId = localStorage.getItem("userid");
    console.log(loggedInUserId);
  
    return (
        <div>
        <div><h1>Contact List</h1></div>
        
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search by alias or username"
                    value={filterParam}
                    onChange={(e) => setFilterParam(e.target.value)}
                    style={{ flexGrow: 1, marginRight: '10px', border: '1px solid #ccc', padding: '8px' }}
                />
                <button onClick={handleSearch} style={{ padding: '8px 16px' }}>Search</button>
            </div>
        </div>


        <table style={{ marginTop: '80px',marginLeft: '100px', width: '100%', textAlign: 'center' }}>
            <thead style={{fontSize: '18px'}}>
                <tr>
                    <th>Alias</th>
                    <th>Created</th>
                    <th>Email</th>
                    <th style={{ textAlign: 'left', paddingLeft: '100px' }}>Actions</th>
                </tr>
            </thead>
            <tbody style={{fontSize: '16px'}}>
                {contactsData.map((contact) => (
                    <tr key={contact.id}>
                        <td>{contact.alias}</td>
                        <td>{contact.created}</td>
                        <td>{contact.email}</td>
                        <td >
                            <button onClick={() => setViewingContact(contact)}>View Contact Details</button>
                            <button onClick={() => deleteContact(contact.id)}>Delete Contact</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div style={{marginTop: '100px',marginLeft: '530px'}}><button onClick={() => setAddContPop(true)}>Create & Invite new Contact</button></div>
        {addContPop && 
            <AddContactPopup 
                onConfirm={addContact}
                onClose={() => setAddContPop(false)}
            />
        }
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
            email: contact.email2,
            created: contact.created
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

function AddContactPopup({ onConfirm, onClose }) {
    const [userId, setUserId] = useState('');

    return (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000, border: '1px solid black' }}>
            <div>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter User ID to add"
                />
            </div>
            <div style={{ marginTop: '10px' }}>
                <button onClick={() => {
                    onConfirm(userId);
                    onClose();
                    }} style={{ marginRight: '5px' }}>Add Contact</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

function ViewContactPopup({ contact, onSave, onClose }) {
  const [alias, setAlias] = useState(contact.alias);

  return (
    <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000, border: '1px solid black' }}>
      <div>Username: {contact.username}</div>
      <div>User ID: {contact.userId}</div>
      <div>Email: {contact.email}</div>
      <div>
        Alias: <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} style={{ flexGrow: 1, marginRight: '10px', border: '1px solid #ccc', padding: '8px' }}/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <button onClick={onClose} style={{ marginRight: '10px' }}>Close</button>
            <button onClick={() => onSave(contact.id, alias)} style={{ marginLeft: '10px' }}>Update Alias</button>
        </div>
    </div>
  );
}
  
