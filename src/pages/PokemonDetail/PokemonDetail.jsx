import { useParams } from "react-router-dom";
import { useGetPokemonByIdQuery } from "../../services/pokemonApi";
import styles from "./PokemonDetail.module.css";

export const PokemonDetail = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useGetPokemonByIdQuery(id);

    if (isLoading) return <p>Loading Pokemon</p>
    if (error) return <p>Error loading Pokemon</p>

    const alternateSprites = [
        data.sprites.back_default,
        data.sprites.front_shiny,
        data.sprites.back_shiny,
    ].filter(Boolean);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{data.name}</h1>
                <p>#{data.id}</p>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sprites}>Sprites</h2>
                <img
                    src={data.sprites.front_default}
                    alt={data.name}
                    className={styles.mainSprite}
                />
                <div>
                    {alternateSprites.map((sprite, index) => (
                        <img
                            key={sprite}
                            src={sprite}
                            alt={`${data.name} alternate ${index + 1}`}
                            className={styles.sprite}
                        />
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.info}>Information</h2>

                <p>Height: {data.height / 10} m</p>
                <p>Weight: {data.weight / 10} kg</p>
            </section>

            <section className={styles.section}>
                <h2>Types</h2>
                
                <div className={styles.badges}>
                     {data.types.map((type) => (
                    <span key={type.type.name} className={styles.badge}>
                        {type.type.name}
                    </span>
                ))}
                </div>
               
            </section>

            <section className={styles.section}>
                <h2>Abilities</h2>

                <div className={styles.badges}>
                    {data.abilities.map((ability) => (
                    <span key={ability.ability.name} className={styles.badge}>
                        {ability.ability.name}
                    </span>
                ))}
                </div>
                
            </section>

             <section className={styles.section}>
                <h2>Stats</h2>

                <div className={styles.stats}>
                {data.stats.map((stat) => {
                    const percentage = Math.min(
                        (stat.base_stat / 255) * 100,
                        100
                    );
                

                    return (
                        <div key={stat.stat.name} >
                            <div className={styles.statInfo}>
                                <span>{stat.stat.name}</span>
                                <span>{stat.base_stat}</span>
                            </div>

                            <div className={styles.statTrack}>
                                <div
                                    className={styles.statBar}
                                    style={{
                                        width: `${percentage}%`
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
                </div>
            </section>
        </div>
    )
};