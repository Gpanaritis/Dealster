import React, { useEffect, useState } from "react";
import ProductService from "../../services/product.service";
import "../../styles/AdminProducts.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const OffersCountChart = () => {
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
    const [offers, setOffers] = useState([]);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [firstYear, setFirstYear] = useState(null); // State for first date in the selected month and year range
    const [years, setYears] = useState([]); // State for years [firstYear, currentYear
    const [dates, setDates] = useState([]); // State for dates
    const [counts, setCounts] = useState([]); // State for counts

    useEffect(() => {
        const getOffers = async () => {
            try {
                const response = await ProductService.getOffersGroupedByDate();
                setOffers(response);
                const firstOfferDate = new Date(response[0].date);
                setFirstYear(firstOfferDate.getFullYear());
                const currentYear = currentDate.getFullYear();
                const years = Array.from({ length: currentYear - firstOfferDate.getFullYear() + 1 }, (_, i) => firstOfferDate.getFullYear() + i);
                setYears(years);
            } catch (error) {
                console.error(`Error fetching offers: ${error}`);
            }
        };

        getOffers();
    }, []);

    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(i);
        return date.toLocaleString('default', { month: 'long' });
    });

    const filteredOffers = offers.filter((offer) => {
        if (selectedMonth === "" || selectedYear === "") {
            return true;
        }
        const offerDate = new Date(offer.date);
        return offerDate.getMonth() === selectedMonth && offerDate.getFullYear() === selectedYear;
    });

    useEffect(() => {
        // Create an array of all dates within the selected month and year range
        const startDate = new Date(selectedYear, selectedMonth, 1);
        startDate.setDate(startDate.getDate() + 1);
        const endDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day of the selected month
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const allDates = [];
        const currentDate = new Date(startDate);
        
        while (currentDate.getTime() <= endDate.getTime() && currentDate.getTime() <= today.getTime()) {
            allDates.push(currentDate.toISOString().split('T')[0]); // Format the date as YYYY-MM-DD
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Extract the dates and counts from the filtered offers
        const extractedDates = filteredOffers.map((offer) => offer.date);
        const extractedCounts = filteredOffers.map((offer) => offer.count);
    
        // Create arrays for dates and counts with all dates and counts set to zero
        const datesWithZeroCounts = Array.from({ length: allDates.length }, (_, i) => i + 1);
        const countsWithZeroCounts = allDates.map((date) =>
            extractedDates.includes(date) ? extractedCounts[extractedDates.indexOf(date)] : 0
        );
    
        // Reverse the arrays
        const reversedDates = datesWithZeroCounts;
        const reversedCounts = countsWithZeroCounts;
    
        // Update the state variables with the reversed data
        setDates(reversedDates);
        setCounts(reversedCounts);
    
        // Log the changes
        // console.log('Dates:', reversedDates);
        // console.log('Counts:', reversedCounts);
    }, [selectedMonth, selectedYear, offers]);

    const data = {
        labels: dates,
        datasets: [
            {
                fill: true,
                label: "Offers",
                backgroundColor: "rgba(75,192,192,0.6)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(75,192,192,0.8)",
                hoverBorderColor: "rgba(75,192,192,1)",
                data: counts,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Number of offers added per day',
            },
        },
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(parseInt(event.target.value, 10));
    };

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value, 10));
    };

    return (
        <div className="container mt-4">
          <div className="offers-count-header">
            <h2>Offers added</h2>
          </div>
          <div className="month-year-selection">
            <div className="select-group1">
              <select id="monthSelect" onChange={handleMonthChange}>
                <option value={currentDate.getMonth()}>Select Month</option>
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-group2">
              <select id="yearSelect" onChange={handleYearChange}>
                <option value={currentDate.getFullYear()}>Select Year</option>
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="offers-count-content">
            <Line data={data} options={options} />
          </div>
        </div>
      );
}

export default OffersCountChart;
