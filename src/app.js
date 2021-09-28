function currentTime() {
  let dayTime = document.querySelector("#day-time");
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  dayTime.innerHTML = `${day}, ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  return days[day];
}

function currentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = `d34bf6dc9d2d08c43bc76d224bf2c78a`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("input#city-input");
  userCity(cityInput);
}
function userCity(cityInput) {
  currentTime();
  let city = cityInput.value;
  let apiKey = "d34bf6dc9d2d08c43bc76d224bf2c78a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);
}

function displayTemperature(response) {
  celsiusTemperature = response.data.main.temp;
  let currentTemp = Math.round(response.data.main.temp);
  let mainTempElement = document.querySelector("#main-temp");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#weather-description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let mainIconElement = document.querySelector("#main-icon");
  mainTempElement.innerHTML = currentTemp;
  mainIconElement.setAttribute(
    "src",
    `icons/${response.data.weather[0].icon}.png`
  );
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  currentTime();
  getForecast(response.data.coord);
}

function getForecast(coordinates) {
  let apiKey = "d34bf6dc9d2d08c43bc76d224bf2c78a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class = "row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `         <div class="col">
                  <div class="forecast-preview">
                    <div class="forecast-day">${formatDay(forecastDay.dt)}</div>
                    <img src="icons/${
                      forecastDay.weather[0].icon
                    }.png" width="60" height="60" />
                    <div class="forecast-temperature">
                      <span class="forecast-temperature-max">${Math.round(
                        forecastDay.temp.max
                      )}°</span> /
                      <span class="forecast-temperature-min">${Math.round(
                        forecastDay.temp.min
                      )}°</span>
                    </div>
                  </div>
                </div>
              `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function celsiusConversion(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let mainTempElement = document.querySelector("#main-temp");
  mainTempElement.innerHTML = Math.round(celsiusTemperature);
}

function fahrenheitConversion(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let mainTempElement = document.querySelector("#main-temp");
  mainTempElement.innerHTML = Math.round(fahrenheitTemperature);
}

currentTime();

let celsiusTemperature = null;

navigator.geolocation.getCurrentPosition(showPosition);

let citySearch = document.querySelector("#city-search");
citySearch.addEventListener("submit", handleSubmit);

let celsiusLink = document.querySelector("#celsius-unit");
celsiusLink.addEventListener("click", celsiusConversion);

let fahrenheitLink = document.querySelector("#fahrenheit-unit");
fahrenheitLink.addEventListener("click", fahrenheitConversion);
