import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserToken } from "./../../utils/cookies/getUserToken";
import "./ServiceProvider.css";

function ServicePerson({
    handyman_id,
    name,
    address,
    createdAt,
    usersSelected,
    profile,
}) {
    const location = useLocation();
    const user_id = getUserToken();

    const lat = new URLSearchParams(location.search).get("lat");
    const long = new URLSearchParams(location.search).get("long");
    const cost = new URLSearchParams(location.search).get("cost");

    const createdAtDate = new Date(createdAt);
    const today = new Date();
    const diffTime = today.getTime() - createdAtDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
    const memberSince = `${diffDays} days`;
    const jobsCompleted = usersSelected.length;

    const [isLoading, setIsLoading] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);

    const handleSelect = async () => {
        try {
            setIsLoading(true);
            setShowCountdown(true);
            const response = await fetch(`http://localhost:5000/api/createnotification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lat: lat,
                    long: long,
                    user_id: user_id,
                    handyman_id: handyman_id,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create notification. Status: ${response.status}`);
            }

            const data = await response.json();
            setIsLoading(true);
            setIsAccepted(false);

            const interval = setInterval(async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/getnotification`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            handyman_id: handyman_id,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch notification. Status: ${response.status}`);
                    }

                    const data = await response.json();
                    if (data?.[0]?.status === "accepted") {
                        setIsAccepted(true);
                        setIsLoading(false);
                        clearInterval(interval);
                    } else if (data?.[0]?.status === "rejected") {
                        setIsAccepted(false);
                        setIsLoading(false);
                        clearInterval(interval);
                    }
                } catch (error) {
                    console.error("Error fetching notification:", error);
                    clearInterval(interval);
                    setIsLoading(false);
                }
            }, 3000);
        } catch (error) {
            console.error("Error creating notification:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="servicePerson_main">
            <div className="servicePerson_content">
                <div className="servicePerson_image">
                    <img src={profile} alt="" />
                </div>
                <div className="servicePerson_info">
                    <div className="servicePerson_name">{name}</div>
                    <div className="servicePerson_address">{address}</div>
                    <div className="servicePerson_experience">
                        Member for {memberSince}
                    </div>
                    <div className="servicePerson_jobsDone">
                        Completed {jobsCompleted} jobs
                    </div>
                </div>
            </div>
            <div className="servicePerson_button">
                {isLoading ? (
                    <div>Waiting for handyman to respond...</div>
                ) : isAccepted ? (
                    <Link
                        to={`/user/bookingsummary?lat=${lat}&long=${long}&cost=${cost}&handyman_id=${handyman_id}`}
                    >
                        <button style={{ backgroundColor: "lightgreen" }}>
                            Move Forward
                        </button>
                    </Link>
                ) : (
                    <>
                        {showCountdown ? (
                            <button disabled>Request Rejected</button>
                        ) : (
                            <button onClick={handleSelect}>Select</button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ServicePerson;
