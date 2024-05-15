document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "b2a5adcct04b33178913oc335f405433";
  const form = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const currentCityElement = document.getElementById("current-city");
  const currentTemperatureElement = document.getElementById(
    "current-temperature"
  );
  const currentDateElement = document.getElementById("current-date");
  const currentTimeElement = document.getElementById("current-time");
  const weatherDescriptionElement = document.getElementById(
    "weather-description"
  );
  const humidityElement = document.getElementById("humidity");
  const windElement = document.getElementById("wind");
  const temperatureIconElement = document.querySelector(
    ".current-temperature-icon"
  );

  function getWeatherEmoji(description) {
    const weatherConditions = {
      "clear sky": "☀️",
      "few clouds": "🌤️",
      "scattered clouds": "☁️",
      "broken clouds": "☁️",
      "shower rain": "🌧️",
      rain: "🌧️",
      thunderstorm: "⛈️",
      snow: "❄️",
      mist: "🌫️",
      "moderate rain": "🌧️",
      "overcast clouds": "☁️",
    };
    return weatherConditions[description.toLowerCase()] || "❓";
  }

  function updateWeather(data) {
    const city = data.city;
    const temperature = Math.round(data.temperature.current);
    const description = data.condition.description;
    const humidity = data.temperature.humidity;
    const windSpeed = data.wind.speed;
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    currentCityElement.textContent = city;
    currentTemperatureElement.textContent = temperature;
    currentDateElement.textContent = formattedDate;
    currentTimeElement.textContent = formattedTime;
    weatherDescriptionElement.textContent = description;
    humidityElement.textContent = `${humidity}%`;
    windElement.textContent = `${windSpeed} km/h`;
    temperatureIconElement.textContent = getWeatherEmoji(description);
  }

  async function fetchWeather(city) {
    const url = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
    try {
      const response = await axios.get(url);
      updateWeather(response.data);
    } catch (error) {
      alert("City not found. Please try again.");
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const city = searchInput.value;
    fetchWeather(city);
  });

  function formatDate(date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    let day = date.getDay();

    function updateDateTime() {
      const currentDate = new Date();
      const dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      const formattedDate = currentDate.toLocaleDateString(
        undefined,
        dateOptions
      );
      const formattedTime = currentDate.toLocaleTimeString(
        undefined,
        timeOptions
      );

      document.getElementById("current-date").innerText = formattedDate;
      document.getElementById("current-time").innerText = formattedTime;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    if (hours < 10) {
      hours = `0${hours}`;
    }

    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let formattedDay = days[day];
    return `${formattedDay} ${hours}:${minutes}`;
  }

  const currentDate = new Date();
  currentDateElement.innerHTML = formatDate(currentDate);

  // Fetch weather for the default city on load
  fetchWeather("Johannesburg");
});
