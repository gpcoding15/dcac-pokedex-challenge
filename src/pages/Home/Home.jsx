import { useGetPokemonsQuery } from "../../services/pokemonApi";
import { PokemonCard } from "../../components/PokemonCard/PokemonCard";

export const Home = () => {
    const { data } = useGetPokemonsQuery();

    return(
        <ul>
            {data?.results.map((pokemon) => <PokemonCard pokemon={pokemon} key={pokemon.name} />)}
        </ul>     

    ) 
 };