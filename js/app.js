let isFahrenheit = false;
let currentWeatherData = null;
let currentForecastData = null;
constapiKey = '13e1453a13aee34453910ccde1b67eee';
	
let favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];

document.addEventListener('DOMContentLoaded', () => {
    displayFavoriteCities();
});

document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchRealWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

document.getElementById('unit-toggle').addEventListener('change', toggleTemperatureUnit);

document.getElementById('add-favorite-btn').addEventListener('click', toggleFavoriteCity);

async function fetchRealWeatherData(city) {
    constapiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            consterrorData = await response.json();
            throw new Error(errorData.message || 'City not found');
        }
        
        currentWeatherData = await response.json();
        console.log('Real Current Weather data:', currentWeatherData);

        try {
            const location = getUserLocation();
            currentForecastData = generateWeatherForecast(currentWeatherData.name, location.latitude, location.longitude);
            console.log('Simulated Forecast data:', currentForecastData);
            
            displayAllWeatherData();
            
            document.getElementById('add-favorite-btn').style.display = 'inline-block';
            checkFavoriteStatus(); 

        } catch (simulationError) {
            console.error('Simulation Error:', simulationError.message);
            document.getElementById('forecast-section').style.display = 'none';
        }

    } catch (apiError) {
        console.error('Error fetching real weather data:', apiError.message);
        displayError(apiError.message);
    }
}

function displayAllWeatherData() {
    if (currentWeatherData) {
        displayCurrentWeatherData();
    }
    if (currentForecastData) {
        displayForecastData();
    }
}

function displayCurrentWeatherData() {
    const data = currentWeatherData;
    consttempC = data.main.temp;
    constdisplayTemp = isFahrenheit ?convertToF(tempC) :tempC;
    constdisplayUnit = isFahrenheit ? '°F' : '°C';

    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(displayTemp)}${displayUnit}`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} km/h`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('weather-icon').alt = data.weather[0].description;
    document.getElementById('weather-display-area').style.display = 'block';
}

function displayForecastData() {
    consticonMap = { "Sunny": "01d", "Cloudy": "03d", "Rainy": "10d", "Snowy": "13d" };

    for (let i = 0; i< 3; i++) {
        constdayData = currentForecastData[i];
        constdayIndex = i + 1;
        consttempC = dayData.temperature;

        constdisplayTemp = isFahrenheit ?convertToF(tempC) :tempC;
        constdisplayUnit = isFahrenheit ? '°F' : '°C';

        document.getElementById(`day${dayIndex}-date`).textContent = dayData.date;
        document.getElementById(`day${dayIndex}-icon`).src = `https://openweathermap.org/img/wn/${iconMap[dayData.condition] || '01d'}.png`;
        document.getElementById(`day${dayIndex}-temp`).textContent = `${Math.round(displayTemp)}${displayUnit}`;
        document.getElementById(`day${dayIndex}-desc`).textContent = dayData.condition;
    }
    document.getElementById('forecast-section').style.display = 'block';
}

function displayError(message) {
    document.getElementById('city-name').textContent = 'Error';
    document.getElementById('temperature').textContent = '';
    document.getElementById('description').textContent = message;
    document.getElementById('humidity').textContent = 'Humidity: --%';
    document.getElementById('wind-speed').textContent = 'Wind Speed: -- km/h';
    document.getElementById('weather-icon').style.display = 'none';
    document.getElementById('add-favorite-btn').style.display = 'none';
    document.getElementById('weather-display-area').style.display = 'block';
    document.getElementById('forecast-section').style.display = 'none';
}

function toggleTemperatureUnit() {
    isFahrenheit= !isFahrenheit;
    if (currentWeatherData) {
        displayAllWeatherData();
    }
}

function convertToF(celsius) {
    return (celsius * 9/5) + 32;
}

function toggleFavoriteCity() {
    if (!currentWeatherData) return;

    const city = currentWeatherData.name;
    const{ lat, lon } = currentWeatherData.coord;

    constcityIndex = favoriteCities.findIndex(favCity => favCity.name === city);

    if (cityIndex === -1) {
        favoriteCities.push({ name: city, latitude: lat, longitude: lon });
        console.log(`${city} added to favorites.`);
    } else {
        favoriteCities.splice(cityIndex, 1);
        console.log(`${city} removed from favorites.`);
    }
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
    displayFavoriteCities(); 
    checkFavoriteStatus();  
}

function checkFavoriteStatus() {
    constfavoriteBtn = document.getElementById('add-favorite-btn');
    if (currentWeatherData) {
        const city = currentWeatherData.name;
        constisFavorite = favoriteCities.some(favCity => favCity.name === city);
        if (isFavorite) {
            favoriteBtn.textContent = '★'; 
            favoriteBtn.classList.add('is-favorite');
        } else {
            favoriteBtn.textContent = '☆'; 
            favoriteBtn.classList.remove('is-favorite');
        }
    } else {
        favoriteBtn.style.display = 'none'; 
    }
}

function getWeatherForFavoriteCity(cityName) {
    console.log(`Fetching weather for favorite: ${cityName}`);
    document.getElementById('city-input').value = cityName;
    fetchRealWeatherData(cityName);
}

function removeFavoriteCity(cityName) {
    favoriteCities = favoriteCities.filter(favCity =>favCity.name !== cityName);
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
    console.log(`${cityName} removed from favorites.`);
    displayFavoriteCities();
    if (currentWeatherData&& currentWeatherData.name === cityName) {
        checkFavoriteStatus();
    }
}

function displayFavoriteCities() {
    constlistEl = document.getElementById('favorites-list');
    listEl.innerHTML = '';

    favoriteCities.forEach(city => {
        constbtn = document.createElement('button');
        btn.className = 'favorite-city-btn';
        
        constcityNameSpan = document.createElement('span');
        cityNameSpan.textContent = city.name;
        btn.appendChild(cityNameSpan);

        constremoveBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.className = 'remove-fav-btn';
        removeBtn.title = `Remove ${city.name} from favorites`;
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFavoriteCity(city.name);
        });
        btn.appendChild(removeBtn);

        cityNameSpan.addEventListener('click', () =>getWeatherForFavoriteCity(city.name));
        
        listEl.appendChild(btn);
    });
}

function getUserLocation() {
    constisLocationAvailable = Math.random() > 0.2; 
    if (!isLocationAvailable) {
        throw new Error("Failed to detect location. Geolocation data is unavailable.");
    }
    return {
        latitude: 40.7128,
        longitude: -74.0060
    };
}

function generateWeatherForecast(city, latitude, longitude) {
    if (typeofcity !== 'string' || city.trim() === "") {
        throw new Error("Invalid city name. Please provide a valid city.");
    }
    constweatherConditions = ["Sunny", "Cloudy", "Rainy", "Snowy"];
    const forecast = [];
    constcurrentDate = new Date();
    for (let i = 0; i< 3; i++) {
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
