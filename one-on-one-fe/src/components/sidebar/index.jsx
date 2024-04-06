import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoveredLink, setHoveredLink] = useState('');

    const styles = {
        sidebar: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: isExpanded ? '200px' : '50px',
            backgroundColor: '#f1f1f1',
            transition: 'width 0.5s ease',
            zIndex: 5,
            position: 'fixed',
            top: 0,
            left: 0,
            overflowX: 'hidden',
        },
        link: (linkName) => ({
            padding: '10px 15px',
            textDecoration: 'none',
            color: 'black',
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            borderBottom: '1px solid #ccc',
            backgroundColor: hoveredLink === linkName ? '#007bff' : 'transparent',
            color: hoveredLink === linkName ? 'white' : 'black', // Change text color for better visibility
        }),
        logoutSection: {
            marginTop: '770px',
        },
    };

    return (
        <div 
            style={styles.sidebar}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div>
                <Link 
                    to="/profile/" 
                    style={styles.link('profile')}
                    onMouseEnter={() => setHoveredLink('profile')}
                    onMouseLeave={() => setHoveredLink('')}
                >
                    👤{isExpanded && ' My Profile'}
                </Link>
                <Link 
                    to="/meetings/" 
                    style={styles.link('meetings')}
                    onMouseEnter={() => setHoveredLink('meetings')}
                    onMouseLeave={() => setHoveredLink('')}
                >
                    📅{isExpanded && ' Meetings'}
                </Link>
                <Link 
                    to="/contact/" 
                    style={styles.link('contact')}
                    onMouseEnter={() => setHoveredLink('contact')}
                    onMouseLeave={() => setHoveredLink('')}
                >
                    👥{isExpanded && ' Contacts'}
                </Link>
            </div>
            <div style={styles.logoutSection}>
                <Link 
                    to="/login/" 
                    style={styles.link('logout')}
                    onMouseEnter={() => setHoveredLink('logout')}
                    onMouseLeave={() => setHoveredLink('')}
                >
                    🔓{isExpanded && ' Logout'}
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;
