import { render, screen } from "@testing-library/react";
import { Formik, Form } from "formik";
import { PokemonSelector } from "./PokemonSelector";

const renderPokemonSelector = ({ initialErrors = {}, initialTouched = {} } = {}) =>
    render(
        <Formik
            initialValues={{ pokemon1: "" }}
            initialErrors={initialErrors}
            initialTouched={initialTouched}
            onSubmit={() => {}}
        >
            <Form>
                <PokemonSelector name="pokemon1" label="First Pokémon" />
            </Form>
        </Formik>
    );

describe("PokemonSelector", () => {
    it("should render the given label", () => {
        renderPokemonSelector();

        expect(screen.getByLabelText("First Pokémon")).toBeInTheDocument();
    });

    it("should render an input associated to the given name", () => {
        renderPokemonSelector();

        const input = screen.getByLabelText("First Pokémon");

        expect(input).toHaveAttribute("name", "pokemon1");
    });

    it("should not show an error message when the field has no error", () => {
        renderPokemonSelector();

        expect(screen.queryByText("Select the first Pokémon")).not.toBeInTheDocument();
    });

    it("should show the validation error message once the field was touched", () => {
        renderPokemonSelector({
            initialErrors: { pokemon1: "Select the first Pokémon" },
            initialTouched: { pokemon1: true },
        });

        expect(screen.getByText("Select the first Pokémon")).toBeInTheDocument();
    });
});
