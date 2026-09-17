import { configureStore } from "@reduxjs/toolkit";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import favoritesReducer, { addFavorite } from "../features/favorites/favoritesSlice";
import { useFavorites } from "./useFavorites";

const renderUseFavorites = (preloadedPokemonIds = []) => {
    const store = configureStore({
        reducer: { favorites: favoritesReducer },
        preloadedState: { favorites: { pokemonIds: preloadedPokemonIds } },
    });
    jest.spyOn(store, "dispatch");

    const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

    return { ...renderHook(() => useFavorites(), { wrapper }), store };
};

describe("useFavorites", () => {
    it("should report a pokemon as favorite when its id is already in the store", () => {
        const { result } = renderUseFavorites([25]);

        expect(result.current.isFavorite(25)).toBe(true);
    });

    it("should add a pokemon id when toggling a pokemon that is not yet a favorite", () => {
        const { result } = renderUseFavorites([]);

        act(() => {
            result.current.toggleFavorite(25);
        });

        expect(result.current.favoriteIds).toEqual([25]);
    });

    it("should remove a pokemon id when toggling a pokemon that is already a favorite", () => {
        const { result } = renderUseFavorites([25]);

        act(() => {
            result.current.toggleFavorite(25);
        });

        expect(result.current.favoriteIds).toEqual([]);
    });

    it("should report isFull as true once there are already 6 favorites", () => {
        const { result } = renderUseFavorites([1, 2, 3, 4, 5, 6]);

        expect(result.current.isFull).toBe(true);
    });

    it("should not add a new pokemon id when the favorites list is already full", () => {
        const { result } = renderUseFavorites([1, 2, 3, 4, 5, 6]);

        act(() => {
            result.current.toggleFavorite(7);
        });

        expect(result.current.favoriteIds).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should not even dispatch addFavorite when the favorites list is already full", () => {
        const { result, store } = renderUseFavorites([1, 2, 3, 4, 5, 6]);

        act(() => {
            result.current.toggleFavorite(7);
        });

        expect(store.dispatch).not.toHaveBeenCalledWith(addFavorite(7));
    });
});
