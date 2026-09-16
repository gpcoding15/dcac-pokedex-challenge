import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useGetPokemonByIdQuery } from "../../services/pokemonApi";
import { FavoriteButton } from "../FavoriteButton/FavoriteButton";
import styles from "./FavoritePokemon.module.css";

export const FavoritePokemon = ({ pokemonId }) => {
    const { data, isLoading, error } = useGetPokemonByIdQuery(pokemonId);

    if (isLoading) return <div className={styles.card}><p>Loading Pokémon...</p></div>;
    if (error) return <div className={styles.card}><p>Error loading Pokémon</p></div>;

    return (
        <div className={styles.card}>
            <Link to={`/pokemon/${data.id}`} className={styles.link}>
                <p className={styles.number}>#{data.id}</p>
                <img
                    src={data.sprites.front_default}
                    alt={data.name}
                    className={styles.image}
                />

                <h2 className={styles.name}>{data.name}</h2>
            </Link>

            <FavoriteButton pokemonId={data.id} />
        </div>
    );
};

FavoritePokemon.propTypes = {
    pokemonId: PropTypes.number.isRequired,
};
