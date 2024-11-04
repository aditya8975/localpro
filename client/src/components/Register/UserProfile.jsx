import React, { useEffect, useState } from "react";
import { getUserToken } from "E:/MCA/proj/source/Local_Seva-main/Local_Seva-main/client/src/utils/cookies/getUserToken"; // Ensure this path is correct

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState("");

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/profile`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getUserToken()}` // Pass the token in headers
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${response.status} - ${errorData.message}`);
            }

            const data = await response.json();
            setUserInfo(data);
        } catch (err) {
            console.error("Failed to load user information:", err);
           // setError("Failed to load user information.");
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <div className="user-profile">
            {error && <div className="error">{error}</div>}
            {userInfo ? (
                <div>
                    <h2>User Profile</h2>
                    <p>Name: {userInfo.name}</p>
                    <p>Email: {userInfo.email}</p>
                    <p>Address: {userInfo.address}</p>
                    {/* Add more fields as necessary */}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default UserProfile;
