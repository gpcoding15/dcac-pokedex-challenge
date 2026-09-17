import { render, screen } from "@testing-library/react";
import { useFavorites } from "../../hooks/useFavorites";
import { Team } from "./Team";

jest.mock("../../hooks/useFavorites");
jest.mock("../../components/FavoritePokemon/FavoritePokemon", () => ({
    FavoritePokemon: ({ pokemonId }) => <div data-testid="favorite-pokemon">{pokemonId}</div>,
}));

describe("Team", () => {
    it("should show an empty state message when there are no favorites", () => {
        useFavorites.mockReturnValue({ favoriteIds: [] });

        render(<Team />);

        expect(screen.getByText(/no favorite pokémons on your list yet/i)).toBeInTheDocument();
    });

    it("should show how many favorites are selected out of the maximum of 6", () => {
        useFavorites.mockReturnValue({ favoriteIds: [1, 4] });

        render(<Team />);

        expect(screen.getByText("2 / 6 Pokémon")).toBeInTheDocument();
    });

    it("should render one FavoritePokemon per favorite id", () => {
        useFavorites.mockReturnValue({ favoriteIds: [1, 4, 25] });

        render(<Team />);

        expect(screen.getAllByTestId("favorite-pokemon")).toHaveLength(3);
    });
});
