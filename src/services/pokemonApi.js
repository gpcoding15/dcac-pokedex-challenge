import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokemonApi = createApi({
    reducerPath: "pokemonApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://pokeapi.co/api/v2/",
    }),

    endpoints: (builder) => ({
        getPokemons: builder.query({
            query: () => "pokemon"
        }),
        getPokemonById: builder.query({
            query: (id) => `pokemon/${id}`
        })
    }),
});

export const { useGetPokemonsQuery, useGetPokemonByIdQuery } = pokemonApi;