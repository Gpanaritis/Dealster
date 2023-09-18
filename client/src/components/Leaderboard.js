import React, { useState, useEffect } from 'react';
import UserService from '../services/user.service';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const getLeaderboard = async () => {
            try {
                const response = await UserService.getLeaderboard();
                setLeaderboard(response);
            } catch (error) {
                console.error(`Error fetching leaderboard: ${error}`);
            }
        };

        getLeaderboard();
    }, []);

    // Calculate the indexes for the items to display on the current page.
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = leaderboard.slice(indexOfFirstItem, indexOfLastItem);

    // Change the page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <div className="leaderboard-header">
                <h2>Leaderboard</h2>
            </div>
            <div className="leaderboard-content">
                {currentItems.map((user, index) => (
                    <div className="leaderboard-item" key={user.id}>
                        <div className="leaderboard-rank">
                            <span>{index + (currentPage-1)*10 + 1}</span>
                        </div>
                        <div className="leaderboard-details">
                            <h4>{user.username}</h4>
                            <p>Points: {user.points}</p>
                            <p>Tokens: {user.tokens}</p>
                            <p>Tokens last month: {user.tokensLastMonth}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(leaderboard.length / itemsPerPage) }, (_, i) => (
                        <li className={`page-item ${currentPage === i + 1 ? 'active' : ''}`} key={i}>
                            <button className="page-link" onClick={() => paginate(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Leaderboard;
