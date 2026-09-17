import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useField } from "formik";
import styles from "./PokemonSelector.module.css";

const MAX_SUGGESTIONS = 8;

export const PokemonSelector = ({ name, label, options }) => {
    const [field, meta, helpers] = useField(name);
    const [isOpen, setIsOpen] = useState(false);

    const suggestions = useMemo(() => {
        const query = field.value.trim().toLowerCase();
        const matches = query
            ? options.filter((option) => option.toLowerCase().includes(query))
            : options;

        return matches.slice(0, MAX_SUGGESTIONS);
    }, [field.value, options]);

    const handleSelect = (option) => {
        helpers.setValue(option);
        helpers.setTouched(true);
        setIsOpen(false);
    };

    return (
        <div className={styles.field}>
            <label htmlFor={name} className={styles.label}>{label}</label>

            <div className={styles.autocomplete}>
                <input
                    {...field}
                    id={name}
                    type="text"
                    autoComplete="off"
                    placeholder="Search Pokémon..."
                    className={styles.input}
                    role="combobox"
                    aria-expanded={isOpen && suggestions.length > 0}
                    aria-controls={`${name}-listbox`}
                    onFocus={() => setIsOpen(true)}
                    onBlur={(event) => {
                        field.onBlur(event);
                        setIsOpen(false);
                    }}
                />

                {isOpen && suggestions.length > 0 && (
                    <ul id={`${name}-listbox`} className={styles.suggestions} role="listbox">
                        {suggestions.map((option) => (
                            <li
                                key={option}
                                role="option"
                                aria-selected={option === field.value}
                                className={styles.suggestion}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {meta.touched && meta.error && <p className={styles.error}>{meta.error}</p>}
        </div>
    );
};

PokemonSelector.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
};
