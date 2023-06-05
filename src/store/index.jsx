import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';
import pagesReducer from './slices/pagesSlice';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';

const localPersistConfig = {
    key: import.meta.env.VITE_REDUX_PERSIST_LOCAL_STORAGE_KEY,
    storage,
    whitelist: ['books', 'pages']
};

const seesionPeristConfig = {
    key: import.meta.env.VITE_REDUX_PERSIST_SESSION_STORAGE_KEY,
    storage: sessionStorage
};

const rootReducer = combineReducers({
    auth: persistReducer(seesionPeristConfig, authReducer),
    books: booksReducer,
    pages: pagesReducer
});

const persistedReducer = persistReducer(localPersistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
});

export const persistor = persistStore(store);
