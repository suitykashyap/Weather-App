document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    
    if (city) {
        fetchRealWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

async function fetchRealWeatherData(city) {
    const apiKey = '13e1453a13aee34453910ccde1b67eee';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const displayArea = document.getElementById('weather-display-area');
    const cityNameEl = document.getElementById('city-name');
    const tempEl = document.getElementById('temperature');
    const descEl = document.getElementById('description');
    const iconEl = document.getElementById('weather-icon');
    const humidityEl = document.getElementById('humidity');
    const windEl = document.getElementById('wind-speed');

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'City not found');
        }

        const data = await response.json();
        console.log('Real Current Weather data:', data);

        cityNameEl.textContent = data.name;
        tempEl.textContent = `${Math.round(data.main.temp)}°C`;
        descEl.textContent = data.weather[0].description;
        humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
        windEl.textContent = `Wind Speed: ${data.wind.speed} km/h`;
        iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        iconEl.alt = data.weather[0].description;
        iconEl.style.display = 'block'; 
        displayArea.style.display = 'block';

        try {
            const location = getUserLocation(); 
            
            const forecastData = generateWeatherForecast(data.name, location.latitude, location.longitude); 
            
            console.log('Simulated Forecast data (with simulated location):', forecastData); 
            updateForecastUI(forecastData);

        } catch (simulationError) {
            console.error('Simulation Error:', simulationError.message);
            document.getElementById('forecast-section').style.display = 'none';
        }

    } catch (apiError) {
        console.error('Error fetching real weather data:', apiError.message);
        
        cityNameEl.textContent = 'Error';
        tempEl.textContent = '';
        descEl.textContent = apiError.message;
        humidityEl.textContent = 'Humidity: --%';
        windEl.textContent = 'Wind Speed: -- km/h';
        iconEl.style.display = 'none';
        displayArea.style.display = 'block';
        document.getElementById('forecast-section').style.display = 'none';
    }
}

function getUserLocation() {
    const isLocationAvailable = Math.random() > 0.2; 
    
    if (!isLocationAvailable) {
        throw new Error("Failed to detect location. Geolocation data is unavailable.");
    }
    
    return {
        latitude: 40.7128,
        longitude: -74.0060
    };
}

function generateWeatherForecast(city, latitude, longitude) {
    if (typeof city !== 'string' || city.trim() === "") {
        throw new Error("Invalid city name. Please provide a valid city.");
    }

    const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Snowy"];
    const forecast = [];
    const currentDate = new Date();

    for (let i = 0; i < 3; i++) {
        currentDate.setDate(currentDate.getDate() + 1);
        const date = currentDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        const temperature = Math.random() * 45 - 10;
        const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const humidity = Math.random() * 100;

        forecast.push({
            date: date,
            temperature: temperature,
            condition: condition,
            humidity: humidity,
            latitude: latitude,
            longitude: longitude
        });
    }
    return forecast;
}

function updateForecastUI(forecastData) {
    const iconMap = {
        "Sunny": "01d",
        "Cloudy": "03d",
        "Rainy": "10d",
        "Snowy": "13d"
    };

    for (let i = 0; i < 3; i++) {
        const dayData = forecastData[i];
        const dayIndex = i + 1;

        document.getElementById(`day${dayIndex}-date`).textContent = dayData.date;
        document.getElementById(`day${dayIndex}-icon`).src = `https://openweathermap.org/img/wn/${iconMap[dayData.condition] || '01d'}.png`;
        document.getElementById(`day${dayIndex}-temp`).textContent = `${Math.round(dayData.temperature)}°C`;
        document.getElementById(`day${dayIndex}-desc`).textContent = dayData.condition;
    }

    document.getElementById('forecast-section').style.display = 'block';
}
