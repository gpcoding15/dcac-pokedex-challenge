import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
    useGetPokemonsInfiniteQuery,
    useGetPokemonsDataQuery,
    useGetTypesQuery,
    useGetPokemonByTypeQuery,
    useGetGenerationsQuery,
    useGetGenerationByIdQuery
} from "../../services/pokemonApi";
import { PokemonCard } from "../../components/PokemonCard/PokemonCard";
import { useDebounce } from "../../hooks/useDebounce";

export const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const [selectedType, setSelectedType] = useState(searchParams.get("type") ?? "");
    const [selectedGeneration, setSelectedGeneration] = useState(searchParams.get("generation") ?? "");
    const loadMoreRef = useRef(null);
    const debouncedSearch = useDebounce(search, 300);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, } = useGetPokemonsInfiniteQuery();

    const { data: allPokemonsData } = useGetPokemonsDataQuery();
    const { data: typesData } = useGetTypesQuery();
    const { data: generationsData } = useGetGenerationsQuery();
    const { data: typeData } = useGetPokemonByTypeQuery(selectedType, { skip: !selectedType });
    const { data: generationData } = useGetGenerationByIdQuery(selectedGeneration, { skip: !selectedGeneration});

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

    useEffect(() => {
        const params = {};

        if(debouncedSearch.trim()) {
            params.search = debouncedSearch.trim();
        };

        if (selectedType) {
            params.type = selectedType;
        };

        if (selectedGeneration) {
            params.generation = selectedGeneration;
        };

        setSearchParams(params);
    }, [debouncedSearch, selectedType, selectedGeneration, setSearchParams])

    const typePokemonNames = new Set(typeData?.pokemon.map((type) => type.pokemon.name) ?? []);
    const generationPokemonNames = new Set (generationData?.pokemon_species.map((pokemon) => pokemon.name) ?? []);

    const hasActiveFilters = debouncedSearch.trim() !== "" || selectedType !== "" || selectedGeneration !== "";

    const filteredPokemons = hasActiveFilters ?
        allPokemonsData?.results.filter((pokemon) =>{
            const matchesSearch = debouncedSearch.trim() === "" || pokemon.name.toLowerCase().includes(debouncedSearch.toLowerCase().trim());
            const matchesType = selectedType === "" || typePokemonNames.has(pokemon.name);
            const matchesGeneration = selectedGeneration === "" || generationPokemonNames.has(pokemon.name);

            return matchesSearch && matchesType && matchesGeneration;
        }) ?? []: pokemons;


    return(
        <>
        <input type="search" placeholder="Search Pokemon" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
            <option value="">Types</option>
            {typesData?.results.map((type) => <option key={type.name} value={type.name}>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</option>)}
        </select>

        <select value={selectedGeneration} onChange={(event) => setSelectedGeneration(event.target.value)}>
            <option value="">Generations</option>
            {generationsData?.results.slice(0,9).map((generation, index) => <option key={generation.name} value={index + 1}>Generation {index + 1}</option>)}
        </select>
        <ul>
            {filteredPokemons.map((pokemon) => <PokemonCard pokemon={pokemon} key={pokemon.name} />)}
        </ul>
        {hasActiveFilters && (
            <div ref={loadMoreRef}>
                {isFetchingNextPage && <p>Loading more Pokemons...</p>}
            </div>
        )}
        </>

    ) 
 };