import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import availableServices from "../../../utils/AvailableServices";
import Dropdown from "../../../utils/DropDown";
import { setHandymanToken } from "../../../utils/cookies/setHandymanToken";
import useGeoLocation from "../../../utils/useGeoLocation";
import "./ProfessionalRegister.css";
import back from "./images/back.png";

function ProfessionalRegisterSecond(props) {
    const navigate = useNavigate();
    const location = useGeoLocation(); // Getting current location of the handyman

    const [selected, setSelected] = useState("");
    const [aadharNumber, setAadharNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [aadharFront, setAadharFront] = useState("");
    const [aadharBack, setAadharBack] = useState("");
    const [address, setAddress] = useState("");
    const [profile, setProfile] = useState("");

    const options = availableServices.map((service) => service.serviceName);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestData = {
            services: selected,
            name: props.name,
            email: props.email,
            otp: otp,
            password: props.password,
            phone: props.number,
            aadharNumber: aadharNumber,
            aadharFront: aadharFront !== "" ? aadharFront : undefined,
            aadharBack: aadharBack !== "" ? aadharBack : undefined,
            address: address,
            lat: location.coordinates.lat,
            long: location.coordinates.lng,
            profile: profile !== "" ? profile : undefined,
        };

        try {
            const response = await fetch(
                `http://localhost:5000/api/handyman/signup/verify`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Error: ${response.status}`);
                toast.error(errorData.msg || "An error occurred");
                return;
            }

            const responseData = await response.json();
            toast.success(responseData.msg);
            setHandymanToken(responseData.handyman_id); // Set up cookie
            toast.info("Redirecting you...");
            setTimeout(() => {
                navigate("/handyman/dashboard");
            }, 3000);
        } catch (error) {
            console.error("Error:", error.message);
            toast.error("Failed to submit the form. Please try again.");
        }
    };

    const handleResendOtp = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/user/signup/resendOtp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contactNumber: props.number,
                        email: props.email,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                toast.error("Resend OTP failed: " + (errorData.msg || "Error"));
                return;
            }

            const responseData = await response.json();
            toast.success("Resend OTP: " + responseData.msg);
        } catch (error) {
            console.error("Error:", error.message);
            toast.error("Failed to resend OTP. Please try again.");
        }
    };

    return (
        <div>
            <div className="professional_signup_main_container">
                <img
                    className="professional_signup_main_back"
                    src={back}
                    onClick={() => navigate("/handyman/register")}
                    alt="Back"
                />
                <div className="container signup_form">
                    <form onSubmit={handleSubmit}>
                        <div className="signup_form_heading">
                            Add Further Details
                        </div>
                        <div className="signup_form_input">
                            <input
                                type="number"
                                placeholder="OTP"
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <div className="signup_form_input">
                            <Dropdown
                                options={options}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </div>
                        <div className="signup_form_input">
                            <input
                                type="string"
                                placeholder="Profile URL"
                                onChange={(e) => setProfile(e.target.value)}
                            />
                        </div>
                        <div className="signup_form_input">
                            <input
                                type="text"
                                placeholder="Address"
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="signup_form_input">
                            <input
                                type="number"
                                placeholder="Aadhar Number"
                                onChange={(e) =>
                                    setAadharNumber(e.target.value)
                                }
                            />
                        </div>
                        <span>Add Aadhar Front</span>
                        <div className="signup_form_input">
                            <input
                                type="file"
                                multiple={false}
                                accept="image/*"
                            />
                        </div>
                        <span>Add Aadhar Back</span>
                        <div className="signup_form_input">
                            <input
                                type="file"
                                multiple={false}
                                accept="image/*"
                            />
                        </div>
                        <div className="signup_form_button">
                            <button type="button" onClick={handleResendOtp}>
                                Resend OTP
                            </button>
                        </div>
                        <div className="signup_form_button">
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfessionalRegisterSecond;
