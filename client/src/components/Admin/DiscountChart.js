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

const DiscountChart = () => {
    const currentDate = new Date();
    const [weekOffset, setWeekOffset] = useState(0); // State for first date in the selected month and year range
    const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (weekOffset * 7), 0, 0, 0, 0));
    const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7 - (weekOffset * 7), 0, 0, 0, 0));
    const [discounts, setDiscounts] = useState(null);
    const [dates, setDates] = useState([]); // State for dates
    const [counts, setCounts] = useState([]); // State for counts
    const [categories, setCategories] = useState([]); // State for categories [firstYear, currentYear
    const [selectedCategory, setSelectedCategory] = useState(1); // State for selected category
    const [subcategories, setSubcategories] = useState([]); // State for subcategories [firstYear, currentYear
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); // State for selected subcategory

    // Handle the previous week button click
    const handlePrevWeek = () => {
        // check if weekOffset exists in the array
        if (weekOffset === discounts.length - 1) return;
        setStartDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (weekOffset + 1) * 7, 0, 0, 0, 0));
        setEndDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7 - (weekOffset + 1) * 7, 0, 0, 0, 0));
        setWeekOffset(weekOffset + 1);
    };

    // Handle the next week button click
    const handleNextWeek = () => {
        if (weekOffset === 0) return;
        setStartDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (weekOffset - 1) * 7, 0, 0, 0, 0));
        setEndDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7 - (weekOffset - 1) * 7, 0, 0, 0, 0));
        setWeekOffset(weekOffset - 1);
    };

    const handleCategoryChange = (event) => {

        const getOffers = async () => {
            try {
                const response = await ProductService.getVarianceByCategory(categoryId);
                setDiscounts(response);
            } catch (error) {
                console.error(`Error fetching offers: ${error}`);
            }
        };

        const getSubcategories = async (categoryId) => {
            try {
                const response = await ProductService.getSubcategories(categoryId);
                setSubcategories(response);
            } catch (error) {
                console.error(`Error fetching offers: ${error}`);
            }
        };


        const categoryIndex = event.target.value;
        const categoryId = categories[categoryIndex].id;
        setSelectedCategory(categoryId);

        getOffers();
        getSubcategories(categoryId);
        const subcategorySelect = document.getElementById('subcategorySelect');
        subcategorySelect.selectedIndex = 0;
    };

    const handleSubcategoryChange = (event) => {

        const getOffers = async (subcategoryId) => {
            try {
                const response = await ProductService.getVarianceBySubcategory(subcategoryId);
                setDiscounts(response);
            } catch (error) {
                console.error(`Error fetching offers: ${error}`);
            }
        };

        const subcategoryIndex = event.target.value;
        const subcategoryId = subcategories[subcategoryIndex].id;
        setSelectedSubcategory(subcategoryId);

        getOffers(subcategoryId);
    };

    useEffect(() => {
        const getOffers = async () => {
            try {
                const response = await ProductService.getVarianceByCategory(selectedCategory);
                setDiscounts(response);
            } catch (error) {
                console.error(`Error fetching offers: ${error}`);
            }
        };
        const getCategories = async () => {
            try {
                const response = await ProductService.getCategories();
                setCategories(response);
            } catch (error) {
                console.error(`Error fetching offers: ${error}`);
            }
        };

        getOffers();
        getCategories();
    }, []);

    useEffect(() => {
        if (!discounts) return;

        const today = new Date();
        const allDates = [];
        const currentDate = new Date(startDate);

        while (currentDate.getTime() <= endDate.getTime() && currentDate.getTime() <= today.getTime()) {
            allDates.push(currentDate.toISOString().split('T')[0]); // Format the date as YYYY-MM-DD
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Extract the dates and counts from the filtered offers
        const extractedDates = discounts[weekOffset].variances.map((offer) => {
            const date = new Date(offer.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const extractedCounts = discounts[weekOffset].variances.map((offer) => offer.variance);


        // Reverse the arrays
        const reversedDates = extractedDates.reverse();
        const reversedCounts = extractedCounts.reverse();

        // Update the state variables with the reversed data
        setDates(reversedDates);
        setCounts(reversedCounts);

    }, [discounts, weekOffset]);

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
                text: 'Discounts per day',
            },
        },
    };

    return (
        <div className="container mt-4">
            <div className="offers-count-header">
                <h2>Offers added</h2>
            </div>
            <div>
                <div className="select-group1">
                    <select id="categorySelect" onChange={handleCategoryChange}>
                        <option value={1}>Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={index}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="select-group2">
                    <select id="subcategorySelect" onChange={handleSubcategoryChange}>
                        <option value={1}>Select Subcategory</option>
                        {subcategories.map((subcategory, index) => (
                            <option key={index} value={index}>
                                {subcategory.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="month-year-selection">
                {weekOffset < discounts?.length - 1 && (
                    <button onClick={handlePrevWeek} style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <i className="fas fa-angle-left"></i>
                    </button>
                )}
                <div className="week-dates">
                    {endDate.toLocaleDateString("en-GB")} - {startDate.toLocaleDateString("en-GB")}
                </div>
                {weekOffset > 0 && (
                    <button onClick={handleNextWeek} style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <i className="fas fa-angle-right"></i>
                    </button>
                )}
            </div>
            <div className="offers-count-content">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}

export default DiscountChart;
