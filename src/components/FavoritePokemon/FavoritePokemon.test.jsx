import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useGetPokemonByIdQuery } from "../../services/pokemonApi";
import { FavoritePokemon } from "./FavoritePokemon";

jest.mock("../../services/pokemonApi");
jest.mock("../FavoriteButton/FavoriteButton", () => ({
    FavoriteButton: () => <div data-testid="favorite-button" />,
}));

const renderFavoritePokemon = () =>
    render(
        <MemoryRouter>
            <FavoritePokemon pokemonId={25} />
        </MemoryRouter>
    );

describe("FavoritePokemon", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should show a loading message while the pokemon data is loading", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: true });

        renderFavoritePokemon();

        expect(screen.getByText(/loading pokémon/i)).toBeInTheDocument();
    });

    it("should show an error message when the query fails", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: false, error: new Error("failed") });

        renderFavoritePokemon();

        expect(screen.getByText(/error loading pokémon/i)).toBeInTheDocument();
    });

    it("should render the pokemon number and name once loaded", () => {
        useGetPokemonByIdQuery.mockReturnValue({
            isLoading: false,
            data: { id: 25, name: "pikachu", sprites: { front_default: "pikachu.png" } },
        });

        renderFavoritePokemon();

        expect(screen.getByText("#25")).toBeInTheDocument();
        expect(screen.getByText("pikachu")).toBeInTheDocument();
    });

    it("should link to the pokemon detail page", () => {
        useGetPokemonByIdQuery.mockReturnValue({
            isLoading: false,
            data: { id: 25, name: "pikachu", sprites: { front_default: "pikachu.png" } },
        });

        renderFavoritePokemon();

        expect(screen.getByRole("link")).toHaveAttribute("href", "/pokemon/25");
    });
});
