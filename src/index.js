import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import BuildingSpinner from './components/BuildingSpinner';
import EnviornmentSpinner from './components/EnviornmentSpinner';

import Grid from './assets/images/grid-placeholder-2.png';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode  >
    {/* <BuildingSpinner/> */}
  <div className={'container'}>
    <img src={Grid} alt="grid" />
  </div>
  <EnviornmentSpinner/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
