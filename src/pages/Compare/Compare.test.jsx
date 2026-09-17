import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useGetPokemonsDataQuery, useGetPokemonByIdQuery } from "../../services/pokemonApi";
import { Compare } from "./Compare";

jest.mock("../../services/pokemonApi");
jest.mock("../../components/ComparisonCard/ComparisonCard", () => ({
    ComparisonCard: ({ pokemon, accentColor }) => (
        <div data-testid="comparison-card" data-accent-color={accentColor}>{pokemon.name}</div>
    ),
}));

const buildPokemon = (name) => ({
    name,
    stats: [{ stat: { name: "hp" }, base_stat: 35 }],
});

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
            if (name === "pikachu") return { data: buildPokemon("pikachu"), isLoading: false };
            if (name === "bulbasaur") return { data: buildPokemon("bulbasaur"), isLoading: false };
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

    it("should show the stats comparison chart once both pokemon are loaded", async () => {
        useGetPokemonByIdQuery.mockImplementation((name) => {
            if (name === "pikachu") return { data: buildPokemon("pikachu"), isLoading: false };
            if (name === "bulbasaur") return { data: buildPokemon("bulbasaur"), isLoading: false };
            return { data: undefined, isLoading: false };
        });
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "pikachu");
        await user.type(screen.getByLabelText("Second Pokémon"), "bulbasaur");
        await user.click(screen.getByRole("button", { name: /compare/i }));

        expect(await screen.findByRole("heading", { name: /stats comparison/i })).toBeInTheDocument();
    });

    it("should not show the stats comparison chart before both pokemon are loaded", () => {
        render(<Compare />);

        expect(screen.queryByRole("heading", { name: /stats comparison/i })).not.toBeInTheDocument();
    });

    it("should show a caption clarifying the chart shows base stats", async () => {
        useGetPokemonByIdQuery.mockImplementation((name) => {
            if (name === "pikachu") return { data: buildPokemon("pikachu"), isLoading: false };
            if (name === "bulbasaur") return { data: buildPokemon("bulbasaur"), isLoading: false };
            return { data: undefined, isLoading: false };
        });
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "pikachu");
        await user.type(screen.getByLabelText("Second Pokémon"), "bulbasaur");
        await user.click(screen.getByRole("button", { name: /compare/i }));

        expect(await screen.findByText("Base stats")).toBeInTheDocument();
    });

    it("should give each comparison card a different accent color", async () => {
        useGetPokemonByIdQuery.mockImplementation((name) => {
            if (name === "pikachu") return { data: buildPokemon("pikachu"), isLoading: false };
            if (name === "bulbasaur") return { data: buildPokemon("bulbasaur"), isLoading: false };
            return { data: undefined, isLoading: false };
        });
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "pikachu");
        await user.type(screen.getByLabelText("Second Pokémon"), "bulbasaur");
        await user.click(screen.getByRole("button", { name: /compare/i }));

        const [card1, card2] = await screen.findAllByTestId("comparison-card");
        const color1 = card1.dataset.accentColor;
        const color2 = card2.dataset.accentColor;

        expect(color1).toBeTruthy();
        expect(color2).toBeTruthy();
        expect(color1).not.toBe(color2);
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

    it("should suggest every available pokemon when a selector is focused", async () => {
        useGetPokemonsDataQuery.mockReturnValue({
            data: { results: [{ name: "pikachu" }, { name: "bulbasaur" }] },
        });
        const user = userEvent.setup();
        render(<Compare />);

        await user.click(screen.getByLabelText("First Pokémon"));

        expect(screen.getByText("pikachu")).toBeInTheDocument();
        expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    });

    it("should not crash while the full pokemon list is still loading", () => {
        useGetPokemonsDataQuery.mockReturnValue({ data: undefined });

        expect(() => render(<Compare />)).not.toThrow();
    });

    it("should show a not-found message when the first pokemon does not exist", async () => {
        useGetPokemonByIdQuery.mockImplementation((name) => {
            if (name === "zzz") return { data: undefined, isLoading: false, error: { status: 404 } };
            return { data: undefined, isLoading: false };
        });
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "zzz");
        await user.type(screen.getByLabelText("Second Pokémon"), "bulbasaur");
        await user.click(screen.getByRole("button", { name: /compare/i }));

        expect(await screen.findByText(/couldn't find "zzz"/i)).toBeInTheDocument();
    });

    it("should not show the loading text once the not-found pokemon has finished failing", async () => {
        useGetPokemonByIdQuery.mockImplementation((name) => {
            if (name === "zzz") return { data: undefined, isLoading: false, error: { status: 404 } };
            return { data: undefined, isLoading: false };
        });
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "zzz");
        await user.type(screen.getByLabelText("Second Pokémon"), "bulbasaur");
        await user.click(screen.getByRole("button", { name: /compare/i }));
        await screen.findByText(/couldn't find "zzz"/i);

        expect(screen.queryByText(/loading comparison/i)).not.toBeInTheDocument();
    });

    it("should show a not-found message for each pokemon that does not exist", async () => {
        useGetPokemonByIdQuery.mockReturnValue({ data: undefined, isLoading: false, error: { status: 404 } });
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "zzz");
        await user.type(screen.getByLabelText("Second Pokémon"), "yyy");
        await user.click(screen.getByRole("button", { name: /compare/i }));

        expect(await screen.findByText(/couldn't find "zzz"/i)).toBeInTheDocument();
        expect(screen.getByText(/couldn't find "yyy"/i)).toBeInTheDocument();
    });

    it("should not show a not-found message when both pokemon are valid", async () => {
        useGetPokemonByIdQuery.mockImplementation((name) => {
            if (name === "pikachu") return { data: buildPokemon("pikachu"), isLoading: false };
            if (name === "bulbasaur") return { data: buildPokemon("bulbasaur"), isLoading: false };
            return { data: undefined, isLoading: false };
        });
        const user = userEvent.setup();
        render(<Compare />);

        await user.type(screen.getByLabelText("First Pokémon"), "pikachu");
        await user.type(screen.getByLabelText("Second Pokémon"), "bulbasaur");
        await user.click(screen.getByRole("button", { name: /compare/i }));

        await screen.findAllByTestId("comparison-card");
        expect(screen.queryByText(/couldn't find/i)).not.toBeInTheDocument();
    });
});
