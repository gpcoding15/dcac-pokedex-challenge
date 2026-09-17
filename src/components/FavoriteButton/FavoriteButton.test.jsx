import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFavorites } from "../../hooks/useFavorites";
import { FavoriteButton } from "./FavoriteButton";

jest.mock("../../hooks/useFavorites");

describe("FavoriteButton", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should show 'Add to favorites' when the pokemon is not a favorite yet", () => {
        useFavorites.mockReturnValue({
            isFavorite: () => false,
            toggleFavorite: jest.fn(),
            isFull: false,
        });

        render(<FavoriteButton pokemonId={25} />);

        expect(screen.getByRole("button", { name: /add to favorites/i })).toBeInTheDocument();
    });

    it("should show 'Remove from favorites' when the pokemon is already a favorite", () => {
        useFavorites.mockReturnValue({
            isFavorite: () => true,
            toggleFavorite: jest.fn(),
            isFull: false,
        });

        render(<FavoriteButton pokemonId={25} />);

        expect(screen.getByRole("button", { name: /remove from favorites/i })).toBeInTheDocument();
    });

    it("should call toggleFavorite with the pokemon id when clicked", async () => {
        const toggleFavorite = jest.fn();
        useFavorites.mockReturnValue({
            isFavorite: () => false,
            toggleFavorite,
            isFull: false,
        });
        const user = userEvent.setup();
        render(<FavoriteButton pokemonId={25} />);

        await user.click(screen.getByRole("button"));

        expect(toggleFavorite).toHaveBeenCalledWith(25);
    });

    it("should show the limit message instead of toggling when the list is already full", async () => {
        const toggleFavorite = jest.fn();
        useFavorites.mockReturnValue({
            isFavorite: () => false,
            toggleFavorite,
            isFull: true,
        });
        const user = userEvent.setup();
        render(<FavoriteButton pokemonId={25} />);

        await user.click(screen.getByRole("button"));

        expect(screen.getByText(/maximum of 6 favorites reached/i)).toBeInTheDocument();
        expect(toggleFavorite).not.toHaveBeenCalled();
    });

    it("should not show the limit message on the initial render", () => {
        useFavorites.mockReturnValue({
            isFavorite: () => false,
            toggleFavorite: jest.fn(),
            isFull: true,
        });

        render(<FavoriteButton pokemonId={25} />);

        expect(screen.queryByText(/maximum of 6 favorites reached/i)).not.toBeInTheDocument();
    });

    it("should hide the limit message automatically after 2.5 seconds", () => {
        jest.useFakeTimers();
        useFavorites.mockReturnValue({
            isFavorite: () => false,
            toggleFavorite: jest.fn(),
            isFull: true,
        });
        render(<FavoriteButton pokemonId={25} />);
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText(/maximum of 6 favorites reached/i)).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(2500);
        });

        expect(screen.queryByText(/maximum of 6 favorites reached/i)).not.toBeInTheDocument();
        jest.useRealTimers();
    });

    it("should not schedule a hide timer when the limit message is never shown", () => {
        jest.useFakeTimers();
        useFavorites.mockReturnValue({
            isFavorite: () => false,
            toggleFavorite: jest.fn(),
            isFull: false,
        });

        render(<FavoriteButton pokemonId={25} />);

        expect(jest.getTimerCount()).toBe(0);
        jest.useRealTimers();
    });

    it("should clear the pending hide timer when unmounted while the message is showing", () => {
        jest.useFakeTimers();
        useFavorites.mockReturnValue({
            isFavorite: () => false,
            toggleFavorite: jest.fn(),
            isFull: true,
        });
        const { unmount } = render(<FavoriteButton pokemonId={25} />);
        fireEvent.click(screen.getByRole("button"));
        expect(jest.getTimerCount()).toBe(1);

        unmount();

        expect(jest.getTimerCount()).toBe(0);
        jest.useRealTimers();
    });
});
