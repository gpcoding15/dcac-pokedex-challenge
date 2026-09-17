import {
    pokemonApi,
    getPokemonsNextPageParam,
    getPokemonsQueryUrl,
    getPokemonByIdQueryUrl,
    getPokemonsDataQueryUrl,
    getTypesQueryUrl,
    getPokemonByTypeQueryUrl,
    getGenerationsQueryUrl,
    getGenerationByIdQueryUrl,
} from "./pokemonApi";

describe("pokemonApi", () => {
    it("should use pokemonApi as its reducer path", () => {
        expect(pokemonApi.reducerPath).toBe("pokemonApi");
    });

    describe("getPokemonsNextPageParam", () => {
        it("should return undefined when the last page has no next url", () => {
            const lastPage = { next: null };

            const nextPageParam = getPokemonsNextPageParam(lastPage);

            expect(nextPageParam).toBeUndefined();
        });

        it("should return the offset from the next page url", () => {
            const lastPage = { next: "https://pokeapi.co/api/v2/pokemon?offset=40&limit=20" };

            const nextPageParam = getPokemonsNextPageParam(lastPage);

            expect(nextPageParam).toBe(40);
        });
    });

    describe("query url builders", () => {
        it("should build the paginated pokemon list url from the page param", () => {
            const url = getPokemonsQueryUrl({ pageParam: 20 });

            expect(url).toBe("pokemon?offset=20&limit=20");
        });

        it("should build the pokemon detail url from the given id", () => {
            const url = getPokemonByIdQueryUrl(25);

            expect(url).toBe("pokemon/25");
        });

        it("should build the full pokemon list url", () => {
            const url = getPokemonsDataQueryUrl();

            expect(url).toBe("pokemon?limit=2000");
        });

        it("should build the types list url", () => {
            const url = getTypesQueryUrl();

            expect(url).toBe("type");
        });

        it("should build the pokemon-by-type url from the given type", () => {
            const url = getPokemonByTypeQueryUrl("fire");

            expect(url).toBe("type/fire");
        });

        it("should build the generations list url", () => {
            const url = getGenerationsQueryUrl();

            expect(url).toBe("generation");
        });

        it("should build the generation detail url from the given id", () => {
            const url = getGenerationByIdQueryUrl(1);

            expect(url).toBe("generation/1");
        });
    });
});
