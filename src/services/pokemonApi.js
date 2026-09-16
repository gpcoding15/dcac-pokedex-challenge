import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokemonApi = createApi({
    reducerPath: "pokemonApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://pokeapi.co/api/v2/",
    }),

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
        }),
        getPokemonById: builder.query({
            query: (id) => `pokemon/${id}`
        })
    }),
});

export const { useGetPokemonsInfiniteQuery, useGetPokemonByIdQuery } = pokemonApi;