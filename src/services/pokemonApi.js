import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getPokemonsNextPageParam = (lastPage) => {
    if (!lastPage.next) {
        return undefined;
    }

    const nextUrl = new URL(lastPage.next);
    return Number(nextUrl.searchParams.get("offset"));
};

export const getPokemonsQueryUrl = ({ pageParam }) =>
    `pokemon?offset=${pageParam}&limit=20`;

export const getPokemonByIdQueryUrl = (id) => `pokemon/${id}`;

export const getPokemonsDataQueryUrl = () => "pokemon?limit=2000";

export const getTypesQueryUrl = () => "type";

export const getPokemonByTypeQueryUrl = (type) => `type/${type}`;

export const getGenerationsQueryUrl = () => "generation";

export const getGenerationByIdQueryUrl = (id) => `generation/${id}`;

export const pokemonApi = createApi({
    reducerPath: "pokemonApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "https://pokeapi.co/api/v2/",
    }),

    keepUnusedDataFor: 60,

    refetchOnReconnect: true,

    tagTypes: ["Pokemon", "Type", "Generation"],

    endpoints: (builder) => ({
        getPokemons: builder.infiniteQuery({
            infiniteQueryOptions: {
                initialPageParam: 0,
                getNextPageParam: getPokemonsNextPageParam,
            },

            query: getPokemonsQueryUrl,

            providesTags: [{ type: "Pokemon", id: "LIST" }]
        }),
        getPokemonById: builder.query({
            query: getPokemonByIdQueryUrl,
            providesTags: (result, error, id) => [{ type: "Pokemon", id }]
        }),
        getPokemonsData: builder.query({
            query: getPokemonsDataQueryUrl,
            providesTags: [{ type: "Pokemon", id: "LIST" }]
        }),
        getTypes: builder.query({
            query: getTypesQueryUrl,
            providesTags: ["Type"]
        }),

        getPokemonByType: builder.query({
            query: getPokemonByTypeQueryUrl,
            providesTags: ["Type"]
        }),

        getGenerations: builder.query({
            query: getGenerationsQueryUrl,
            providesTags: ["Generation"]
        }),

        getGenerationById: builder.query({
            query: getGenerationByIdQueryUrl,
            providesTags: ["Generation"]
        })
    })
});

export const {
    useGetPokemonsInfiniteQuery,
    useGetPokemonByIdQuery,
    useGetPokemonsDataQuery,
    useGetTypesQuery,
    useGetPokemonByTypeQuery,
    useGetGenerationsQuery,
    useGetGenerationByIdQuery
} = pokemonApi;
