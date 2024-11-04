import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl";

const TOKEN = "pk.eyJ1IjoiamxlZTA3IiwiYSI6ImNtMzFkbGpudjBrNTEyanI2bXZsem80cHYifQ.siV1GgLPY_oOzqN8Yi6vXw";
// console.log(TOKEN);

function Mapbox(props) {
    const [viewPort, setViewPort] = useState({
        latitude: props.lat,
        longitude: props.long,
        zoom: 6,
    });

    useEffect(() => {
        setViewPort((prevState) => ({
            ...prevState,
            latitude: props.lat,
            longitude: props.long,
        }));
    }, [props.lat, props.long]);

    return (
        <div>
            <Map
                style={{ width: "100vw", height: 400 }}
                {...viewPort}
                mapboxAccessToken={TOKEN}
                width="100%"
                height="100%"
                transitionDuration="200"
                mapStyle="mapbox://styles/mapbox/streets-v9"
                onViewPortChange={(viewPort) => setViewPort(viewPort)}
            >
                <Marker latitude={props.lat} longitude={props.long}></Marker>
            </Map>
        </div>
    );
}

export default Mapbox;
