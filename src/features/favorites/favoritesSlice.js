import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pokemonIds: []
};

export const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        addFavorite: (state, action) => {
            if (state.pokemonIds.length < 6 && !state.pokemonIds.includes(action.payload)) {
                state.pokemonIds.push(action.payload);
            };
        },

        removeFavorite: (state, action) => {
            state.pokemonIds = state.pokemonIds.filter((id) => id !== action.payload);
        },
    }
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;