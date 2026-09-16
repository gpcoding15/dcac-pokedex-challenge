import PropTypes from "prop-types";
import { Field, ErrorMessage } from "formik";

export const PokemonSelector = ({ name, label }) => {
    return (
        <div>
            <label htmlFor={name}>{label}</label>

            <Field
                id={name}
                name={name}
                list="pokemon-options"
                placeholder="Search Pokémon..."
            />

            <ErrorMessage name={name} component="p"/>
        </div>
    );
};

PokemonSelector.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};