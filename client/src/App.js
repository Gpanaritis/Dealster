import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  auto as followSystemColorScheme,
  setFetchMethod as setFetchMethodForDarkReader,
  exportGeneratedCSS as collectCSS,
  isEnabled as isDarkReaderEnabled
} from 'darkreader';

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import Map from "./components/Map";
import SupermarketOffers from "./components/SupermarketOffers";
import AddOffer from "./components/addOffer";
import Product from "./components/Product";

import EventBus from "./common/EventBus";

const AppearanceMode = (Theme) => {
  if (Theme === 'light') {
    localStorage.setItem('dark-mode-enabled', 'false');
    disableDarkMode();
  } else if (Theme === 'dark') {
    localStorage.setItem('dark-mode-enabled', 'true');
    enableDarkMode({
      brightness: 100,
      contrast: 90,
      sepia: 10
    });
  } else if (Theme === 'system') {
    localStorage.setItem('dark-mode-enabled', 'auto');
    followSystemColorScheme();
  }
};

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  setFetchMethodForDarkReader(window.fetch);
  const DarkMode = localStorage.getItem('dark-mode-enabled');
  if (typeof DarkMode == 'undefined') {
    AppearanceMode('system');
  } else if (DarkMode === 'true') {
    AppearanceMode('dark');
  } else if (DarkMode === 'false') {
    AppearanceMode('light');
  } else if (DarkMode === 'auto') {
    AppearanceMode('system');
  }


  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          {/* Insert brand name here */}
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link to={"/map"} className="nav-link">
              Map
            </Link>
          </li>

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                User
              </Link>
            </li>
          )}

        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}

        <DropdownButton title="Appearance">
          <Dropdown.Item onClick={() => AppearanceMode("light")}>
            Light Mode
          </Dropdown.Item>
          <Dropdown.Item onClick={() => AppearanceMode("dark")}>
            Dark Mode
          </Dropdown.Item>
          <Dropdown.Item onClick={() => AppearanceMode("system")}>
            Follow System Theme
          </Dropdown.Item>
        </DropdownButton>

      </nav>

      <div className="col-md-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user" element={<BoardUser />} />
          <Route path="/mod" element={<BoardModerator />} />
          <Route path="/admin" element={<BoardAdmin />} />
          <Route path="/map" element={<Map />} />
          <Route path="/supermarketOffers/:supermarket_id" element={<SupermarketOffers />} />
          <Route path="/addOffer/:supermarket_id" element={<AddOffer />} />
          <Route path="/product/:product_id" element={<Product />} />
        </Routes>
      </div>

    </div>
  );
};

export default App;
