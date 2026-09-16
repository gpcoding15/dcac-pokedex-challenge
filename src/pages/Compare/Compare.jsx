import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useGetPokemonsDataQuery, useGetPokemonByIdQuery } from "../../services/pokemonApi";
import { PokemonSelector } from "../../components/PokemonSelector/PokemonSelector";
import { ComparisonCard } from "../../components/ComparisonCard/ComparisonCard";
import styles from "./Compare.module.css";

const comparisonSchema = Yup.object({
    pokemon1: Yup.string().required("Select the first Pokémon"),

    pokemon2: Yup.string().required("Select the second Pokémon").notOneOf([Yup.ref("pokemon1")], "Choose two different Pokémon")
});

export const Compare = () => {
    const [selectedPokemons, setSelectedPokemons] = useState({ pokemon1: "", pokemon2: ""});

    const { data: allPokemonData } = useGetPokemonsDataQuery();
    const { data: pokemon1Data, isLoading: isPokemon1Loading} = useGetPokemonByIdQuery(selectedPokemons.pokemon1,{ skip: !selectedPokemons.pokemon1});
    const { data: pokemon2Data, isLoading: isPokemon2Loading,} = useGetPokemonByIdQuery(selectedPokemons.pokemon2, { skip: !selectedPokemons.pokemon2});

    return (
        <main className={styles.container}>
            <h1>Compare Pokémon</h1>

            <Formik
                initialValues={{ pokemon1: "", pokemon2: ""}}
                validationSchema={comparisonSchema}
                onSubmit={(values) => setSelectedPokemons(values)}
            >
                <Form className={styles.form}>
                    <PokemonSelector name="pokemon1" label="First Pokémon" />
                    <PokemonSelector name="pokemon2" label="Second Pokémon" />

                    <datalist id="pokemon-options">
                        {allPokemonData?.results.map((pokemon) => (
                            <option
                                key={pokemon.name}
                                value={pokemon.name}
                            />
                        ))}
                    </datalist>

                    <button type="submit">
                        Compare
                    </button>
                </Form>
            </Formik>

            {(isPokemon1Loading || isPokemon2Loading) && (<p>Loading comparison...</p>)}
            {pokemon1Data && pokemon2Data && (
                <div className={styles.comparison}>
                    <ComparisonCard pokemon={pokemon1Data}/>
                    <ComparisonCard pokemon={pokemon2Data}/>
                 </div>
            )}
        </main>
    );
};