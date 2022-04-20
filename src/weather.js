import React, {useEffect, useState} from 'react'
import axios from 'axios'
import './weather.css'
import './App.css'

function Weather(props) {

    const handleChange = (e) => {
        setSearchField(e.target.value)
      }

    const [searchField, setSearchField] = useState()
    const [currentWeather, setCurrentWeather] = useState('')
    const [weatherData, setWeatherData] = useState()
    const [error, setError] = useState('')
    const [dateNth, setDateNth] = useState()
    const [timeZoneDateTime, setTimeZoneDateTime] = useState();
    const [loading, setLoading] = useState(false)

  const handleAPI = async (e) => {
    searchField && e.preventDefault()
    setSearchField('')
    setWeatherData([])
    setError('')
    setLoading(true)
    try {
    const searchedLocation = searchField ? searchField : 'London'
    const res = await axios.get(`https://api.weatherapi.com/v1/forecast.json?days=3&q=${searchedLocation}&key=d35efecee73346c29dc150445220903`);
    const location = res.data.location.name;
    const country = res.data.location.country;
    const originalDateTime = res.data.location.localtime
    const localTime = originalDateTime.slice(11)
    const monthNumber = originalDateTime.slice(5, 7)
    const dayOfMonthNumber = originalDateTime.slice(8, 10)
    const slicedDayOfMonthNumber = dayOfMonthNumber.startsWith('0') ? dayOfMonthNumber.slice(1) : dayOfMonthNumber;
    const fullDate = new Date(`2022-${monthNumber}-${dayOfMonthNumber}`);
    const currentMonth = fullDate.toLocaleDateString('en-US', {month: 'long'})
    const currentDay = fullDate.toLocaleDateString('en-US', {weekday: 'long'})
    setDateNth(findDateNth(slicedDayOfMonthNumber))
    setTimeZoneDateTime({currentDay, currentMonth, slicedDayOfMonthNumber, localTime})
      
    const tempNow = res.data.current.temp_c;
    const conditionNow = res.data.current.condition.text;
    const iconNow = res.data.current.condition.icon;
    setCurrentWeather({location, country, tempNow, conditionNow, iconNow})
    weatherImageFunc(conditionNow.toLowerCase())

    res.data.forecast.forecastday.map((el, idx) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      const dayTitle = idx === 0 ? 'Today' : idx === 1 && days.indexOf(currentDay) === 6 ? 'Monday' 
      : idx === 1 ? days[days.indexOf(currentDay) + 1] 
      : idx === 2 && days.indexOf(currentDay) === 6 ? 'Tuesday' 
      : idx === 2 && days.indexOf(currentDay) === 5 ? 'Monday' 
      : days[days.indexOf(currentDay) + 2]
      const averageTemp = el.day.avgtemp_c;
      const minTemp = el.day.mintemp_c;
      const maxTemp = el.day.maxtemp_c
      const condition = el.day.condition.text;
      const icon = el.day.condition.icon;
      return setWeatherData(oldarray => [...oldarray, {dayTitle, location, country, averageTemp, minTemp, maxTemp, condition, icon}])
  })

    } catch (e){
      setError('Location not found, please check your spelling.')
      console.log(e)
    }

    setLoading(false)
  }

  const findDateNth = function(currentDate) {
    if (currentDate > 3 && currentDate < 21) return 'th';
    switch (currentDate % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }

  const weatherImageFunc = function(condition) {
    const returnedCondition = condition.includes('sunny') ? 'sun.jpeg' 
    : condition.includes('cloud') ? 'cloudy.jpeg'
    : condition.includes('overcast') ? 'overcast.jpeg' 
    : (condition.includes('rain') || condition.includes('drizzle')) && !condition.includes('thunder') ? 'raining.jpeg'
    : (condition.includes('snow') || condition.includes('blizzard')) && !condition.includes('thunder') ? 'snowing.jpeg'
    : condition.includes('mist') || condition.includes('fog') ? 'fog:mist.jpeg'
    : condition.includes('sleet') || condition.includes('ice') ? 'hail.jpeg'
    : condition.includes('thunder') || condition.includes('thundery') ? 'thunder.jpeg' 
    : 'clearnight.jpeg'
    props.setWeatherImage(returnedCondition)
  }

  useEffect(() => {
    handleAPI()
  }, [])

  return (
    <div className="weather-container">

      <h1>Weather Forecast</h1>
      <form className="location-form" onSubmit={handleAPI}>
        <input autoFocus type="text" value={searchField} onChange={handleChange} name="search" placeholder="Enter your location"/>
        <button>Submit</button>
      </form>
    {timeZoneDateTime &&
    <div className="weather-information">
      <div className="weather-location-condition-info">
        <h4 className="location">{currentWeather.location}</h4>
        <h4 className="country">{currentWeather.country}</h4>
        <span className="date-time">{`${timeZoneDateTime.currentDay} ${timeZoneDateTime.currentMonth}
        ${timeZoneDateTime.slicedDayOfMonthNumber}${dateNth} - ${timeZoneDateTime.localTime}`}</span>
        <h4 className="temperature">{`${currentWeather.tempNow}°c`}</h4>        
        
        <div className="condition-icon">
          <span>{currentWeather.conditionNow}</span>
          <div className="weather-icon">
            <img src={`https://${currentWeather.iconNow}`} alt="''"></img>
          </div>
        </div>
      </div>

      <div className="forecast-separater"></div>
    </div>}

    {error && 
      <div>
        <h3 className="error">{error}</h3>
      </div>}

    {loading &&
      <div className="lds-ellipsis">
        <div></div><div></div>
        <div></div><div></div>
      </div>}

      <div className="forecast-container">
      {timeZoneDateTime &&  weatherData.map((day, idx) => (
          <div key={idx} className="day-container">
            <div className="top-row">
              
              <img className="forecast-icon" src={`https://${day.icon}`}></img>
            </div>
            <div className="bottom-row">
            <h5 className="forecast-day">{day.dayTitle}</h5>
              <h5 className="temp-range">{day.minTemp}°c / {day.maxTemp}°c</h5>
              
            </div>
          </div>
      ))}
    </div>

  </div>
  )
}

export default Weather