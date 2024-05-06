import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';

import './style/style.scss';

// Начиная с версии 18.0.0+ import ReactDOM from 'react-dom/client';
ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    // <React.StrictMode>
      <App />
    // </React.StrictMode>,
  );

  
// import ReactDOM from 'react-dom' версия <18.0.0
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

