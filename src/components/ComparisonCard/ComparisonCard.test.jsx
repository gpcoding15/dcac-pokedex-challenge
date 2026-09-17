import { render, screen } from "@testing-library/react";
import { ComparisonCard } from "./ComparisonCard";

const pokemon = {
    name: "pikachu",
    sprites: { front_default: "pikachu.png" },
    types: [{ type: { name: "electric" } }],
    stats: [
        { stat: { name: "hp" }, base_stat: 35 },
        { stat: { name: "attack" }, base_stat: 55 },
    ],
};

describe("ComparisonCard", () => {
    it("should render the pokemon name", () => {
        render(<ComparisonCard pokemon={pokemon} />);

        expect(screen.getByText("pikachu")).toBeInTheDocument();
    });

    it("should render the pokemon image with the correct src and alt text", () => {
        render(<ComparisonCard pokemon={pokemon} />);

        const image = screen.getByAltText("pikachu");

        expect(image).toHaveAttribute("src", "pikachu.png");
    });

    it("should render a badge for every type of the pokemon", () => {
        render(<ComparisonCard pokemon={pokemon} />);

        expect(screen.getByText("electric")).toBeInTheDocument();
    });

    it("should render every stat with its base value", () => {
        render(<ComparisonCard pokemon={pokemon} />);

        expect(screen.getByText("hp")).toBeInTheDocument();
        expect(screen.getByText("35")).toBeInTheDocument();
        expect(screen.getByText("attack")).toBeInTheDocument();
        expect(screen.getByText("55")).toBeInTheDocument();
    });

    it("should apply the given accent color to the card", () => {
        const { container } = render(<ComparisonCard pokemon={pokemon} accentColor="#e3350d" />);

        expect(container.firstChild.style.getPropertyValue("--accent-color")).toBe("#e3350d");
    });

    it("should leave the accent color unset when none is given", () => {
        const { container } = render(<ComparisonCard pokemon={pokemon} />);

        expect(container.firstChild.style.getPropertyValue("--accent-color")).toBe("");
    });
});
