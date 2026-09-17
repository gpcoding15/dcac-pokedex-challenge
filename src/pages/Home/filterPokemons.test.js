import { hasActiveSearchFilters, filterPokemons } from "./filterPokemons";

describe("hasActiveSearchFilters", () => {
    it("should be false when search, type and generation are all empty", () => {
        expect(hasActiveSearchFilters("", "", "")).toBe(false);
    });

    it("should be false when the search is only whitespace", () => {
        expect(hasActiveSearchFilters("   ", "", "")).toBe(false);
    });

    it("should be true when there is a non-empty search", () => {
        expect(hasActiveSearchFilters("pika", "", "")).toBe(true);
    });

    it("should be true when a type is selected", () => {
        expect(hasActiveSearchFilters("", "electric", "")).toBe(true);
    });

    it("should be true when a generation is selected", () => {
        expect(hasActiveSearchFilters("", "", "1")).toBe(true);
    });
});

describe("filterPokemons", () => {
    const pokemons = [{ name: "pikachu" }, { name: "bulbasaur" }, { name: "charmander" }];

    const noFilters = {
        search: "",
        selectedType: "",
        typePokemonNames: new Set(),
        selectedGeneration: "",
        generationPokemonNames: new Set(),
    };

    it("should match pokemon whose name includes the search text", () => {
        const result = filterPokemons(pokemons, { ...noFilters, search: "pika" });

        expect(result.map((pokemon) => pokemon.name)).toEqual(["pikachu"]);
    });

    it("should ignore case and surrounding whitespace in the search", () => {
        const result = filterPokemons(pokemons, { ...noFilters, search: "  PIKA  " });

        expect(result.map((pokemon) => pokemon.name)).toEqual(["pikachu"]);
    });

    it("should only keep pokemon present in typePokemonNames when a type is selected", () => {
        const result = filterPokemons(pokemons, {
            ...noFilters,
            selectedType: "electric",
            typePokemonNames: new Set(["pikachu"]),
        });

        expect(result.map((pokemon) => pokemon.name)).toEqual(["pikachu"]);
    });

    it("should only keep pokemon present in generationPokemonNames when a generation is selected", () => {
        const result = filterPokemons(pokemons, {
            ...noFilters,
            selectedGeneration: "1",
            generationPokemonNames: new Set(["bulbasaur", "charmander"]),
        });

        expect(result.map((pokemon) => pokemon.name)).toEqual(["bulbasaur", "charmander"]);
    });

    it("should require every active filter to match at the same time", () => {
        const result = filterPokemons(pokemons, {
            ...noFilters,
            search: "char",
            selectedGeneration: "1",
            generationPokemonNames: new Set(["bulbasaur", "charmander"]),
        });

        expect(result.map((pokemon) => pokemon.name)).toEqual(["charmander"]);
    });

    it("should return every pokemon when no filter is active", () => {
        const result = filterPokemons(pokemons, noFilters);

        expect(result).toHaveLength(3);
    });
});
