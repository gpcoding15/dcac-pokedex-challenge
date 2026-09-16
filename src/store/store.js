import { configureStore } from "@reduxjs/toolkit";
import { pokemonApi } from "../services/pokemonApi";
import favoritesReducer from "../features/favorites/favoritesSlice";

export const store = configureStore({
    reducer: {
        [pokemonApi.reducerPath]: pokemonApi.reducer,
        favorites: favoritesReducer
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware)
})