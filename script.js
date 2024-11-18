const apiKey = "931add65f661b62e41a10eb706475ea9"; // Replace with your OpenWeather API key

// Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const airQuality = document.getElementById("airQuality");

// Fetch weather data for a given city
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();

        if (data.cod !== 200) {
            alert("City not found!");
            return;
        }

        updateUI(data);
        // Fetch AQI using the location data
        fetchAQI(data.coord.lat, data.coord.lon);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Unable to fetch weather data. Please try again.");
    }
}

// Fetch AQI based on coordinates
async function fetchAQI(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        const data = await response.json();

        if (data.list && data.list.length > 0) {
            const aqi = data.list[0].main.aqi;
            airQuality.textContent = getAQIDescription(aqi);
        } else {
            airQuality.textContent = "--";
        }
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        airQuality.textContent = "Unavailable";
    }
}

// Convert AQI number to descriptive text
function getAQIDescription(aqi) {
    switch (aqi) {
        case 1:
            return "Good";
        case 2:
            return "Fair";
        case 3:
            return "Moderate";
        case 4:
            return "Poor";
        case 5:
            return "Very Poor";
        default:
            return "Unknown";
    }
}

// Fetch weather data for current location
async function fetchWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();

        if (data.cod !== 200) {
            alert("Location data not found!");
            return;
        }

        updateUI(data);
        // Fetch AQI using the location data
        fetchAQI(lat, lon);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Unable to fetch weather data. Please try again.");
    }
}

// Update UI with fetched weather data
function updateUI(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather icon">`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
}

// Get current location and fetch weather
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByLocation(latitude, longitude);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to fetch location. Please search for a city.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Event listeners
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

// Fetch weather on page load
window.addEventListener("load", getCurrentLocation);
