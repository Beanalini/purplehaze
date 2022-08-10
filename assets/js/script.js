let userCity;
var APIKey = "ac2501a6a6e32fdc527f00b094aaa6ad";
var HistoryFlag = 1;


renderCityHistory();

//Submit button clicked by user 
$(submitBtn).on('click', function(event){
  event.preventDefault();
  userCity = $('#city-input').val().trim();
  if (userCity == "") {
  console.log("Line 22: " + userCity);}
  //call open weather API  
  requestWeatherData();  
  //clear search form 
  $("#city-input").val("");
  //set history flag so that we don't add city name to storage
  
})



//search history button clicked
$("body").on("click",  "#city-history button", function() {
  //event.prevent.Default();
 console.log("inside search button click function");
 userCity = $(this).attr("id");
 console.log("history"+ userCity);
 requestWeatherData();
 HistoryFlag = 0;
})

//use the open weather map to get the lat and lon of user requested city
function requestWeatherData() {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&units=metric&appid=" + APIKey;
  fetch(queryURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data){
    console.log("data");
      console.log(data);
      
      //console.log(data.weather[0].description);
      var cityLat = data.coord.lat;
      var cityLon = data.coord.lon;
      oneCallApi(cityLat, cityLon);
      


  });
  //console.log(data.weather[0].description);
}



function currentForecast(currentWeather) {
  //remove previous weather image
   $("#date").empty();
   $("#temp").empty();
   $("#humidity").empty();
   $("#wind-speed").empty();
   $("#uv-index").empty();
   $("#today-image").empty();
   $("#currentCard").css("display", "flex");
  var temp = currentWeather.current.temp;
  var humidity = currentWeather.current.humidity;
  var windSpeed = currentWeather.current.wind_speed;
  var uvi = currentWeather.current.uvi;
  var icon = currentWeather.current.weather[0].icon;
  var weather = currentWeather.current.weather[0].description;
  
  console.log ("today" + ", " + temp + ", " + humidity + ", " + windSpeed + ", " + icon + ", " + weather)
  $("#city-title").text("Weather Forecast for  " + userCity);
  
  
  console.log(currentWeatherImg);
  //city title
  
  
  //current description
  
  var currentWeatherImg = 'https://openweathermap.org/img/wn/'+icon+'@2x.png';
  $("#today-image").append($("<h4>").text(weather).attr("class", "text-center"));
  var iconImg = $("<img>");
  iconImg.attr('src', currentWeatherImg);
  iconImg.attr("class", "card-img");
  $("#today-image").append(iconImg);
  
  //Metrics
  $("#date").text(moment().format('LLLL')).css({"margin-top": "10px"});
  $("#temp").append($("<h2>").text(Math.round(temp) + " \u00B0C")).css({"margin-top": "20px"});
  $("#humidity").append($("<h5>").text("Humidity: " + Math.round(humidity) + " %"));
  $("#wind-speed").append($("<h5>").text("Wind speed: " + Math.round(windSpeed) + " m/s"));
  //call function to add uvi
  addUvIndex(uvi);
  }

