let units = 0;//keeping track of selected unit (oC || oF) - oC on load
let weatherInfo = {};//stores weather data. global because easier to work with

//getting coords by searching city name. calls cleanGeoCodingData()
function geoCoding(cityName) {
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=8fac8ffe3c4eec71f67056d735e1228c`,
  {mode: "cors"})
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      cleanGeoCodingData(response);
    })
    .catch(function() {
      console.log('error!');
    })
}

//cleaning up the data from the geocoding. calls createSearchResults()
function cleanGeoCodingData(geoCodingData) {
  let resultsArray = [];
  geoCodingData.forEach(location => {
    let object = {};
    object.name = location.name;
    object.region = location.state;
    object.country = location.country;
    object.lat = location.lat;
    object.lon = location.lon;
    resultsArray.push(object);
  });
  createSearchResults(resultsArray);
}

//create one instance from the search result list
//fn adds an event listener to the instance as well
function createSearchResultInstance(parentNode, name, region, country, lat, lon) {
  const container = document.createElement('button');
  const location = document.createElement('div');
  const coordinates = document.createElement('div');

  location.textContent = `${name}, ${region}, ${country}`;
  coordinates.textContent = `Latitude: ${lat.toPrecision(6)}; Longitude: ${lon.toPrecision(6)}`;

  container.classList.add('search-result-item');
  location.classList.add('location');
  coordinates.classList.add('coordinates');

  container.appendChild(location);
  container.appendChild(coordinates);
  parentNode.appendChild(container);

  //event listener to show weather data on click
  container.addEventListener('click', () => {
    //remove previous data shown
    const mainContainer = document.querySelector('.main-container');
    removeAllChildNodes(mainContainer);

    //remove list
    removeAllChildNodes(parentNode);

    getWeatherData(lat, lon, location.textContent);
  })
}

//create list of search results
function createSearchResults(resultsArray) {
  const sidebarContainer = document.querySelector('.sidebar-container');

  for (i = 0; i < resultsArray.length; i++) {
    createSearchResultInstance(sidebarContainer, resultsArray[i].name,
      resultsArray[i].region, resultsArray[i].country, resultsArray[i].lat, 
      resultsArray[i].lon);
  }
}

//clear an element of all child nodes
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

/* getting weather data for one location using coords. calls cleanWeatherData()
locationName holds the name of the location, it gets this name from 
createSearchResultInstance. */
async function getWeatherData(lat, lon, locationName) {
  let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=8fac8ffe3c4eec71f67056d735e1228c`,
  {mode: "cors"})
  let data = await response.json();
  cleanWeatherData(data, locationName);
}

//picking necessary data from getWeatherData()
function cleanWeatherData(weatherData, locationName) {
  weatherInfo.desc = weatherData.weather[0].main;
  weatherInfo.desc2 = weatherData.weather[0].description;
  weatherInfo.icon = weatherData.weather[0].icon;
  weatherInfo.temp = weatherData.main.temp.toPrecision(2) - 273;
  weatherInfo.tempMin = weatherData.main.temp_min.toPrecision(2) - 273;
  weatherInfo.tempMax = weatherData.main.temp_max.toPrecision(2) - 273;
  weatherInfo.feelsLike = weatherData.main.feels_like.toPrecision(2) - 273;
  weatherInfo.humidity = weatherData.main.humidity;
  createWeatherInfoCard(weatherInfo, locationName);
}

