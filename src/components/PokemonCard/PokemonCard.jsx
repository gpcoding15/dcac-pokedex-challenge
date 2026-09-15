import PropTypes from 'prop-types';
import { useGetPokemonByIdQuery } from '../../services/pokemonApi';

export const PokemonCard = ({pokemon}) => {
    const id = pokemon.url.split("/").filter(Boolean).pop()
    const { data, isLoading, error } = useGetPokemonByIdQuery(id)

    if (isLoading) return <p>Loading data</p>
    if (error) return <p>Error loading Pokemon</p>

    return (
        <li>
            <p>{data.id}</p>
            Name: {pokemon.name}
            <img src={data?.sprites?.front_default} alt={pokemon.name}/>
            {data?.types.map((t) => (
                <span key={t.type.name}>{t.type.name}</span>
            ))}
        </li>
    )
};

PokemonCard.propTypes = {
    pokemon: PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
    }).isRequired,
};
