import { useEffect, useState } from 'react'
import axios from 'axios'

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
      <Country country={props.filteredCountries[0]}/>
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
      <h1>HERE</h1>
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
    </div>
  )
}

const App = () => {

  const [findValue, setFindValue] = useState("")
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  // initial api call -> get all countries
  useEffect(() => {
    // query api
    axios
    .get("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then(response => setCountries(response.data))
  }, [])

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
      <Result filteredCountries={filteredCountries} handleShowDetails={handleShowDetailsOf}/>
    </div>
  )
}

export default App