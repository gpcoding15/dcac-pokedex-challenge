import PropTypes from "prop-types";
import { Field, ErrorMessage } from "formik";
import styles from "./PokemonSelector.module.css";

export const PokemonSelector = ({ name, label }) => {
    return (
        <div className={styles.field}>
            <label htmlFor={name} className={styles.label}>{label}</label>

            <Field
                id={name}
                name={name}
                list="pokemon-options"
                placeholder="Search Pokémon..."
                className={styles.input}
            />

            <ErrorMessage name={name} component="p" className={styles.error}/>
        </div>
    );
};

PokemonSelector.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};
