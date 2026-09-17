import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useGetPokemonByIdQuery } from "../../services/pokemonApi";
import { PokemonCard } from "./PokemonCard";

jest.mock("../../services/pokemonApi");
jest.mock("../FavoriteButton/FavoriteButton", () => ({
    FavoriteButton: () => <div data-testid="favorite-button" />,
}));

const pokemon = { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" };

const renderPokemonCard = () =>
    render(
        <MemoryRouter>
            <ul>
                <PokemonCard pokemon={pokemon} />
            </ul>
        </MemoryRouter>
    );

describe("PokemonCard", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render a loading skeleton while the pokemon data is loading", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: true });

        renderPokemonCard();

        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("should render an error message when the query fails", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: false, error: new Error("failed") });

        renderPokemonCard();

        expect(screen.getByText(/error loading pokémon/i)).toBeInTheDocument();
    });

    it("should render the pokemon number and name once loaded", () => {
        useGetPokemonByIdQuery.mockReturnValue({
            isLoading: false,
            data: { id: 25, sprites: { front_default: "pikachu.png" }, types: [{ type: { name: "electric" } }] },
        });

        renderPokemonCard();

        expect(screen.getByText("#25")).toBeInTheDocument();
        expect(screen.getByText("pikachu")).toBeInTheDocument();
    });

    it("should link to the pokemon detail page using the fetched id", () => {
        useGetPokemonByIdQuery.mockReturnValue({
            isLoading: false,
            data: { id: 25, sprites: { front_default: "pikachu.png" }, types: [{ type: { name: "electric" } }] },
        });

        renderPokemonCard();

        expect(screen.getByRole("link")).toHaveAttribute("href", "/pokemon/25");
    });

    it("should show an image placeholder before the image has finished loading", () => {
        useGetPokemonByIdQuery.mockReturnValue({
            isLoading: false,
            data: { id: 25, sprites: { front_default: "pikachu.png" }, types: [] },
        });

        renderPokemonCard();

        expect(screen.getByTestId("image-placeholder")).toBeInTheDocument();
    });

    it("should hide the image placeholder once the image finishes loading", () => {
        useGetPokemonByIdQuery.mockReturnValue({
            isLoading: false,
            data: { id: 25, sprites: { front_default: "pikachu.png" }, types: [] },
        });
        renderPokemonCard();

        fireEvent.load(screen.getByAltText("pikachu"));

        expect(screen.queryByTestId("image-placeholder")).not.toBeInTheDocument();
    });

    it("should call useGetPokemonByIdQuery with the id extracted from the pokemon url", () => {
        useGetPokemonByIdQuery.mockReturnValue({
            isLoading: false,
            data: { id: 25, sprites: { front_default: "pikachu.png" }, types: [] },
        });

        renderPokemonCard();

        expect(useGetPokemonByIdQuery).toHaveBeenCalledWith("25");
    });
});
