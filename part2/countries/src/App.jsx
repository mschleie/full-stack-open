import { useEffect, useState } from 'react'
import axios from 'axios'

// weather codes as json file from https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
import codes from './descriptions.json'

const Search = (props) => {
  return (
    <p>
      find countries <input value={props.findValue} onChange={props.handleFindChange}/>
    </p>
  )
}

const Result = (props) => {

  console.log("Filtered Length", props.filteredCountries.length)

  if (props.filteredCountries.length > 10) {
    console.log("Too many")
    // too many results
    return (
      <p>Too many matches, speficy another filter</p>
    )
  } else if (props.filteredCountries.length == 1) {
    console.log("Details")
    // detailed information if only one country is found
    return (
      <Country country={props.filteredCountries[0]} weather={props.weather}/>
    )
  } else {
    // show filtered countries
    console.log("Countrylist")
    return (
      <CountryList countryList={props.filteredCountries} handleShowDetails={props.handleShowDetails}/>
    )
  }
}

const CountryList = (props) => {
  console.log(props.countryList)

  return (
    <div>
      <ul>
        {props.countryList.map(country => <li key={country.ccn3}>{country.name.common} <button onClick={() => props.handleShowDetails(country.ccn3)}>show</button></li>)}
      </ul>
    </div>
  )
}

const Country = (props) => {
  // map cannot be done on Object properties like country.languages
  // here we need to convert languages at first to array of key value arrays
  const languages = Object.entries(props.country.languages)
  console.log(languages)
  return (
    <div>
      <h1>{props.country.name.common}</h1>
      <p>Capital {props.country.capital[0]}</p>
      <p>Area {props.country.area}</p>
      <h2>Languages</h2>
      <ul>
        {languages.map(([key, value]) => <li key={key}>{value}</li>)}
      </ul>
      <div>
        <img src={props.country.flags["png"]}></img>
      </div>
      <Weather capital={props.country.capital[0]} weather={props.weather}/>
    </div>
  )
}

const Weather = (props) => {
  console.log("Weather", props.weather)
  // do not render weather component if api response is not yet available
  if (!props.weather) {
    return (
      <div></div>
    )
  }
  // get image of weather code (WMO Code)
  console.log("Codes", codes)
  const imageUrl = codes[props.weather.current.weather_code]["day"]["image"]
  console.log(props.weather.current.weather_code)
  console.log(imageUrl)

  // if weather data is availabe, render weather of capital
  return (
    <div>
      <h2>Weather in {props.capital}</h2>
      <p>Temperature {props.weather.current.temperature_2m} {props.weather.current_units.temperature_2m}</p>
      <img src={imageUrl}></img>
      <p>Wind {props.weather.current.wind_speed_10m} {props.weather.current_units.wind_speed_10m}</p>
    </div>
  )
}
/*
      <p>Temperature {props.weather.current.temperature_2m}°</p>
      <p>Wind {props.weather.current.wind_speed_10m}</p>
*/

const App = () => {

  const [findValue, setFindValue] = useState("")
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [weather, setWeather] = useState(null)

  // initial api call -> get all countries
  useEffect(() => {
    // query api
    axios
    .get("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then(response => setCountries(response.data))
  }, [])

  // get weather data only if filteredCountries contains 1 element
  useEffect(() => {
    if (filteredCountries.length === 1) {
      // get data from https://open-meteo.com/ without API Key necessary
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${filteredCountries[0].latlng[0]}&longitude=${filteredCountries[0].latlng[1]}&current=temperature_2m,wind_speed_10m,weather_code`
      
      axios
        .get(url)
        .then(response => setWeather(response.data))
        .catch(error => console.log(error))
    } else {
      setWeather(null)
    }
  }, [filteredCountries])

  const handleFindChange = (event) => {
    // update find input
    console.log(event.target.value)
    const val = event.target.value
    setFindValue(val)
    // also filter countries
    const filtered = val === "" ? countries : countries.filter(country => country.name.common.toLowerCase().includes(val.toLowerCase()))
    setFilteredCountries(filtered)
  }

  const handleShowDetailsOf = (ccn3) => {
    setFilteredCountries(countries.filter(country => country.ccn3 === ccn3))
  }

  return (
    <div>
      <Search findValue={findValue} handleFindChange={handleFindChange}/>
      <Result filteredCountries={filteredCountries} handleShowDetails={handleShowDetailsOf} weather={weather}/>
    </div>
  )
}

export default App