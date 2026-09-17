import { store, persistor } from "./store";
import { pokemonApi } from "../services/pokemonApi";
import { addFavorite } from "../features/favorites/favoritesSlice";

describe("store", () => {
    it("should start with an empty favorites list", () => {
        const state = store.getState();

        expect(state.favorites.pokemonIds).toEqual([]);
    });

    it("should register the pokemonApi reducer under its reducer path", () => {
        const state = store.getState();

        expect(state[pokemonApi.reducerPath]).toBeDefined();
    });

    it("should update the favorites state when a favorite is dispatched", () => {
        store.dispatch(addFavorite(25));

        const state = store.getState();

        expect(state.favorites.pokemonIds).toContain(25);
    });

    it("should expose a persistor for redux-persist", () => {
        expect(persistor).toBeDefined();
        expect(typeof persistor.persist).toBe("function");
    });
});
