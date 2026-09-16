import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useFavorites } from "../../hooks/useFavorites";

export const FavoriteButton = ({ pokemonId }) => {
    const [showLimitMessage, setShowLimitMessage] = useState(false);
    const { isFavorite, toggleFavorite, isFull } = useFavorites();

    const favorite = isFavorite(pokemonId);

    const handleClick = () => {
        if (!favorite && isFull) {
            setShowLimitMessage(true);
            return;
        }

        toggleFavorite(pokemonId);
    };

    useEffect(() => {
        if (!showLimitMessage) return;

        const timeout = setTimeout(() => {
            setShowLimitMessage(false);
        }, 2500);

        return () => clearTimeout(timeout);
    }, [showLimitMessage]);

    return (
        <div>
            <button onClick={handleClick}>
                {favorite ? "Remove from favorites" : "Add to favorites"}
            </button>

            {showLimitMessage && (<p>Maximum of 6 favorites reached</p>)}
        </div>
        );
};

FavoriteButton.propTypes = {
    pokemonId: PropTypes.number.isRequired,
};