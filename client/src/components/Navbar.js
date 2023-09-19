import React, { useState } from 'react';
import SearchBar from './SearchBar';
import '../App.css';

const YourNavbarComponent = ({ currentUser, showAdminBoard, logOut }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="/">
                <img src="/logo512.png" alt="Logo" width="30" height="30" className="d-inline-block align-top" />
                {' '}Dealster
            </a>
            <button
                className={`navbar-toggler ${isMenuOpen ? 'collapsed' : ''}`}
                type="button"
                onClick={toggleMenu}
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/map">
                            Map
                        </a>
                    </li>
                    {currentUser && showAdminBoard && (
                        <li className="nav-item">
                            <a className="nav-link" href="/admin">
                                Admin
                            </a>
                        </li>
                    )}
                </ul>
            </div>
            <div className="d-none d-lg-block"> {/* Display the SearchBar on large screens */}
                <div className="navbar-nav">
                    <SearchBar />
                </div>
            </div>
            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                <ul className="navbar-nav ml-auto">
                    {currentUser ? (
                        <>
                            <li className="nav-item">
                                <a className="nav-link" href={`/profile/${currentUser.username}`}>
                                    {currentUser.username}
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={logOut}>
                                    Log Out
                                </a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <a className="nav-link" href="/login">
                                    Login
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/register">
                                    Register
                                </a>
                            </li>
                        </>
                    )}
                </ul>
                <div className="d-lg-none"> {/* Display the SearchBar on small screens */}
                    <div className="navbar-nav">
                        <SearchBar />
                    </div>
                </div>


            </div>
        </nav>
    );
};

export default YourNavbarComponent;
