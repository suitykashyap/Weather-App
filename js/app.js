document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

async function fetchWeatherData(city) {
    constapiKey = '13e1453a13aee34453910ccde1b67eee'; 
    
    constapiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    constdisplayArea = document.getElementById('weather-display-area');
    constcityNameEl = document.getElementById('city-name');
    consttempEl = document.getElementById('temperature');
    constdescEl = document.getElementById('description');
    consticonEl = document.getElementById('weather-icon');
    consthumidityEl = document.getElementById('humidity');
    constwindEl = document.getElementById('wind-speed');

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            consterrorData = await response.json();
            throw new Error(errorData.message || 'City not found');
        }

        const data = await response.json();
        console.log('Weather data:', data); 

        cityNameEl.textContent = data.name;
        tempEl.textContent = `${Math.round(data.main.temp)}°C`;
        descEl.textContent = data.weather[0].description;
        humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
        windEl.textContent = `Wind Speed: ${data.wind.speed} km/h`;
        
        iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        iconEl.alt = data.weather[0].description;
        iconEl.style.display = 'block';

        displayArea.style.display = 'block';

    } catch (error) {
        console.error('Error fetching weather data:', error);
        
        cityNameEl.textContent = 'Error';
        tempEl.textContent = '';
        descEl.textContent = error.message;
        humidityEl.textContent = 'Humidity: --%';
        windEl.textContent = 'Wind Speed: -- km/h';
        iconEl.style.display = 'none'; 

        displayArea.style.display = 'block'; 
    }
}
