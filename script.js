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




function setLoadingState(isLoading) {
  const temp = document.querySelector(".temp");
  const city = document.querySelector(".city");
  const humidity = document.querySelector(".humidity-value");
  const wind = document.querySelector(".wind");

  const humidityIcon = document.querySelector(".humidity-icon");
  const windIcon = document.querySelector(".wind-icon");

  const elements = [temp, city, humidity, wind];
  const iconElements = [humidityIcon, windIcon];

  elements.forEach(el => {
    if (isLoading) {
      el.classList.add("skeleton");
      el.textContent = "";
    } else {
      el.classList.remove("skeleton");
    }
  });

  iconElements.forEach(icon => {
    if (isLoading) {
      icon.classList.add("skeleton");
    } else {
      icon.classList.remove("skeleton");
    }
  });
}



async function checkweather(city) {
  if (!city) return;

  setLoadingState(true); // Start shimmer

  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    // Assign data (after shimmer delay)
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity-value").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " km/h";

    const mainWeather = data.weather[0].main;
    weatherIcon.src = `weather-app-img/${iconMap[mainWeather] || "clear.png"}`;
    weatherIcon.alt = mainWeather;

    await showForecast(city);
  } catch (error) {
    alert(error.message || "Something went wrong.");
    document.querySelector(".city").textContent = "City not found";
    document.querySelector(".temp").textContent = "--";
    document.querySelector(".humidity-value").textContent = "--";
    document.querySelector(".wind").textContent = "--";
    weatherIcon.src = "weather-app-img/clear.png";
  }

  setLoadingState(false); // Stop shimmer
}





// Fetch 5-day forecast
async function showForecast(city) {
  const forecastContainer = document.getElementById("forecast");

  // Step 1: Immediately add 5 skeleton forecast cards to keep the layout stable
  forecastContainer.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const skeletonCard = document.createElement("div");
    skeletonCard.className = "forecast-day skeleton";
    skeletonCard.style.height = "120px";
    skeletonCard.style.minWidth = "90px";
    forecastContainer.appendChild(skeletonCard);
  }

  try {
    // Step 2: Fetch forecast data
    const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    const data = await response.json();

    // Step 3: Filter one forecast per day
    const dailyForecasts = data.list.filter(f => f.dt_txt.includes("12:00:00"));

    // Step 4: Replace skeletons with actual data
    forecastContainer.innerHTML = ""; // Replace only after data is ready

    dailyForecasts.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const weather = forecast.weather[0].main;
      const temp = Math.round(forecast.main.temp);
      const icon = forecast.weather[0].icon;

      const forecastHTML = `
        <div class="forecast-day fade-in">
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