function addUvIndex(uv_index) {
  //determine the level of uv index and add appropriate css colour class
  //levels from WHO
  //Low 1-2, green
  //Moderate: 3-5, yellow
  //High: 6-7, orange
  //V high: 8-10, red
  //Extreme: 11+, purple
  var uv_class = "";
  if(uv_index <= 2) {
    console.log("green");
    $("#uv-index").append($("<h5>").text("UV Index: " + Math.round(uv_index) + ", " + "low"));
  $("#uv-index").css({"background-color":"green"});
  } else if (uv_index > 2 && uv_index <= 5) {
    console.log("yellow");
    $("#uv-index").append($("<h5>").text("UV Index: " + Math.round(uv_index) + ", " + "Moderate"));
    $("#uv-index").css({"background-color":"yellow"});
  } else if (uv_index > 5 && uv_index <= 7) {
    console.log("orange");
    $("#uv-index").append($("<h5>").text("UV Index: " + Math.round(uv_index) + ", " + "High"));
    $("#uv-index").css({"background-color":"orange"});
  } else if (uv_index > 7 && uv_index <= 10) {
    console.log("red");
    $("#uv-index").append($("<h5>").text("UV Index: " + Math.round(uv_index) + ", " + "Very High"));
  $("#uv-index").css({"background-color":"red"});
  } else {
    console.log(purple);
    $("#uv-index").append($("<h5>").text("UV Index: " + Math.round(uv_index) + ", " + "Extreme"));
  $("#uv-index").css({"background-color":"purple"});
  }
  
  
  
}
//note: times are returned in UNIX format
function fiveDayForeCast(results){
  console.log("daily: " + results.daily.length)
  $("#fiveDayTitle").text("Five Day Outlook")
  $("#five-day").empty();
 for (i = 1; i < 6; i++) {
      var unixDate = results.daily[i].dt;
      var ts = new Date(unixDate*1000);
      console.log(ts.toDateString());
      console.log("index: " + i);
      console.log(results.daily[i].weather[0].icon);
      console.log(results.daily[i].weather[0].description);
      console.log(results.daily[i].temp.day);
      console.log(results.daily[i].wind_speed);
      console.log(results.daily[i].humidity);
  //select card group container
   
   var dailyCard = $("<div>"); //create card div 
   dailyCard.attr("class", "card");
  //daily icon   
  var icon = results.daily[i].weather[0].icon; 
  var dailyIcon = 'https://openweathermap.org/img/wn/'+icon+'@2x.png';
  var dailyImg = $("<img>").addClass("card-img-top");
  dailyImg.attr('src', dailyIcon);  
 
  //daily description
  var dailydescription = $("<p>").text(results.daily[i].weather[0].description);
  dailydescription.attr("class", "text-center");
  var dailyTemp = $("<p>").text("Temp: " + Math.round(results.daily[i].temp.day) + " \u00B0C");
  dailyTemp.attr("class", "text-center");
  var dailyHumidity = $("<p>").text("Humidity: " + Math.round(results.daily[i].wind_speed) + "%");
  dailyHumidity.attr("class", "text-center");
  var dailyWind = $("<p>").text("Wind: " + Math.round(results.daily[i].wind_speed) + "m/s");
  dailyWind.attr("class", "text-center");
    
  //date footer 
  var dailyFooter = $("<div>"); //create card div 
  dailyFooter.attr("class", "card-footer");
  var date = ts.toDateString();
  var dailyDate = $("<p>").text(date);
  dailyFooter.append(dailyDate);
  
  dailyCard.append(dailyImg, dailydescription, dailyTemp, dailyHumidity, dailyWind, dailyFooter);  
  $("#five-day").append(dailyCard);
  
  
  }
  storeCityName(userCity);
  renderCityHistory();
}

//remove hourly and minutely data
function oneCallApi(lat, lon) {
  //var apiKey = "6406ca836e96fe35d13d0645f945ad0b"; &exclude=minutely,hourly
  var queryURL2 = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=metric&appid=" + APIKey;
  $.ajax({
      url: queryURL2,
      method: "GET"
  }).then(function (results) {
    console.log("onecall");
    console.log(results);
    currentForecast(results);
    fiveDayForeCast(results);
  });
};


function storeCityName(cityName) {
//check to see if local storage exists 
  if(HistoryFlag === 1){
    //var cityHistory = JSON.parse(localStorage.getItem("storedCity"));
    var cityHistory = localStorage.getItem("storedCity");
    cityHistory = (cityHistory) ? JSON.parse(cityHistory) : [];
    console.log("inside stored City");


    //city history is limited to storing 8 cities
    if(cityHistory.length === 8){
      cityHistory.shift(); //removes first element
    }

    cityHistory.push(cityName);
    localStorage.setItem("storedCity", JSON.stringify(cityHistory));
    console.log(cityHistory);
  } else {
    /*History flag is used to skip storing city when the button click event originates from the history button*/
    HistoryFlag = 1;
  }
  console.log(HistoryFlag);
}

function renderCityHistory() {
  
  if(localStorage.getItem("storedCity") === null) {

    console.log(" Item does not exist in local storage");
    return
  } else {
    console.log(" Item exists in local storage");
    var cityHistory = JSON.parse(localStorage.getItem("storedCity"));
    $("#city-history").empty();
    for(i=0; i < cityHistory.length; i++) {
      var cityHistBtn = $("<button>");
      cityHistBtn.attr("type", "button");
      cityHistBtn.attr("class", "cityhist, btn, btn-secondary, btn-sm, btn-block, w-100");
      cityHistBtn.attr("id", cityHistory[i]);
      cityHistBtn.text(cityHistory[i]);
      $(cityHistBtn).css({"background-color": "#65ACAF", "margin-bottom": "10px", "padding": "5px"});
      $("#city-history").append(cityHistBtn);
    }

  }
  
  
}  