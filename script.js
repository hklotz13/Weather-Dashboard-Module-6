//grabbing city to search for and display data
function findCity() {
    var cityName = titleCase($("#search-city")[0].value.trim());

    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=615b59607166e9c8acd15b654134bc75";

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                $("#search-city")[0].textContent = cityName + " (" + moment().format('M/D/YYYY') + ")";

                $("#search-history-list").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action search-city">' + cityName);
                //Getting coordinates for city
                var lat = data.coord.lat;
                var lon = data.coord.lon;

                var latLon = lat.toString() + " " + lon.toString();

                localStorage.setItem(cityName, latLon);

                apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=615b59607166e9c8acd15b654134bc75";

                fetch(apiURL).then(function (newResponse) {
                    if (newResponse.ok) {
                        newResponse.json().then(function (newData) {
                            getCurrentWeather(newData);
                        })
                    }
                })
            })
        } else {
            alert("No city found");
        }
    })
};

//grabs data to display for given city
function weatherInfo(coordinates) {
    apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&exclude=minutely,hourly&units=imperial&appid=615b59607166e9c8acd15b654134bc75";

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getCurrentWeather(data);
            })
        }
    })
};

//Displays current weather data
function getCurrentWeather(data) {
    $("#city-info").addClass("visible");
    $("#current-temp")[0].textContent = "Temperature: " + data.current.temp.toFixed(1);
    $("#current-humidity")[0].textContent = "Humidity: " + data.current.humidity + "% ";
    $("#current-windspeed")[0].textContent = "Wind Speed: " + data.current.wind_speed.toFixed(1) + " MPH";
    $("#uv-index")[0].textContent = "  " + data.current.uvi;
    futureWeather(data);
};

//displays five day forecast data
function futureWeather(data) {
    for (var i = 0; i < 5; i++) {
        var futureWeather = {
            date: convertUnixTime(data, i),
            icon: "http://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon,
            temp: data.daily[i + 1].temp.day.toFixed(1),
            humidity: data.daily[i + 1].humidity
        }

        var currentSelector = "#day-" + i;
        $(currentSelector)[0].textContent = futureWeather.date;
        currentSelector = "#img-" + i;
        $(currentSelector)[0].src = futureWeather.icon;
        currentSelector = "#temp-" + i;
        $(currentSelector)[0].textContent = "Temp: " + futureWeather.temp + " \u2109";
        currentSelector = "#hum-" + i;
        $(currentSelector)[0].textContent = "Humidity: " + futureWeather.humidity + "%";
    }
}

// converts unix time from server
function convertUnixTime(data, index) {
    const dateObject = new Date(data.daily[index + 1].dt * 1000);

    return (dateObject.toLocaleDateString());
}

$("#search-button").on("click", function (event) {
    event.preventDefault();
    findCity();
    $("form")[0].reset();
});

$(".search-history-list").on("click", "#search-city", function () {

    var coordinates = (localStorage.getItem($(this)[0].textContent)).split(" ");
    coordinates[0] = parseFloat(coordinates[0]);
    coordinates[1] = parseFloat(coordinates[1]);

    $("#search-city")[0].textContent = $(this)[0].textContent + " (" + moment().format('M/D/YYYY') + ")";

    getListCity(coordinates);
});