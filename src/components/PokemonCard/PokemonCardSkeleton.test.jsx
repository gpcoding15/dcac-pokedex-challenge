import { render } from "@testing-library/react";
import { PokemonCardSkeleton } from "./PokemonCardSkeleton";

describe("PokemonCardSkeleton", () => {
    it("should render as a list item", () => {
        const { container } = render(
            <ul>
                <PokemonCardSkeleton />
            </ul>
        );

        expect(container.querySelector("li")).toBeInTheDocument();
    });

    it("should render four placeholder blocks", () => {
        const { container } = render(
            <ul>
                <PokemonCardSkeleton />
            </ul>
        );

        expect(container.querySelector("li").children).toHaveLength(4);
    });
});
