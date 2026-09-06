// 1. Where The ISS At API (Tracks the Space Station)
async function fetchISS() {
  const el = document.getElementById("iss-status");
  el.textContent = "Locating station...";
  try {
    const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
    if (!res.ok) throw new Error("Network response failed");
    const data = await res.json();
    el.textContent = `Lat: ${data.latitude.toFixed(2)}°, Long: ${data.longitude.toFixed(2)}°`;
  } catch (err) {
    el.textContent = "Could not track the ISS right now.";
  }
}

async function fetchWeatherByCity() {
  const cityInput = document.getElementById("city-input");
  const el = document.getElementById("weather-status");
  const city = cityInput.value.trim();

  if (!city) {
    el.textContent = "Please enter a city name.";
    return;
  }

  el.textContent = `Searching skies in ${city}...`;

  try {
    // 1. Geocoding API: Convert city name to latitude & longitude
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      el.textContent = `City "${city}" not found. Try another!`;
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Weather API: Get current conditions for those coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const temp = Math.round(weatherData.current.temperature_2m);
    const sky = weatherData.current.is_day ? "Daytime" : "Night Sky";

    // Displays: "Kavala, Greece: 22°C — Night Sky"
    el.textContent = `${name}, ${country}: ${temp}°C — ${sky}`;
  } catch (err) {
    el.textContent = "Error fetching weather data. Please try again.";
  }
}
// 3. Reliable Joke API
async function fetchJoke() {
  const setup = document.getElementById("joke-setup");
  const punch = document.getElementById("joke-punchline");
  if (!setup || !punch) return;

  setup.textContent = "Thinking of one...";
  punch.textContent = "";

  try {
    const res = await fetch("https://v2.jokeapi.dev/joke/Any?safe-mode");
    if (!res.ok) throw new Error("Network response failed");
    const data = await res.json();

    if (data.type === "twopart") {
      setup.textContent = data.setup;
      punch.textContent = `— ${data.delivery}`;
    } else {
      setup.textContent = data.joke;
      punch.textContent = "";
    }
  } catch (err) {
    setup.textContent = "Why do programmers prefer dark mode?";
    punch.textContent = "— Because light attracts bugs.";
  }
}

// 4. TheCatAPI (Random cat photo)
async function fetchCat() {
  const img = document.getElementById("cat-img");
  const loading = document.getElementById("cat-loading");

  if (loading) loading.style.display = "block";
  if (img) img.style.display = "none";

  try {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    if (!res.ok) throw new Error("Network response failed");
    const data = await res.json();
    
    // Set the image src (the onload attribute in HTML reveals it smoothly)
    img.src = data[0].url;
  } catch (err) {
    if (loading) loading.textContent = "Cat refused to appear 😿";
  }
}

// Automatically populate the cards as soon as the page loads
fetchISS();
fetchJoke();
fetchCat();