// src/store/rootReducer.jsx
import { combineReducers } from '@reduxjs/toolkit';
import busesReducer from './slices/busesSlice';
import companiesReducer from './slices/companiesSlice';
import userReducer from './slices/userSlice';
import ticketsReducer from './slices/ticketsSlice';

const rootReducer = combineReducers({
  buses: busesReducer,
  companies: companiesReducer,
  user: userReducer,
  tickets: ticketsReducer,
});

export default rootReducer;
