import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useFavorites } from "../../hooks/useFavorites";
import styles from "./FavoriteButton.module.css";

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
        <div className={styles.wrapper}>
            <button
                type="button"
                onClick={handleClick}
                className={`${styles.button} ${favorite ? styles.active : ""}`}
            >
                <span className={styles.heart} aria-hidden="true">{favorite ? "♥" : "♡"}</span>
                {favorite ? "Remove from favorites" : "Add to favorites"}
            </button>

            {showLimitMessage && (<p className={styles.limitMessage}>Maximum of 6 favorites reached</p>)}
        </div>
        );
};

FavoriteButton.propTypes = {
    pokemonId: PropTypes.number.isRequired,
};
