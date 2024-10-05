import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // PersistGate component
import { store, persistor } from './redux/store'; // Import the persistor and store
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
  </PersistGate>
</Provider>,
);
