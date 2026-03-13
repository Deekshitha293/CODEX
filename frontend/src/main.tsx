import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Workbox } from 'workbox-window';
import App from './App';
import './index.css';
import { DataProvider } from './context/DataContext';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
socket.on('notification', (payload) => {
  console.log('Realtime alert:', payload.message);
});

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');
  wb.register();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <App />
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
