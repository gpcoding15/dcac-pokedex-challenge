import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { Navbar } from "./Navbar";

jest.mock("../../hooks/useOnlineStatus");

const renderNavbar = () =>
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

describe("Navbar", () => {
    it("should render links to Home, Favorites and Compare", () => {
        useOnlineStatus.mockReturnValue(true);

        renderNavbar();

        expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Favorites" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Compare" })).toBeInTheDocument();
    });

    it("should show 'Online' when the connection is online", () => {
        useOnlineStatus.mockReturnValue(true);

        renderNavbar();

        expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("should show 'Offline' when the connection is offline", () => {
        useOnlineStatus.mockReturnValue(false);

        renderNavbar();

        expect(screen.getByText("Offline")).toBeInTheDocument();
    });
});
