import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import App from './App';
=======
import { HashRouter } from 'react-router-dom';
import App from './App';
import { GlobalProvider } from './context/GlobalContext';
import './index.css';
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <App />
=======
    <GlobalProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </GlobalProvider>
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
  </React.StrictMode>
);