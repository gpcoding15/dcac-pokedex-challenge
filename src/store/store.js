import { configureStore,  combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { pokemonApi } from "../services/pokemonApi";
import favoritesReducer from "../features/favorites/favoritesSlice";

const rootReducer = combineReducers({
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    favorites: favoritesReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: [
        "favorites",
    ],
};

const persistedReducer = persistReducer(
    persistConfig,
    rootReducer
);

export const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(pokemonApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);