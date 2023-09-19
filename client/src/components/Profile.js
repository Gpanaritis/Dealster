import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import AuthService from "../services/auth.service";
import ChangeUsername from "./ChangeUserDetails/ChangeUsername";
import ChangePassword from "./ChangeUserDetails/ChangePassword";
import OffersAdded from "./ChangeUserDetails/OffersAdded";
import ReactionsAdded from "./ChangeUserDetails/ReactionsAdded";
import PointsDetails from "./ChangeUserDetails/PointsDetails";
import Appearance from "./ChangeUserDetails/Appearance";

import "../styles/Profile.css"; // Import your CSS file for styling

const Profile = () => {
  const { username } = useParams();
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) window.location.replace("/login");

  const [activeTab, setActiveTab] = useState("offers");

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h3>
          <strong>{username}</strong> Profile
        </h3>
      </header>
      <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
        <Tab eventKey="points" title="Points">
          <PointsDetails username={username} />
        </Tab>
        <Tab eventKey="offers" title="Past Offers">
          <OffersAdded username={username} />
        </Tab>
        <Tab eventKey="reactions" title="Past Reactions">
          <ReactionsAdded username={username} />
        </Tab>
        {username === currentUser.username && (
          <Tab eventKey="username" title="Change Username">
            <ChangeUsername />
          </Tab>
        )}
        {username === currentUser.username && (
          <Tab eventKey="password" title="Change Password">
            <ChangePassword />
          </Tab>
        )}
        <Tab eventKey="appearance" title="Appearance">
          <Appearance />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Profile;