import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import AuthService from "../services/auth.service";
import Leaderboard from "./Admin/Leaderboard";
import OffersCountChart from "./Admin/OffersCountChart";
import AdminProductManagement from "./Admin/ProductSection";

import "../styles/Profile.css"; // Import your CSS file for styling

const Admin = () => {
  const { username } = useParams();
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) window.location.replace("/login");

  const [activeTab, setActiveTab] = useState("leaderboard");

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h3>
          Admin
        </h3>
      </header>
      <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
        <Tab eventKey="leaderboard" title="Leaderboard">
            <Leaderboard />
        </Tab>
        <Tab eventKey="offers" title="View Offers Per Month">
            <OffersCountChart />
        </Tab>
        <Tab eventKey="discount" title="Mean Discount Per Week">
            <AdminProductManagement />
        </Tab>
        <Tab eventKey="reactions" title="Upload Files">
            <AdminProductManagement />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Admin;