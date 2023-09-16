import React, { useEffect, useState } from "react";
import UserService from "../../services/user.service";
import PointsService from "../../services/pointsSystem.service";
import "../../styles/Profile.css";

const PointsDetails = ({ username }) => {
    const [points, setPoints] = useState(0);
    const [pointsThisMonth, setPointsThisMonth] = useState(0);
    const [tokens, setTokens] = useState(0);
    const [tokensLastMonth, setTokensLastMonth] = useState(0);

    useEffect(() => {
        const fetchPoints = async () => {
            const points = await PointsService.getPointsForUser(username);
            const pointsThisMonth = await PointsService.getPointsForUserInMonth(username, 0);
            setPoints(points);
            setPointsThisMonth(pointsThisMonth);
        };
        const fetchTokens = async () => {
            const tokens = await PointsService.getTokensForUser(username);
            const tokensLastMonth = await PointsService.getTokensForUserInMonth(username, 0);
            setTokens(tokens);
            setTokensLastMonth(tokensLastMonth);
        };
        fetchPoints();
        fetchTokens();
    }, [username]);

    return (
        <div className="points-details">
            <div className="points-container">
                <h3 className="points-title">Points this month</h3>
                <p className="points">{pointsThisMonth}</p>
            </div>
            <div className="points-container">
                <h3 className="points-title">Total Points</h3>
                <p className="points">{points}</p>
            </div>
            <div className="tokens-container">
                <h3 className="tokens-title">Tokens last month</h3>
                <p className="tokens">{tokensLastMonth}</p>
            </div>
            <div className="tokens-container">
                <h3 className="tokens-title">Total Tokens</h3>
                <p className="tokens">{tokens}</p>
            </div>
        </div>
    );
};

export default PointsDetails;