import React, { useState } from 'react';
import './App.css';
import ARThree from './ARThree';
import ARDisplay from './Components/ARDisplay';

function App() {
  const [started, setStarted] = useState(null);

  return (
    <div className="App">
      <h1>MindAR</h1>

      <div className="control-buttons">
        {/* {started === null && <button onClick={() => {setStarted('aframe')}}>Start AFRAME version</button>} */}
        {started === null && <button onClick={() => {setStarted('three')}}>Start ThreeJS version</button>}
        {started !== null && <button onClick={() => {setStarted(null)}}>Stop</button>}
      </div>

      {/* {started === 'aframe' && (
        <div className="container">
          <ARDisplay/>
          <video></video>
        </div>
      )} */}

      {started === 'three' && (
        <div className="container">
          <ARThree />
        </div>
      )}
    </div>
  );
}

export default App;
