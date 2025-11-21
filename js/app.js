document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    	
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

async function fetchWeatherData(city) {
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
