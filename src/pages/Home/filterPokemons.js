export const hasActiveSearchFilters = (search, selectedType, selectedGeneration) =>
    search.trim() !== "" || selectedType !== "" || selectedGeneration !== "";

export const filterPokemons = (
    pokemons,
    { search, selectedType, typePokemonNames, selectedGeneration, generationPokemonNames }
) =>
    pokemons.filter((pokemon) => {
        const matchesSearch =
            search.trim() === "" || pokemon.name.toLowerCase().includes(search.toLowerCase().trim());
        const matchesType = selectedType === "" || typePokemonNames.has(pokemon.name);
        const matchesGeneration = selectedGeneration === "" || generationPokemonNames.has(pokemon.name);

        return matchesSearch && matchesType && matchesGeneration;
    });
