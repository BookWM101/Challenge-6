const apiKey = 'd76933b52f41752e0f5be0c571be99cd';
let pastSearches = [];

function searchWeather() {
  const city = document.getElementById("city-search").value.trim();
  if (city) {
    fetchWeather(city);
    addToPastSearches(city);
    console.log("Added city to history!");
  } else {
    alert("Please enter a city.");
  }
}

function fetchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl)
    .then(response => {
      const weatherData = response.data;
      displayCurrentWeather(weatherData);
      fetchForecast(city);
      console.log("Fetched city!");
    })
    .catch(error => {
      console.error("Error fetching weather:", error);
      alert("City not found or there was an error fetching the weather data.");
    });
}

function fetchForecast(city) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(forecastUrl)
    .then(response => {
      const forecastData = response.data;
      displayForecast(forecastData);
      console.log("Fetched forecast!");
    })
    .catch(error => {
      console.error("Error fetching forecast:", error);
    });
}

function displayCurrentWeather(data) {
  const weatherElement = document.getElementById("current-weather");
  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  weatherElement.innerHTML = `
    <h2 class="text-center">${data.name} (${new Date().toLocaleDateString()})</h2>
    <p class="text-center">Temperature: ${data.main.temp} °C</p>
    <p class="text-center">Wind Speed: ${data.wind.speed} m/s</p>
    <div class="text-center">
      <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
    </div>
    <p class="text-center">${data.weather[0].description}</p>
  `;
  console.log("Displaying data!");
}

function displayForecast(data) {
  const forecastElement = document.getElementById("forecast");
  forecastElement.innerHTML = ""; // Clears previous forecast

  // Filters data to get one forecast per day
  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.forEach(day => {
    const iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    forecastElement.innerHTML += `
      <div class="col-sm-2 weather-card">
        <div class="card p-2 text-center">
          <h5>${new Date(day.dt_txt).toLocaleDateString()}</h5>
          <img src="${iconUrl}" alt="${day.weather[0].description}" class="weather-icon">
          <p>Temp: ${day.main.temp} °C</p>
          <p>Wind: ${day.wind.speed} m/s</p>
        </div>
      </div>
    `;
    console.log("Data filtered per day!");
  });
}

function addToPastSearches(city) {
  if (!pastSearches.includes(city)) {
    pastSearches.push(city);
    const pastSearchesElement = document.getElementById("past-searches");
    pastSearchesElement.innerHTML += `<li class="list-group-item" onclick="fetchWeather('${city}')">${city}</li>`;
    savePastSearches();
    console.log("Added city to past searches!");
  }
}

function savePastSearches() {
  try {
    localStorage.setItem("pastSearches", JSON.stringify(pastSearches));
    console.log("Saved past city to local storage!");
  } catch (error) {
    console.error("Error saving past searches:", error);
  }
}

function loadPastSearches() {
  try {
    const storedSearches = JSON.parse(localStorage.getItem("pastSearches"));
    if (storedSearches) {
      pastSearches = storedSearches;
      const pastSearchesElement = document.getElementById("past-searches");
      pastSearches.forEach(city => {
        pastSearchesElement.innerHTML += `<li class="list-group-item" onclick="fetchWeather('${city}')">${city}</li>`;
      });
      console.log("Loaded past cities!");
    }
  } catch (error) {
    console.error("Error loading past searches:", error);
  }
}

// Loads past searches on page load
window.onload = loadPastSearches;


