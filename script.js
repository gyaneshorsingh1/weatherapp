const apiKey = "bcc255d98924d840a67bb0bb42ce234d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".nav .search input");
const searchBtn = document.querySelector(".nav .search button");
const weatherIcon = document.querySelector(".weather-icon");

// Weather icons map
const iconMap = {
  Clouds: "clouds.png",
  Clear: "clear.png",
  Rain: "rain.png",
  Drizzle: "drizzle.png",
  Mist: "mist.png"
};

// Get current weather data
async function checkweather(city) {
  if (!city) return;

  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity-value").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    const mainWeather = data.weather[0].main;
    weatherIcon.src = `weather-app-img/${iconMap[mainWeather] || "clear.png"}`;
    weatherIcon.alt = mainWeather;

    await showForecast(city);  // Fetch 5-day forecast

  } catch (error) {
    alert(error.message || "Something went wrong.");
    document.querySelector(".city").innerHTML = "City not found";
    document.querySelector(".temp").innerHTML = "--";
    document.querySelector(".humidity-value").innerHTML = "--";
    document.querySelector(".wind").innerHTML = "--";
    weatherIcon.src = "weather-app-img/clear.png";
  }
}

// Fetch 5-day forecast
async function showForecast(city) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  try {
    const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    const data = await response.json();

    // Filter one forecast per day (12:00 PM)
    const dailyForecasts = data.list.filter(f => f.dt_txt.includes("12:00:00"));

    dailyForecasts.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const weather = forecast.weather[0].main;
      const temp = Math.round(forecast.main.temp);
      const icon = forecast.weather[0].icon;

      const forecastHTML = `
        <div class="forecast-day">
          <h4>${day}</h4>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${weather}">
          <p>${temp}°C</p>
          <p>${weather}</p>
        </div>
      `;

      forecastContainer.innerHTML += forecastHTML;
    });

  } catch (error) {
    forecastContainer.innerHTML = "<p>Error fetching forecast</p>";
  }
}

// Search on button click
searchBtn.addEventListener("click", () => {
  checkweather(searchBox.value);
});

// Search on Enter key press
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkweather(searchBox.value);
  }
});

// ✅ Load default city on page load
window.onload = () => {
  checkweather("Kathmandu");
};



