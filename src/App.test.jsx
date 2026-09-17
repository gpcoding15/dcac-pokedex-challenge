import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "./App";

jest.mock("./pages", () => ({
    Home: () => <div>Home page</div>,
    Team: () => <div>Team page</div>,
    Compare: () => <div>Compare page</div>,
    PokemonDetail: () => <div>PokemonDetail page</div>,
}));
jest.mock("./components/Navbar/Navbar", () => ({
    Navbar: () => <nav>Navbar</nav>,
}));

const renderAppAt = (path) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <App />
        </MemoryRouter>
    );

describe("App", () => {
    it("should render the Navbar", () => {
        renderAppAt("/");

        expect(screen.getByText("Navbar")).toBeInTheDocument();
    });

    it("should render Home at the root path", () => {
        renderAppAt("/");

        expect(screen.getByText("Home page")).toBeInTheDocument();
    });

    it("should render PokemonDetail at /pokemon/:id", () => {
        renderAppAt("/pokemon/25");

        expect(screen.getByText("PokemonDetail page")).toBeInTheDocument();
    });

    it("should render Team at /team", () => {
        renderAppAt("/team");

        expect(screen.getByText("Team page")).toBeInTheDocument();
    });

    it("should render Compare at /compare", () => {
        renderAppAt("/compare");

        expect(screen.getByText("Compare page")).toBeInTheDocument();
    });
});
