import "./style.css";

const API_KEY = "8SFGNXS3DXHPEHVGL2CXFKG5G";

function processWeatherData(data) {
    return {
        city: data.address,
        temperature: data.currentConditions.temp,
        feelsLike: data.currentConditions.feelslike,
        humidity: data.currentConditions.humidity,
        conditions: data.currentConditions.conditions,
        windspeed: data.currentConditions.windspeed,
        icon: data.currentConditions.icon
    };
}

async function getWeather(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("No se pudo obtener el clima");
    }

    const data = await response.json();

    return processWeatherData(data);
}

const form = document.querySelector("#weather-form");
const locationInput = document.querySelector("#location-input");
const weatherContainer = document.querySelector("#weather-container");
let isFahrenheit = false;
const unitToggle = document.querySelector("#unit-toggle");
let currentWeather = null;

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const location = locationInput.value.trim();

    if (location === "") {
        weatherContainer.textContent = "Escribe una ciudad.";
        return;
    }

    try {
            weatherContainer.textContent = "Buscando clima...";
            const weather = await getWeather(location);

            currentWeather = weather;

            displayWeather(weather);
        } catch (error) {
            weatherContainer.textContent = "No se pudo encontrar el clima.";
        }
    });

unitToggle.addEventListener("change", () => {
    isFahrenheit = unitToggle.checked;

        if (currentWeather) {
        displayWeather(currentWeather);
    }
});

function convertTemperature(celsius) {
    if (isFahrenheit) {
        return (celsius * 9 / 5) + 32;
    }

    return celsius;
}

function displayWeather(weather) {
    weatherContainer.innerHTML = `
        <h2>${weather.city}</h2>
        <img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/4th%20Set%20-%20Color/${weather.icon}.png" alt="${weather.conditions}">
        <p>${convertTemperature(weather.temperature)}°</p>
        <p>${weather.conditions}</p>
        <p>Sensación: ${convertTemperature(weather.feelsLike)}°</p>
        <p>Humedad: ${weather.humidity}%</p>
        <p>Viento: ${weather.windspeed} km/h</p>
    `;
}
