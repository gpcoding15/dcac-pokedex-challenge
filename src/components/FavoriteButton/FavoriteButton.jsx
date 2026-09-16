import PropTypes from "prop-types";
import { useFavorites } from "../../hooks/useFavorites";

export const FavoriteButton = ({ pokemonId }) => {
    const { isFavorite, toggleFavorite, isFull } = useFavorites();

    const favorite = isFavorite(pokemonId);

    return (
        <div>
            <button onClick={() => toggleFavorite(pokemonId)}>
                {favorite ? "Remove from favorites" : "Add to favorites"}
            </button>

            {isFull && !favorite && (<p>Maximum of 6 favorites reached</p>)}
        </div>
        );
};

FavoriteButton.propTypes = {
    pokemonId: PropTypes.number.isRequired,
};