import { useGetPokemonsQuery } from "../../services/pokemonApi";

export const Home = () => {
    const { data } = useGetPokemonsQuery();
    return(
        <ul>
            {data?.results.map((pokemon) => <li key={pokemon.name}>{pokemon.name}</li>)}
        </ul>     

    ) 
 };