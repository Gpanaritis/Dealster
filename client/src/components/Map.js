import React, { useState, useEffect} from "react";
import ReactDOM from "react-dom";
import AuthService from "../services/auth.service";
import SupermarketService from "../services/supermarket.service";
import { MapContainer, TileLayer } from 'react-leaflet'
import { icon, latLng } from "leaflet";
import L from "leaflet";
import "leaflet-easybutton/src/easy-button.js";
import "leaflet-easybutton/src/easy-button.css";
import "../styles/Map.css";
import Offers from "./Offers";


const Map = ({ selectedSupermarkets, filterType, activeFilter }) => {
    const [map, setMap] = useState(null);
    const [supermarkets, setSupermarkets] = useState(null);
    const [location, setLocation] = useState(null);
    const [showAdminBoard, setShowAdminBoard] = useState(false);

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
        const getUser = async () => {
            try{
                const user = await AuthService.getCurrentUser();
                if(user){
                    setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
                }
            }
            catch(error){
                console.error(error);
            }
        }

        getUser();
            
    }, []);


    useEffect(() => {
        if (!map) return;
        const getSupermarkets = async (location) => {
            const response = await SupermarketService.fetchAndStoreSupermarkets(location.lat, location.lng);
            for (let supermarket of response) {
                let icon;
                let link;
                if (supermarket.is_near === 1 ||showAdminBoard) {
                    icon = showAdminBoard? supermarket.num_offers === 0 ? redIcon : blueIcon : greenIcon;
                    const numOffers = supermarket.num_offers;
                    const addOfferUrl = `/addOffer/${supermarket.id}`;
                    const addOfferLink = `<a href="${addOfferUrl}">Add offer</a>`;
                    const supermarketOffersUrl = `/supermarketOffers/${supermarket.id}`;
                    const supermarketOffersLink = `<a href="${supermarketOffersUrl}">${numOffers} offer${numOffers !== 1 ? 's' : ''} available</a>`;
                    link = `${addOfferLink} | ${supermarketOffersLink}`;
                } else {
                    icon = supermarket.num_offers === 0 ? redIcon : blueIcon;
                    // const url = `/supermarketOffers/${supermarket.id}`;
                    // const numOffers = supermarket.num_offers;
                    // link = `<a href="${url}">${numOffers} offer${numOffers !== 1 ? 's' : ''} available</a>`;
                }
                if (!Array.isArray(selectedSupermarkets) || selectedSupermarkets?.includes(supermarket.id)) {
                    const marker = L.marker([supermarket.latitude, supermarket.longitude], { icon }).addTo(map);
                    // marker.bindPopup(`${supermarket.name}<br>${link}`);
                    marker.bindPopup(function (layer) {
                        const container = document.createElement('div');
                        container.classList.add('popup-container'); // Add a CSS class
                      
                        // Create a React portal for your content
                        ReactDOM.render(
                          <div>
                            <Offers supermarket_id={supermarket.id} link={link} />
                          </div>,
                          container
                        );
                      
                        return container;
                      });
                      
                }
            }
        };

        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function (map) {
            const legendContainer = L.DomUtil.create('div', 'legend-container');

            const items = [
                { color: 'green', label: 'Nearby supermarket with offers' },
                { color: 'blue', label: 'Supermarket with offers' },
                { color: 'red', label: 'Supermarket without offers' },
            ];

            items.forEach(item => {
                const legendItem = L.DomUtil.create('div', 'legend-item', legendContainer);
                const legendIcon = L.DomUtil.create('div', 'legend-icon', legendItem);
                legendIcon.style.backgroundColor = item.color;
                const legendLabel = L.DomUtil.create('div', 'legend-label', legendItem);
                legendLabel.textContent = item.label;
            });

            return legendContainer;
        };

        legend.addTo(map);

        if (activeFilter) {
            const secondLegend = L.control({ position: 'topright' });
        
            secondLegend.onAdd = function (map) {
                const legendContainer = L.DomUtil.create('div', 'legend-container');
        
                const items = [
                    { label: `Filter: ${activeFilter}` }
                ];
        
                items.forEach(item => {
                    const legendItem = L.DomUtil.create('div', 'legend-item', legendContainer);
                    const legendLabel = L.DomUtil.create('div', 'legend-label', legendItem);
        
                    // Apply custom CSS styles for the filter appearance
                    legendLabel.style.fontSize = '16px'; // Adjust the font size as needed
                    legendLabel.style.color = '#fff'; // Text color is white
                    legendLabel.style.backgroundColor = '#0074D9'; // Background color is blue
                    legendLabel.style.padding = '10px'; // Add padding to improve spacing
                    legendLabel.style.borderRadius = '5px'; // Add rounded corners for a filter-like look
        
                    legendLabel.textContent = item.label;
                });
        
                return legendContainer;
            };
        
            secondLegend.addTo(map);
        }

        map.locate().on("locationfound", function (e) {
            getSupermarkets(e.latlng);
        });

        L.easyButton("fa-map-marker", () => {
            map.locate().on("locationfound", function (e) {
                let latlng = [38.23607290, 21.72835230]
                setLocation(latLng);
                map.flyTo(latlng, map.getZoom());
            });
        }).addTo(map);

        map.locate().on("locationfound", function (e) {
            let latlng = [38.23607290, 21.72835230]
            L.marker(latlng, { icon: currLocationIcon }).addTo(map).bindPopup("You are here").openPopup();
        });
    }, [map]);

    useEffect(() => {
        if (!supermarkets) return;
        // console.log(supermarkets[0]);
    }, [supermarkets]);

    return (
        <MapContainer center={[38.2475, 21.7311]} zoom={16} whenCreated={setMap} style={{ zIndex: 0 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
};

export default Map;