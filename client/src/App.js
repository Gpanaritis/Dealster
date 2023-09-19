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
import ProductsMap from "./components/productsMap";
import FilteredSupermarkets from "./components/filteredSupermarkets";
import Offers from "./components/Offers";
import Admin from "./components/Admin";
import YourNavbarComponent from "./components/Navbar";

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
  // followSystemColorScheme();
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
    const getUser = async () => {
      try {
        const user = await AuthService.getUserSecure();

        if (user) {
          setCurrentUser(user);
          setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
          setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUser();

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
    // add the navbar component
    <div className="App">

      <div className="col-md-0">
        <YourNavbarComponent currentUser={currentUser} showAdminBoard={showAdminBoard} logOut={logOut} />
      </div>

      <div className="col-md-0">
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/user" element={<BoardUser />} />
          <Route path="/mod" element={<BoardModerator />} />
          <Route path="/map" element={<Map />} />
          <Route path="/supermarketOffers/:supermarket_id" element={<SupermarketOffers />} />
          <Route path="/addOffer/:supermarket_id" element={<AddOffer />} />
          <Route path="/product/:product_id" element={<Product />} />
          <Route path="/filteredSupermarkets/:supermarket_name" element={<FilteredSupermarkets />} />
          <Route path="/productsMap/:category_name" element={<ProductsMap />} />
          <Route path="/offers" element={<Offers />} />
          {/* Include ProductSection */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>

    </div>
  );
};

export default App;