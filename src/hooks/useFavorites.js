import { useDispatch, useSelector } from "react-redux";
import {
    addFavorite,
    removeFavorite,
} from "../features/favorites/favoritesSlice";

export const useFavorites = () => {
    const dispatch = useDispatch();

    const favoriteIds = useSelector(
        (state) => state.favorites.pokemonIds
    );

    const isFull = favoriteIds.length >= 6;

    const isFavorite = (pokemonId) => {
        return favoriteIds.includes(pokemonId);
    };

    const toggleFavorite = (pokemonId) => {
        if (isFavorite(pokemonId)) {
            dispatch(removeFavorite(pokemonId));
            return;
        }
        if (isFull) {
            return;
        }
        dispatch(addFavorite(pokemonId));
    };

    return { favoriteIds, isFavorite, toggleFavorite, isFull };
};