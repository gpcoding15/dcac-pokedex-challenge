import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useGetPokemonByIdQuery } from "../../services/pokemonApi";
import { FavoriteButton } from "../FavoriteButton/FavoriteButton";

export const FavoritePokemon = ({ pokemonId }) => {
    const { data, isLoading, error } = useGetPokemonByIdQuery(pokemonId);

    if (isLoading) return <p>Loading Pokémon...</p>;
    if (error) return <p>Error loading Pokémon</p>;

    return (
        <div>
            <Link to={`/pokemon/${data.id}`}>
                <img
                    src={data.sprites.front_default}
                    alt={data.name}
                />

                <p>#{data.id}</p>
                <h2>{data.name}</h2>
            </Link>

            <FavoriteButton pokemonId={data.id} />
        </div>
    );
};

FavoritePokemon.propTypes = {
    pokemonId: PropTypes.number.isRequired,
};