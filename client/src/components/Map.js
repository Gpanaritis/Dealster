import React, { useState, useEffect, useRef, createRef } from "react";
import AuthService from "../services/auth.service";
import SupermarketService from "../services/supermarket.service";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { Icon, icon } from "leaflet";
import L from "leaflet";
import "leaflet-easybutton/src/easy-button.js";
import "leaflet-easybutton/src/easy-button.css";


const Map = () => {
    const [map, setMap] = useState(null);
    const currentUser = AuthService.getCurrentUser();
    const [supermarkets, setSupermarkets] = useState(null);
    const [location, setLocation] = useState(null);

    const greenIcon = icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const redIcon = icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    useEffect(() => {
        if (!map) return;

        const getSupermarkets = async () => {
            const response = await SupermarketService.getAllSupermarkets();
            setSupermarkets(response.data);
            // add markers
            response.data.forEach(supermarket => {
                console.log(supermarket.latitude, supermarket.longitude);
                const marker = L.marker([supermarket.longitude, supermarket.latitude]).addTo(map);
                marker.bindPopup(supermarket.name);
            //     console.log(marker);
            });
        };

        getSupermarkets();

        L.easyButton("fa-map-marker", () => {
            map.locate().on("locationfound", function (e) {
              setLocation(e.latlng);
              map.flyTo(e.latlng, map.getZoom());
            });
          }).addTo(map);

        map.locate().on("locationfound", function (e) {
            L.marker(e.latlng).addTo(map).bindPopup("You are here").openPopup();
        });
    }, [map]);

    useEffect(() => {
        if (!supermarkets) return;
        console.log(supermarkets[0]);
    }, [supermarkets]);

    return (
        <MapContainer center={[	38.2475, 21.7311]} zoom={16} whenCreated={ setMap }>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]} icon={greenIcon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <Marker position={[51.515, -0.09]} color="red">
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <Marker position={[51.525, -0.09]} icon={redIcon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;