//generating weather info for selected location
function createWeatherInfoCard (weatherDataObject, locationName) {
  let degree = 'o';//degree symbol to be used for .sup()
  const mainContainer = document.querySelector('.main-container');
  const weatherInfoCard = document.createElement('div');
  const title = document.createElement('div');
  const conditionContainer = document.createElement('div');
  const conditionText1 = document.createElement('div');
  const conditionText2 = document.createElement('div');
  const conditionIcon = document.createElement('img');
  const temperaturesContainer = document.createElement('div');
  const temp = document.createElement('div');
  const tempMin = document.createElement('div');
  const tempMax = document.createElement('div');
  const feelsLike = document.createElement('div');
  const humidity = document.createElement('div');
  //unit button
  const unitButtonContainer = document.createElement('div');
  const celsius = document.createElement('div');
  const labelSwitch = document.createElement('label');
  const checkBox = document.createElement('input');
  const sliderRound = document.createElement('div');
  const fahrenheit = document.createElement('div');

  weatherInfoCard.classList.add('card');
  title.classList.add('title');
  conditionContainer.classList.add('condition-container');
  conditionText1.classList.add('text1');
  conditionText2.classList.add('text2');
  conditionIcon.classList.add('icon');
  temperaturesContainer.classList.add('temperatures-container');
  temp.classList.add('temp');
  tempMin.classList.add('temp-min');
  tempMax.classList.add('temp-max');
  feelsLike.classList.add('feels-like');
  humidity.classList.add('humidity');
  unitButtonContainer.classList.add('unit-button-container');
  celsius.classList.add('text-celsius');
  labelSwitch.classList.add('switch');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.setAttribute('id', 'checkbox');
  sliderRound.classList.add('slider');
  sliderRound.classList.add('round');
  fahrenheit.classList.add('text-fahrenheit');

  title.textContent = locationName;
  conditionText1.textContent = weatherDataObject.desc;
  conditionText2.textContent = weatherDataObject.desc2;
  conditionIcon.setAttribute('src',
   `https://openweathermap.org/img/wn/${weatherDataObject.icon}.png`);
  temp.textContent = `Temperature: ${weatherDataObject.temp} \u{00B0}C`;
  tempMin.textContent = `Min: ${weatherDataObject.tempMin} \u{00B0}C`;
  tempMax.textContent = `Max: ${weatherDataObject.tempMax} \u{00B0}C`;
  feelsLike.textContent = `Feels like: ${weatherDataObject.feelsLike} \u{00B0}C`;
  humidity.textContent = `Humidity: ${weatherDataObject.humidity}%`;
  celsius.textContent = '\u{00B0}C';
  fahrenheit.textContent = '\u{00B0}F';

  mainContainer.appendChild(weatherInfoCard);
  weatherInfoCard.appendChild(title);
  weatherInfoCard.appendChild(conditionContainer);
  weatherInfoCard.appendChild(temperaturesContainer);
  weatherInfoCard.appendChild(humidity);
  conditionContainer.appendChild(conditionText1);
  conditionContainer.appendChild(conditionText2);
  conditionContainer.appendChild(conditionIcon);
  temperaturesContainer.appendChild(temp);
  temperaturesContainer.appendChild(tempMin);
  temperaturesContainer.appendChild(tempMax);
  temperaturesContainer.appendChild(feelsLike);
  weatherInfoCard.appendChild(unitButtonContainer);
  unitButtonContainer.appendChild(celsius);
  unitButtonContainer.appendChild(labelSwitch);
  labelSwitch.appendChild(checkBox);
  labelSwitch.appendChild(sliderRound);
  unitButtonContainer.appendChild(fahrenheit);

  checkBox.addEventListener('click' , () => {
    changeUnits();
  })
}

function changeUnits () {
  units === 0 ? units = 1 : units = 0;

  const temp = document.querySelector('.temp');
  const tempMin = document.querySelector('.temp-min');
  const tempMax = document.querySelector('.temp-max');
  const feelsLike = document.querySelector('.feels-like');

  if (units === 0) {
    temp.textContent = `Temperature: ${weatherInfo.temp} \u{00B0}C`;
    tempMin.textContent = `Min: ${weatherInfo.tempMin} \u{00B0}C`;
    tempMax.textContent = `Max: ${weatherInfo.tempMax} \u{00B0}C`;
    feelsLike.textContent = `Feels like: ${weatherInfo.feelsLike} \u{00B0}C`;
  } else {
    temp.textContent = `Temperature: ${(weatherInfo.temp * 1.8) + 32} \u{00B0}F`;
    tempMin.textContent = `Min: ${(weatherInfo.tempMin * 1.8) + 32} \u{00B0}F`;
    tempMax.textContent = `Max: ${(weatherInfo.tempMax * 1.8) + 32} \u{00B0}F`;
    feelsLike.textContent = `Feels like: ${(weatherInfo.feelsLike * 1.8) + 32} \u{00B0}F`;
  }
}

//event listener for location search
const form = document.querySelector('.search-bar');

form.addEventListener('submit', () => {
  event.preventDefault();

  units = 0;

  const formData = new FormData(form);
  const city = formData.get('city');
  const sidebarContainer = document.querySelector('.sidebar-container');

  removeAllChildNodes(sidebarContainer);//remove items from previous search
  geoCoding(city);
})