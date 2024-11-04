import Cookies from "universal-cookie";

const cookies = new Cookies();
export const setHandymanToken = (handyman_token) => {
    cookies.set("handyman_token", handyman_token, {
        path: "/", // Ensures the cookie is accessible throughout the app
        expires: new Date(Date.now() + 86400000), // Expires in 1 day
    });
};
