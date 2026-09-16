import { useState } from 'react';
import PropTypes from 'prop-types';
import { useGetPokemonByIdQuery } from '../../services/pokemonApi';
import styles from "./PokemonCard.module.css";
import { PokemonCardSkeleton } from "./PokemonCardSkeleton";

export const PokemonCard = ({pokemon}) => {
    const [ loadedImage, setLoadedImage ] = useState(false);

    const id = pokemon.url.split("/").filter(Boolean).pop()
    const { data, isLoading, error } = useGetPokemonByIdQuery(id)

    if (isLoading) return <PokemonCardSkeleton/>
    if (error) return <p>Error loading Pokemon</p>

    return (
        <li className={styles.card}>
            <p className={styles.number}>#{data.id}</p>
            <p className={styles.name}>{pokemon.name}</p>
            <div className={styles.imageContainer}>
                {!loadedImage && (
                    <div className={styles.ImagePlaceholder}></div>
                )}
                <img
                    src={data.sprites.front_default} 
                    alt={pokemon.name} 
                    className={`${styles.image} ${
                        loadedImage ? styles.loadedImage : ""
                    }`}
                    onLoad={() => setLoadedImage(true)}
                />
            </div>
            
            <div className={styles.types}>
                {data.types.map((t) => (
                <span key={t.type.name} className={`${styles.type} ${styles[t.type.name]}`}>{t.type.name}</span>
            ))}
            </div>
            
        </li>
    )
};

PokemonCard.propTypes = {
    pokemon: PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
    }).isRequired,
};
