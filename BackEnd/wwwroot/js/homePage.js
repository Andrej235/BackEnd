const day = new Date();
const timeTitle = document.querySelector("#time-title");
const dateTitle = document.querySelector("#date-title");

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
timeTitle.append(`${weekDays[day.getDay()]} :: ${day.getHours()}:${day.getMinutes()}`);

dateTitle.append(`${day.getDate()}.${day.getMonth()}.${day.getFullYear()}`);

const weatherForecast = document.querySelector("#weather-forecast");
const weatherIcon = document.querySelector(".weather-icon");
//UpdateWeatherInfo();
function UpdateWeatherInfo() {
    fetch("http://api.weatherapi.com/v1/current.json?key=6d1cf624235d482eadd195003232106&q=Belgrade&aqi=no")
        .then(res => res.json())
        .then(res => {
            console.log(res);
            weatherForecast.innerHTML = `${res.current.condition.text} :: ${res.current.feelslike_c}`;

            let icon = "";
            switch (res.current.condition.code) {
                case 1000:
                    icon = res.current.is_day === 1 ? "sun" : "moon"; //? Clear Skies
                    break;
                case 1003:
                    icon = res.current.is_day === 1 ? "cloud-sun" : "cloud-moon"; //? Partly Cloudy
                    break;
                case 1006:
                case 1009:
                    icon = "cloud"; //? Cloudy
                    break;
                case 1030:
                case 1135:
                case 1147:
                    icon = "smog"; //? Fog
                    break;
                case 1063:
                case 1180:
                case 1183:
                case 1186:
                case 1189:
                case 1192:
                case 1195:
                case 1198:
                case 1201:
                    icon = res.current.is_day === 1 ? "cloud-sun-rain" : "cloud-moon-rain"; //? Rain (7 kinds)
                    break;
                default:
                    icon = "empty";
                    break;
            }


            weatherIcon.classList.add("fa-solid");
            weatherIcon.classList.add(`fa-${icon}`);
        })
        .catch(err => console.error(err))
}