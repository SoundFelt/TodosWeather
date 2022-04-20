import React, {useState} from 'react'
import './App.css';
import Weather from './weather'
import Todo from './todo'

function App() {

  const [weatherImage, setWeatherImage] = useState()

  return (
    <div className="App">

    {weatherImage && <img className="background" src={`images/${weatherImage}`}></img>}
    
      <div className="background-container">   
        <Todo/>
        <Weather setWeatherImage={setWeatherImage}/>
      </div>

    </div>
  );
}

export default App;
