import { render, screen } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { useGetPokemonByIdQuery } from "../../services/pokemonApi";
import { PokemonDetail } from "./PokemonDetail";

jest.mock("../../services/pokemonApi");
jest.mock("../../components/FavoriteButton/FavoriteButton", () => ({
    FavoriteButton: () => <div data-testid="favorite-button" />,
}));
jest.mock("react-router-dom", () => ({
    useParams: jest.fn(),
}));

const pikachu = {
    id: 25,
    name: "pikachu",
    height: 4,
    weight: 60,
    sprites: {
        front_default: "front.png",
        back_default: "back.png",
        front_shiny: "front-shiny.png",
        back_shiny: null,
    },
    types: [{ type: { name: "electric" } }],
    abilities: [{ ability: { name: "static" } }],
    stats: [{ stat: { name: "speed" }, base_stat: 90 }],
};

describe("PokemonDetail", () => {
    beforeEach(() => {
        useParams.mockReturnValue({ id: "25" });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should show a loading message while the pokemon data is loading", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: true });

        render(<PokemonDetail />);

        expect(screen.getByText(/loading pokémon/i)).toBeInTheDocument();
    });

    it("should show an error message when the query fails", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: false, error: new Error("failed") });

        render(<PokemonDetail />);

        expect(screen.getByText(/error loading pokémon/i)).toBeInTheDocument();
    });

    it("should render the pokemon name and number once loaded", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: false, data: pikachu });

        render(<PokemonDetail />);

        expect(screen.getByText("pikachu")).toBeInTheDocument();
        expect(screen.getByText("#25")).toBeInTheDocument();
    });

    it("should convert height and weight from decimeters/hectograms to meters/kg", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: false, data: pikachu });

        render(<PokemonDetail />);

        expect(screen.getByText("Height: 0.4 m")).toBeInTheDocument();
        expect(screen.getByText("Weight: 6 kg")).toBeInTheDocument();
    });

    it("should render a badge for each type and each ability", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: false, data: pikachu });

        render(<PokemonDetail />);

        expect(screen.getByText("electric")).toBeInTheDocument();
        expect(screen.getByText("static")).toBeInTheDocument();
    });

    it("should render each stat with its base value", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: false, data: pikachu });

        render(<PokemonDetail />);

        expect(screen.getByText("speed")).toBeInTheDocument();
        expect(screen.getByText("90")).toBeInTheDocument();
    });

    it("should only render the sprites that are not null", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: false, data: pikachu });

        render(<PokemonDetail />);

        expect(screen.getAllByAltText(/pikachu alternate/i)).toHaveLength(2);
    });

    it("should number each alternate sprite starting from 1", () => {
        useGetPokemonByIdQuery.mockReturnValue({ isLoading: false, data: pikachu });

        render(<PokemonDetail />);

        expect(screen.getByAltText("pikachu alternate 1")).toBeInTheDocument();
        expect(screen.getByAltText("pikachu alternate 2")).toBeInTheDocument();
    });

    it("should size the stat bar proportionally to the base stat out of 255", () => {
        useGetPokemonByIdQuery.mockReturnValue({
            isLoading: false,
            data: { ...pikachu, stats: [{ stat: { name: "speed" }, base_stat: 51 }] },
        });

        render(<PokemonDetail />);

        expect(screen.getByTestId("stat-bar")).toHaveStyle({ width: "20%" });
    });

    it("should cap the stat bar at 100% for base stats above 255", () => {
        useGetPokemonByIdQuery.mockReturnValue({
            isLoading: false,
            data: { ...pikachu, stats: [{ stat: { name: "speed" }, base_stat: 300 }] },
        });

        render(<PokemonDetail />);

        expect(screen.getByTestId("stat-bar")).toHaveStyle({ width: "100%" });
    });
});
