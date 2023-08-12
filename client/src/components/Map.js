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

    const blueIcon = icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const currLocationIcon = icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    useEffect(() => {
        if (!map) return;

        const getSupermarkets = async (location) => {
            const response = await SupermarketService.fetchAndStoreSupermarkets(location.lat, location.lng);
            for (let supermarket of response) {
                let icon;
                let link;
                if (supermarket.is_near === 1) {
                    icon = greenIcon;
                    const numOffers = supermarket.num_offers;
                    const addOfferUrl = `/addOffer/${supermarket.id}`;
                    const addOfferLink = `<a href="${addOfferUrl}">Add offer</a>`;
                    const supermarketOffersUrl = `/supermarketOffers/${supermarket.id}`;
                    const supermarketOffersLink = `<a href="${supermarketOffersUrl}">${numOffers} offer${numOffers !== 1 ? 's' : ''} available</a>`;
                    link = `${addOfferLink} | ${supermarketOffersLink}`;
                } else {
                    icon = supermarket.num_offers === 0 ? redIcon : blueIcon;
                    const url = `/supermarketOffers/${supermarket.id}`;
                    const numOffers = supermarket.num_offers;
                    link = `<a href="${url}">${numOffers} offer${numOffers !== 1 ? 's' : ''} available</a>`;
                }
                const marker = L.marker([supermarket.longitude, supermarket.latitude], { icon }).addTo(map);
                marker.bindPopup(`${supermarket.name}<br>${link}`);
            }
        };

        map.locate().on("locationfound", function (e) {
            getSupermarkets(e.latlng);
        });

        L.easyButton("fa-map-marker", () => {
            map.locate().on("locationfound", function (e) {
                setLocation(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
            });
        }).addTo(map);

        map.locate().on("locationfound", function (e) {
            L.marker(e.latlng, { icon: currLocationIcon }).addTo(map).bindPopup("You are here").openPopup();
        });
    }, [map]);

    useEffect(() => {
        if (!supermarkets) return;
        // console.log(supermarkets[0]);
    }, [supermarkets]);

    return (
        <MapContainer center={[38.2475, 21.7311]} zoom={16} whenCreated={setMap}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
};

export default Map;