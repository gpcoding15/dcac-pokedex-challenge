import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

                getNextPageParam: (lastPage) => {
                    if (!lastPage.next) {
                        return undefined;
                    }

                    const nextUrl = new URL(lastPage.next);
                    return Number(nextUrl.searchParams.get("offset"));
                },
            },

            query: ({ pageParam }) =>
                `pokemon?offset=${pageParam}&limit=20`,

            providesTags: [{ type: "Pokemon", id: "LIST" }]
        }),
        getPokemonById: builder.query({
            query: (id) => `pokemon/${id}`,
            providesTags: (result, error, id) => [{ type: "Pokemon", id }]
        }),
        getPokemonsData: builder.query({
            query: () => "pokemon?limit=2000",
            providesTags: [{ type: "Pokemon", id: "LIST" }]
        }),
        getTypes: builder.query({
            query: () => "type",
            providesTags: ["Type"]
        }),

        getPokemonByType: builder.query({
            query: (type) => `type/${type}`,
            providesTags: ["Type"]
        }),

        getGenerations: builder.query({
            query: () => "generation",
            providesTags: ["Generation"]
        }),

        getGenerationById: builder.query({
            query: (id) => `generation/${id}`,
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