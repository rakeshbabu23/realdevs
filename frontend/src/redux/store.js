import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux"; // Import combineReducers

import userReducer from "./../features/user/userSlice";
import portfolioReducer from "./../features/portfolios/portfolioSlice";
import projectSlice from "./../features/projects/projectSlice";
import groupSlice from "./../features/groups/groupSlice";

// Persist configuration
const persistConfig = {
  key: "root", // Key for the persisted data
  storage, // Storage engine
};

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  user: userReducer,
  portfolio: portfolioReducer,
  project: projectSlice,
  group: groupSlice,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor }; // Export both store and persistor
