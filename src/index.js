import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// Paleta de colores principal
const theme = {
  token: {
    colorPrimary: '#004d7a',   // color principal
    colorSuccess: '#20bf55',   // color de éxito
    colorWarning: '#f7971e',   // color de warning
    colorError: '#ff4d4f',     // color de error
    // ... etc.
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider theme={theme}>
    <App />
  </ConfigProvider>
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
