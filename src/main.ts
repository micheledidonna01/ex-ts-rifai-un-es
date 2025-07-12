type Destination = {
  activities: [string, string, string],
  best_time_to_visit: string,
  continent:
  | "Africa"
  | "Asia"
  | "Europa"
  | "America del Nord"
  | "America del Sud"
  | "Oceania"
  | "Antartide",
  country: string,
  currency: string,
  description: string,
  readonly id: number,
  image: string,
  language: string,
  population: string,
  top_attractions: [string, string, string, string]
}

type Weathers = {
  readonly id: number,
  name : string,
  temperature: number,
  weather_description: string,
  humidity: number,
  wind_speed: number,
  pressure: number,
  visibility: number
}

type Location = {
  city: string,
  country: string,
  latitude: number,
  longitude: number
}

function isLocation(locat: Location): boolean{
  if(
    typeof locat === "object" &&
    locat !== null &&
    "city" in locat &&
    typeof locat.city === "string" &&
    "country" in locat &&
    typeof locat.country === "string" &&
    "latitude" in locat &&
    typeof locat.latitude === "number" &&
    "longitude" in locat &&
    typeof locat.longitude === "number" 
  ){
    return true
  }else{
    return false
  }
}

type Airport = {
  readonly id: number,
  name: string,
  iata_code: string,
  icao_code: string,
  location: Location
  timezone: string,
  terminals: number
}

function isAirport(airport: Airport[]) : boolean{
  if (
    airport.filter((a) => {
      if (
        typeof a === "object" &&
        a !== null &&
        "id" in a &&
        typeof a.id === "number" &&
        "name" in a &&
        typeof a.name === "string" &&
        "iata_code" in a &&
        typeof a.iata_code === "string" && a.iata_code.length === 3 &&
        "icao_code" in a &&
        typeof a.icao_code === "string" && a.icao_code.length === 4 &&
        "wind_spped" in a &&
        typeof a.location === "object" && a.location !== null && 
        "pressure" in a &&
        typeof a.pressure === "number" && isLocation(a.location) &&
        "timezone" in a &&
        typeof a.timezone === "string" &&
        "terminals" in a &&
        typeof a.terminals === "number"
      ) {
        return true;
      }

      return false;
    })

  ) {
    return true;
  } else {
    return false;
  }

}

function isWeather(weather: Weathers[]) : boolean{
  if (
    weather.filter((w) => {
      if (
        typeof w === "object" &&
        w !== null &&
        "id" in w &&
        typeof w.id === "number" &&
        "name" in w &&
        typeof w.name === "string" &&
        "weather_description" in w &&
        typeof w.weather_description === "string" &&
        "humidity" in w &&
        typeof w.humidity === "number" &&
        "wind_spped" in w &&
        typeof w.wind_spped === "number" &&
        "pressure" in w &&
        typeof w.pressure === "number" &&
        "visibility" in w &&
        typeof w.visibility === "number" 
      ) {
        return true;
      }

      return false;
    })

  ) {
    return true;
  } else {
    return false;
  }
}

function isDestionation(destinations: Destination[]): boolean {
  if (
    destinations.filter((destination) => {
      if (
        typeof destination === "object" &&
        destination !== null &&
        "activities" in destination &&
        Array.isArray(destination.activities) && destination.activities.length === 3 &&
        "best_time_to_visit" in destination &&
        typeof destination.best_time_to_visit === "string" &&
        "continent" in destination &&
        typeof destination.continent === "string" &&
        "country" in destination &&
        typeof destination.country === "string" &&
        "currency" in destination &&
        typeof destination.currency === "string" &&
        "description" in destination &&
        typeof destination.description === "string" &&
        "id" in destination &&
        typeof destination.id === "number" &&
        "image" in destination &&
        typeof destination.image === "string" &&
        "language" in destination &&
        typeof destination.language === "string" &&
        "population" in destination &&
        typeof destination.population === "string" &&
        "top_attractions" in destination &&
        Array.isArray(destination.top_attractions) && destination.top_attractions.length === 4

      ) {
        return true;
      }

      return false;
    })

  ) {
    return true;
  } else {
    return false;
  }
}



async function getDashboardData<T>(url:string ,query: string): Promise<T[] | null> {

  try {
   
    const promise = await fetch(`http://localhost:3333/${url}?search=${query}`);
    
    if (!promise.ok) {
      throw new Error(promise.status + ":" + promise.statusText)
    }

    const array = await promise.json();

    if(url === "destinations"){
      if (!isDestionation(array)) {
        throw new Error('Errore')
      }
    }

    if(url === "weathers"){
      if (!isWeather(array)){
        throw new Error('Errore')
      }
    }

    if(url === "airports"){
      if (!isAirport(array)){
        throw new Error('Errore')
      }
    }

    
    console.log(array);
    return array

  } catch (error) {

    console.error(error);
    return null;
  }
}


(async() => {
  const promiseDestinations = getDashboardData<Destination>("destinations", "London");
  const promiseWeathers = getDashboardData<Weathers>("weathers","London");
  const promiseAirports = getDashboardData<Airport>("airports","London");

  const results = await Promise.allSettled([promiseAirports, promiseDestinations, promiseWeathers]);
  const [airportsResult, destinationsResult, weathersResult] = results;

  if (
    results[0].status === "fulfilled" &&
    results[1].status === "fulfilled" &&
    results[2].status === "fulfilled"
  ) {
    const resultAdvanced: {
      destination: Destination;
      weather: Weathers;
      airport: Airport;
    } = {
      destination: destinationsResult.value[0],
      weather: weathersResult.value[0],
      airport: airportsResult.value[0],
    };

    console.log(resultAdvanced);
  } else {
    console.error("Una o più promesse sono state rifiutate:", results);
  }
  } 



)();


