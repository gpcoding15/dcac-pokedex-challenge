import { useEffect, useRef } from "react";
import { useGetPokemonsInfiniteQuery } from "../../services/pokemonApi";
import { PokemonCard } from "../../components/PokemonCard/PokemonCard";

export const Home = () => {
    const loadMoreRef = useRef(null);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, } = useGetPokemonsInfiniteQuery();

    const pokemons = data?.pages?.flatMap((page) => page.results) ?? [];

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const firstEntry = entries[0];

            if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            };
        });

        const currentRef = loadMoreRef.current;

        if(currentRef) {
            observer.observe(currentRef)
        };

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            };
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return(
        <>
        <ul>
            {pokemons.map((pokemon) => <PokemonCard pokemon={pokemon} key={pokemon.name} />)}
        </ul>
        <div ref={loadMoreRef}>
            {isFetchingNextPage && <p>Loading more Pokemons...</p>}
        </div>
        </>

    ) 
 };