import PropTypes from "prop-types";
import styles from "./ComparisonCard.module.css";

export const ComparisonCard = ({ pokemon }) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.name}>{pokemon.name}</h2>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className={styles.image}/>
            <div className={styles.types}>
                {pokemon.types.map((type) => (
                    <span key={type.type.name} className={styles.type}>
                        {type.type.name}
                    </span>
                ))}
            </div>
            <div>
                {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name} className={styles.stat}>
                        <span className={styles.statName}>{stat.stat.name}</span>
                        <span>{stat.base_stat}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

ComparisonCard.propTypes = {
    pokemon: PropTypes.object.isRequired,
};