const apiKey = "bcc255d98924d840a67bb0bb42ce234d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".nav .search input");
const searchBtn = document.querySelector(".nav .search button");
const weatherIcon = document.querySelector(".weather-icon");
async function checkweather(city) {

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    var data = await response.json();
    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity-value").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

    if(data.weather[0].main == "Clouds"){
        weatherIcon.src = "weather-app-img/clouds.png";
    }
    else if(data.weather[0].main == "Clear"){
        weatherIcon.src = "weather-app-img/clear.png";
    }
    else if(data.weather[0].main == "Rain"){
        weatherIcon.src = "weather-app-img/rain.png";
    }
    else if(data.weather[0].main == "Drizzle"){
        weatherIcon.src = "weather-app-img/drizzle.png";
    }
    else if(data.weather[0].main == "Mist"){
        weatherIcon.src = "weather-app-img/mist.png";

    }






}

searchBtn.addEventListener("click", () => {
    checkweather(searchBox.value);




})

