import { useState } from "react";
import { Formik, Form } from "formik";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { useGetPokemonsDataQuery, useGetPokemonByIdQuery } from "../../services/pokemonApi";
import { PokemonSelector } from "../../components/PokemonSelector/PokemonSelector";
import { ComparisonCard } from "../../components/ComparisonCard/ComparisonCard";
import styles from "./Compare.module.css";
import { comparisonSchema } from "./comparisonSchema";
import { buildStatsChartData } from "./buildStatsChartData";

const POKEMON1_COLOR = "#e3350d";
const POKEMON2_COLOR = "#6890f0";

export const Compare = () => {
    const [selectedPokemons, setSelectedPokemons] = useState({ pokemon1: "", pokemon2: ""});

    const { data: allPokemonData } = useGetPokemonsDataQuery();
    const pokemonNames = allPokemonData?.results.map((pokemon) => pokemon.name) ?? [];
    const { data: pokemon1Data, isLoading: isPokemon1Loading, error: pokemon1Error } = useGetPokemonByIdQuery(selectedPokemons.pokemon1,{ skip: !selectedPokemons.pokemon1});
    const { data: pokemon2Data, isLoading: isPokemon2Loading, error: pokemon2Error } = useGetPokemonByIdQuery(selectedPokemons.pokemon2, { skip: !selectedPokemons.pokemon2});

    const chartData =
        pokemon1Data && pokemon2Data
            ? buildStatsChartData(pokemon1Data, pokemon2Data)
            : [];

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Compare Pokémon</h1>

            <Formik
                initialValues={{ pokemon1: "", pokemon2: ""}}
                validationSchema={comparisonSchema}
                onSubmit={(values) => setSelectedPokemons(values)}
            >
                <Form className={styles.form}>
                    <PokemonSelector name="pokemon1" label="First Pokémon" options={pokemonNames} />
                    <PokemonSelector name="pokemon2" label="Second Pokémon" options={pokemonNames} />

                    <button type="submit" className={styles.submitButton}>
                        Compare
                    </button>
                </Form>
            </Formik>

            {(isPokemon1Loading || isPokemon2Loading) && (<p className={styles.loadingText}>Loading comparison...</p>)}
            {pokemon1Error && (
                <p className={styles.notFound}>
                    Couldn&apos;t find &quot;{selectedPokemons.pokemon1}&quot;. Please pick a Pokémon from the suggestions.
                </p>
            )}
            {pokemon2Error && (
                <p className={styles.notFound}>
                    Couldn&apos;t find &quot;{selectedPokemons.pokemon2}&quot;. Please pick a Pokémon from the suggestions.
                </p>
            )}
            {pokemon1Data && pokemon2Data && (
                <>
                    <div className={styles.comparison}>
                        <ComparisonCard pokemon={pokemon1Data} accentColor={POKEMON1_COLOR}/>
                        <ComparisonCard pokemon={pokemon2Data} accentColor={POKEMON2_COLOR}/>
                    </div>

                    <div className={styles.chart}>
                        <h2>Stats Comparison</h2>
                        <p className={styles.chartCaption}>Base stats, 0–255</p>

                        <ResponsiveContainer width="100%" height={400}>
                            <RadarChart data={chartData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="stat" />
                                <PolarRadiusAxis domain={[0, 255]} />

                                <Radar
                                    name={pokemon1Data.name}
                                    dataKey="pokemon1"
                                    stroke={POKEMON1_COLOR}
                                    fill={POKEMON1_COLOR}
                                    fillOpacity={0.3}
                                />

                                <Radar
                                    name={pokemon2Data.name}
                                    dataKey="pokemon2"
                                    stroke={POKEMON2_COLOR}
                                    fill={POKEMON2_COLOR}
                                    fillOpacity={0.3}
                                />

                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </>
)           }
        </main>
    );
};