import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useGetPokemonsDataQuery, useGetPokemonByIdQuery } from "../../services/pokemonApi";
import { Compare } from "./Compare";

jest.mock("../../services/pokemonApi");
jest.mock("../../components/ComparisonCard/ComparisonCard", () => ({
    ComparisonCard: ({ pokemon }) => <div data-testid="comparison-card">{pokemon.name}</div>,
}));

describe("Compare", () => {
    beforeEach(() => {
        useGetPokemonsDataQuery.mockReturnValue({ data: { results: [] } });
        useGetPokemonByIdQuery.mockReturnValue({ data: undefined, isLoading: false });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render both pokemon selector fields", () => {
        render(<Compare />);

        expect(screen.getByLabelText("First Pokémon")).toBeInTheDocument();
        expect(screen.getByLabelText("Second Pokémon")).toBeInTheDocument();
    });

    it("should not render any comparison card before a comparison is submitted", () => {
        render(<Compare />);

        expect(screen.queryByTestId("comparison-card")).not.toBeInTheDocument();
    });

    it("should show validation errors when submitting the form empty", async () => {
        const user = userEvent.setup();
        render(<Compare />);

        await user.click(screen.getByRole("button", { name: /compare/i }));

        expect(await screen.findByText("Select the first Pokémon")).toBeInTheDocument();
        expect(await screen.findByText("Select the second Pokémon")).toBeInTheDocument();
    });

    it("should render a comparison card for each pokemon once both are selected and loaded", async () => {
        useGetPokemonByIdQuery.mockImplementation((name) => {
            if (name === "pikachu") return { data: { name: "pikachu" }, isLoading: false };
            if (name === "bulbasaur") return { data: { name: "bulbasaur" }, isLoading: false };
            return { data: undefined, isLoading: false };
        });
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "pikachu");
        await user.type(screen.getByLabelText("Second Pokémon"), "bulbasaur");
        await user.click(screen.getByRole("button", { name: /compare/i }));

        const cards = await screen.findAllByTestId("comparison-card");
        expect(cards).toHaveLength(2);
    });

    it("should skip fetching pokemon details until both selectors have a value", () => {
        render(<Compare />);

        expect(useGetPokemonByIdQuery.mock.calls).toEqual([
            ["", { skip: true }],
            ["", { skip: true }],
        ]);
    });

    it("should stop skipping and fetch each pokemon once both selectors are submitted", async () => {
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "pikachu");
        await user.type(screen.getByLabelText("Second Pokémon"), "bulbasaur");
        await user.click(screen.getByRole("button", { name: /compare/i }));

        expect(useGetPokemonByIdQuery).toHaveBeenCalledWith("pikachu", { skip: false });
        expect(useGetPokemonByIdQuery).toHaveBeenCalledWith("bulbasaur", { skip: false });
    });

    it("should show the loading text while only one of the two pokemon queries is still loading", async () => {
        useGetPokemonByIdQuery.mockImplementation((name) => {
            if (name === "pikachu") return { data: undefined, isLoading: true };
            return { data: undefined, isLoading: false };
        });
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "pikachu");
        await user.type(screen.getByLabelText("Second Pokémon"), "bulbasaur");
        await user.click(screen.getByRole("button", { name: /compare/i }));

        expect(await screen.findByText(/loading comparison/i)).toBeInTheDocument();
    });

    it("should not show the loading text when neither pokemon query is loading", async () => {
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "pikachu");
        await user.type(screen.getByLabelText("Second Pokémon"), "bulbasaur");
        await user.click(screen.getByRole("button", { name: /compare/i }));

        expect(screen.queryByText(/loading comparison/i)).not.toBeInTheDocument();
    });

    it("should not render any comparison card when only one pokemon has finished loading", async () => {
        useGetPokemonByIdQuery.mockImplementation((name) => {
            if (name === "pikachu") return { data: { name: "pikachu" }, isLoading: false };
            return { data: undefined, isLoading: false };
        });
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "pikachu");
        await user.type(screen.getByLabelText("Second Pokémon"), "bulbasaur");
        await user.click(screen.getByRole("button", { name: /compare/i }));

        expect(screen.queryByTestId("comparison-card")).not.toBeInTheDocument();
    });

    it("should render a datalist option for each available pokemon", () => {
        useGetPokemonsDataQuery.mockReturnValue({
            data: { results: [{ name: "pikachu" }, { name: "bulbasaur" }] },
        });

        const { container } = render(<Compare />);

        expect(container.querySelectorAll("#pokemon-options option")).toHaveLength(2);
    });

    it("should not crash while the full pokemon list is still loading", () => {
        useGetPokemonsDataQuery.mockReturnValue({ data: undefined });

        expect(() => render(<Compare />)).not.toThrow();
    });
});
