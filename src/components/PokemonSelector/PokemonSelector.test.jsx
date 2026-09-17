import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik, Form } from "formik";
import { PokemonSelector } from "./PokemonSelector";

const options = ["pikachu", "bulbasaur", "charmander"];

const renderPokemonSelector = ({ initialErrors = {}, initialTouched = {}, selectorOptions = options } = {}) =>
    render(
        <Formik
            initialValues={{ pokemon1: "" }}
            initialErrors={initialErrors}
            initialTouched={initialTouched}
            onSubmit={() => {}}
        >
            <Form>
                <PokemonSelector name="pokemon1" label="First Pokémon" options={selectorOptions} />
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

    it("should not show any suggestion dropdown before the input is focused", () => {
        renderPokemonSelector();

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("should open the suggestion dropdown when the input is focused, even without typing", async () => {
        const user = userEvent.setup();
        renderPokemonSelector();

        await user.click(screen.getByLabelText("First Pokémon"));

        expect(screen.getByRole("listbox")).toBeInTheDocument();
        expect(screen.getByText("pikachu")).toBeInTheDocument();
        expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    });

    it("should narrow the suggestions as the user types", async () => {
        const user = userEvent.setup();
        renderPokemonSelector();

        await user.type(screen.getByLabelText("First Pokémon"), "pika");

        expect(screen.getByText("pikachu")).toBeInTheDocument();
        expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
    });

    it("should fill the field and close the dropdown when a suggestion is selected", async () => {
        const user = userEvent.setup();
        renderPokemonSelector();
        await user.click(screen.getByLabelText("First Pokémon"));

        await user.click(screen.getByText("pikachu"));

        expect(screen.getByLabelText("First Pokémon")).toHaveValue("pikachu");
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("should close the dropdown when the input loses focus", async () => {
        const user = userEvent.setup();
        renderPokemonSelector();
        await user.click(screen.getByLabelText("First Pokémon"));
        expect(screen.getByRole("listbox")).toBeInTheDocument();

        await user.click(document.body);

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("should not show the dropdown when there are no matching options", async () => {
        const user = userEvent.setup();
        renderPokemonSelector();

        await user.type(screen.getByLabelText("First Pokémon"), "zzz");

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
});
