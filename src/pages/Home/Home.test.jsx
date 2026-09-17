import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "react-router-dom";
import {
    useGetPokemonsInfiniteQuery,
    useGetPokemonsDataQuery,
    useGetTypesQuery,
    useGetPokemonByTypeQuery,
    useGetGenerationsQuery,
    useGetGenerationByIdQuery,
} from "../../services/pokemonApi";
import { useDebounce } from "../../hooks/useDebounce";
import { Home } from "./Home";

jest.mock("../../services/pokemonApi");
jest.mock("../../hooks/useDebounce");
jest.mock("../../components/PokemonCard/PokemonCard", () => ({
    PokemonCard: ({ pokemon }) => <li data-testid="pokemon-card">{pokemon.name}</li>,
}));
jest.mock("react-router-dom", () => ({
    useSearchParams: jest.fn(),
}));

const allPokemons = {
    results: [
        { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    ],
};

const infinitePages = {
    pages: [{ results: [{ name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" }] }],
};

const setSearchParams = jest.fn();

const buildSearchParams = (values = {}) => ({
    get: (key) => values[key] ?? null,
});

const setUpMocks = ({ infiniteQueryOverrides = {}, searchParamsValues = {} } = {}) => {
    useSearchParams.mockReturnValue([buildSearchParams(searchParamsValues), setSearchParams]);
    useDebounce.mockImplementation((value) => value);
    useGetPokemonsInfiniteQuery.mockReturnValue({
        data: infinitePages,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        error: undefined,
        refetch: jest.fn(),
        ...infiniteQueryOverrides,
    });
    useGetPokemonsDataQuery.mockReturnValue({ data: allPokemons });
    useGetTypesQuery.mockReturnValue({ data: { results: [{ name: "electric" }] } });
    useGetGenerationsQuery.mockReturnValue({ data: { results: [{ name: "generation-i" }] } });
    useGetPokemonByTypeQuery.mockReturnValue({ data: undefined });
    useGetGenerationByIdQuery.mockReturnValue({ data: undefined });
};

describe("Home", () => {
    let observeMock;
    let unobserveMock;
    let observerCallback;

    beforeEach(() => {
        observeMock = jest.fn();
        unobserveMock = jest.fn();
        global.IntersectionObserver = jest.fn((callback) => {
            observerCallback = callback;
            return { observe: observeMock, unobserve: unobserveMock, disconnect: jest.fn() };
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render a pokemon card for each pokemon from the infinite query when there are no active filters", () => {
        setUpMocks();

        render(<Home />);

        expect(screen.getAllByTestId("pokemon-card")).toHaveLength(1);
        expect(screen.getByText("pikachu")).toBeInTheDocument();
    });

    it("should not crash and render no cards when the infinite query has no data yet", () => {
        setUpMocks({ infiniteQueryOverrides: { data: undefined } });

        render(<Home />);

        expect(screen.queryAllByTestId("pokemon-card")).toHaveLength(0);
    });

    it("should not crash when the infinite query data has no pages yet", () => {
        setUpMocks({ infiniteQueryOverrides: { data: {} } });

        expect(() => render(<Home />)).not.toThrow();
        expect(screen.queryAllByTestId("pokemon-card")).toHaveLength(0);
    });

    it("should not crash when filtering is active but the full pokemon list has not loaded yet", async () => {
        setUpMocks();
        useGetPokemonsDataQuery.mockReturnValue({ data: undefined });
        const user = userEvent.setup();
        render(<Home />);

        await user.type(screen.getByPlaceholderText("Search Pokemon"), "pika");

        expect(screen.queryAllByTestId("pokemon-card")).toHaveLength(0);
    });

    it("should not treat a whitespace-only search as an active filter", async () => {
        setUpMocks();
        const user = userEvent.setup();
        render(<Home />);

        await user.type(screen.getByPlaceholderText("Search Pokemon"), "   ");

        expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
    });

    it("should trim whitespace from the search term before syncing it to the url", async () => {
        setUpMocks();
        const user = userEvent.setup();
        render(<Home />);

        await user.type(screen.getByPlaceholderText("Search Pokemon"), "  pikachu  ");

        expect(setSearchParams).toHaveBeenLastCalledWith({ search: "pikachu" });
    });

    it("should not include an empty search key in the url when the search is only whitespace", async () => {
        setUpMocks();
        const user = userEvent.setup();
        render(<Home />);

        await user.type(screen.getByPlaceholderText("Search Pokemon"), "   ");

        expect(setSearchParams).toHaveBeenLastCalledWith({});
    });

    it("should match pokemon names even when the search has surrounding whitespace", async () => {
        setUpMocks();
        const user = userEvent.setup();
        render(<Home />);

        await user.type(screen.getByPlaceholderText("Search Pokemon"), "  pika  ");

        expect(screen.getByText("pikachu")).toBeInTheDocument();
        expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
    });

    it("should treat selecting a type as an active filter on its own, even with an empty search", async () => {
        setUpMocks({
            infiniteQueryOverrides: { data: { pages: [{ results: allPokemons.results }] } },
        });
        useGetPokemonByTypeQuery.mockImplementation((type) => {
            if (type === "electric") return { data: { pokemon: [{ pokemon: { name: "pikachu" } }] } };
            return { data: undefined };
        });
        const user = userEvent.setup();
        render(<Home />);

        await user.selectOptions(screen.getByDisplayValue("Types"), "electric");

        expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
    });

    it("should render the error state with a retry button when the initial query fails without any cached data", async () => {
        const refetch = jest.fn();
        setUpMocks({ infiniteQueryOverrides: { data: undefined, error: new Error("network error"), refetch } });

        render(<Home />);
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: /retry/i }));

        expect(screen.getByText(/unable to load pokémon/i)).toBeInTheDocument();
        expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("should not render the error state when the query fails but cached data is still available", () => {
        setUpMocks({ infiniteQueryOverrides: { error: new Error("network error") } });

        render(<Home />);

        expect(screen.queryByText(/unable to load pokémon/i)).not.toBeInTheDocument();
        expect(screen.getByText("pikachu")).toBeInTheDocument();
    });

    describe("search by URL params", () => {
        it("should initialize the search input from the search url param", () => {
            setUpMocks({ searchParamsValues: { search: "pikachu" } });

            render(<Home />);

            expect(screen.getByPlaceholderText("Search Pokemon")).toHaveValue("pikachu");
        });

        it("should initialize the type select from the type url param", () => {
            setUpMocks({ searchParamsValues: { type: "electric" } });

            render(<Home />);

            expect(screen.getByDisplayValue("Electric")).toBeInTheDocument();
        });

        it("should initialize the generation select from the generation url param", () => {
            setUpMocks({ searchParamsValues: { generation: "1" } });

            render(<Home />);

            expect(screen.getByDisplayValue("Generation 1")).toBeInTheDocument();
        });

        it("should start with an empty search when there is no url param", () => {
            setUpMocks();

            render(<Home />);

            expect(screen.getByPlaceholderText("Search Pokemon")).toHaveValue("");
        });
    });

    describe("skipping the type/generation queries", () => {
        it("should skip fetching pokemon-by-type until a type is selected", () => {
            setUpMocks();

            render(<Home />);

            expect(useGetPokemonByTypeQuery).toHaveBeenLastCalledWith("", { skip: true });
        });

        it("should stop skipping pokemon-by-type once a type is selected", async () => {
            setUpMocks();
            const user = userEvent.setup();
            render(<Home />);

            await user.selectOptions(screen.getByDisplayValue("Types"), "electric");

            expect(useGetPokemonByTypeQuery).toHaveBeenLastCalledWith("electric", { skip: false });
        });

        it("should skip fetching the generation until one is selected", () => {
            setUpMocks();

            render(<Home />);

            expect(useGetGenerationByIdQuery).toHaveBeenLastCalledWith("", { skip: true });
        });

        it("should stop skipping the generation query once one is selected", async () => {
            setUpMocks();
            const user = userEvent.setup();
            render(<Home />);

            await user.selectOptions(screen.getByDisplayValue("Generations"), "1");

            expect(useGetGenerationByIdQuery).toHaveBeenLastCalledWith("1", { skip: false });
        });
    });

    it("should filter the pokemon list by the typed search text", async () => {
        setUpMocks();
        render(<Home />);
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Search Pokemon"), "pika");

        expect(screen.getByText("pikachu")).toBeInTheDocument();
        expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
    });

    it("should show an empty state message when no pokemon matches the active filters", async () => {
        setUpMocks();
        render(<Home />);
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Search Pokemon"), "zzz");

        expect(screen.getByText(/no pokémon found matches your search/i)).toBeInTheDocument();
    });

    it("should not show the empty state message when the active filters still match a pokemon", async () => {
        setUpMocks();
        render(<Home />);
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Search Pokemon"), "pika");

        expect(screen.queryByText(/no pokémon found matches your search/i)).not.toBeInTheDocument();
    });

    it("should not show the empty state message when there are no active filters, even with an empty list", () => {
        setUpMocks({ infiniteQueryOverrides: { data: { pages: [{ results: [] }] } } });

        render(<Home />);

        expect(screen.queryByText(/no pokémon found matches your search/i)).not.toBeInTheDocument();
    });

    describe("filtering by type and generation", () => {
        it("should filter the pokemon list by the selected type", async () => {
            setUpMocks();
            useGetPokemonByTypeQuery.mockImplementation((type) => {
                if (type === "electric") return { data: { pokemon: [{ pokemon: { name: "pikachu" } }] } };
                return { data: undefined };
            });
            const user = userEvent.setup();
            render(<Home />);

            await user.selectOptions(screen.getByDisplayValue("Types"), "electric");

            expect(screen.getByText("pikachu")).toBeInTheDocument();
            expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
        });

        it("should filter the pokemon list by the selected generation", async () => {
            setUpMocks();
            useGetGenerationByIdQuery.mockImplementation((generationId) => {
                if (generationId === "1") return { data: { pokemon_species: [{ name: "bulbasaur" }] } };
                return { data: undefined };
            });
            const user = userEvent.setup();
            render(<Home />);

            await user.selectOptions(screen.getByDisplayValue("Generations"), "1");

            expect(screen.getByText("bulbasaur")).toBeInTheDocument();
            expect(screen.queryByText("pikachu")).not.toBeInTheDocument();
        });
    });

    describe("syncing filters to the url", () => {
        it("should sync an empty params object when there are no active filters", () => {
            setUpMocks();

            render(<Home />);

            expect(setSearchParams).toHaveBeenLastCalledWith({});
        });

        it("should include the search term in the synced url params", async () => {
            setUpMocks();
            const user = userEvent.setup();
            render(<Home />);

            await user.type(screen.getByPlaceholderText("Search Pokemon"), "pika");

            expect(setSearchParams).toHaveBeenLastCalledWith({ search: "pika" });
        });

        it("should include the selected type in the synced url params", async () => {
            setUpMocks();
            const user = userEvent.setup();
            render(<Home />);

            await user.selectOptions(screen.getByDisplayValue("Types"), "electric");

            expect(setSearchParams).toHaveBeenLastCalledWith({ type: "electric" });
        });

        it("should include the selected generation in the synced url params", async () => {
            setUpMocks();
            const user = userEvent.setup();
            render(<Home />);

            await user.selectOptions(screen.getByDisplayValue("Generations"), "1");

            expect(setSearchParams).toHaveBeenLastCalledWith({ generation: "1" });
        });
    });

    describe("type and generation dropdown options", () => {
        it("should render the type name capitalized", () => {
            setUpMocks();
            useGetTypesQuery.mockReturnValue({ data: { results: [{ name: "fire" }] } });

            render(<Home />);

            expect(screen.getByText("Fire")).toBeInTheDocument();
        });

        it("should not crash while the types list is still loading", () => {
            setUpMocks();
            useGetTypesQuery.mockReturnValue({ data: undefined });

            expect(() => render(<Home />)).not.toThrow();
        });

        it("should number each generation option starting from 1", () => {
            setUpMocks();
            useGetGenerationsQuery.mockReturnValue({
                data: { results: [{ name: "generation-i" }, { name: "generation-ii" }] },
            });

            render(<Home />);

            expect(screen.getByText("Generation 1")).toBeInTheDocument();
            expect(screen.getByText("Generation 2")).toBeInTheDocument();
        });

        it("should only render up to 9 generations even if more are returned", () => {
            setUpMocks();
            useGetGenerationsQuery.mockReturnValue({
                data: { results: Array.from({ length: 12 }, (_, i) => ({ name: `generation-${i}` })) },
            });

            render(<Home />);

            expect(screen.queryByText("Generation 10")).not.toBeInTheDocument();
            expect(screen.getByText("Generation 9")).toBeInTheDocument();
        });

        it("should not crash while the generations list is still loading", () => {
            setUpMocks();
            useGetGenerationsQuery.mockReturnValue({ data: undefined });

            expect(() => render(<Home />)).not.toThrow();
        });
    });

    describe("infinite scroll sentinel", () => {
        it("should observe the load-more sentinel element when there are no active filters", () => {
            setUpMocks();

            render(<Home />);

            expect(observeMock).toHaveBeenCalledTimes(1);
        });

        it("should not render the load-more sentinel when there are active filters", async () => {
            setUpMocks();
            const user = userEvent.setup();
            render(<Home />);

            await user.type(screen.getByPlaceholderText("Search Pokemon"), "pika");

            expect(screen.queryByText(/loading more pokemons/i)).not.toBeInTheDocument();
        });

        it("should call fetchNextPage when the sentinel intersects and there is a next page", () => {
            const fetchNextPage = jest.fn();
            setUpMocks({ infiniteQueryOverrides: { fetchNextPage, hasNextPage: true, isFetchingNextPage: false } });

            render(<Home />);
            act(() => {
                observerCallback([{ isIntersecting: true }]);
            });

            expect(fetchNextPage).toHaveBeenCalledTimes(1);
        });

        it("should not call fetchNextPage when the sentinel is not intersecting", () => {
            const fetchNextPage = jest.fn();
            setUpMocks({ infiniteQueryOverrides: { fetchNextPage, hasNextPage: true, isFetchingNextPage: false } });

            render(<Home />);
            act(() => {
                observerCallback([{ isIntersecting: false }]);
            });

            expect(fetchNextPage).not.toHaveBeenCalled();
        });

        it("should not call fetchNextPage when there is no next page", () => {
            const fetchNextPage = jest.fn();
            setUpMocks({ infiniteQueryOverrides: { fetchNextPage, hasNextPage: false, isFetchingNextPage: false } });

            render(<Home />);
            act(() => {
                observerCallback([{ isIntersecting: true }]);
            });

            expect(fetchNextPage).not.toHaveBeenCalled();
        });

        it("should not call fetchNextPage while already fetching the next page", () => {
            const fetchNextPage = jest.fn();
            setUpMocks({ infiniteQueryOverrides: { fetchNextPage, hasNextPage: true, isFetchingNextPage: true } });

            render(<Home />);
            act(() => {
                observerCallback([{ isIntersecting: true }]);
            });

            expect(fetchNextPage).not.toHaveBeenCalled();
        });

        it("should not observe anything when there is no sentinel to attach to", () => {
            setUpMocks({ searchParamsValues: { search: "pikachu" } });

            render(<Home />);

            expect(observeMock).not.toHaveBeenCalled();
        });

        it("should not try to unobserve when there was never a sentinel to observe", () => {
            setUpMocks({ searchParamsValues: { search: "pikachu" } });
            const { unmount } = render(<Home />);

            unmount();

            expect(unobserveMock).not.toHaveBeenCalled();
        });

        it("should re-observe the sentinel when the infinite query state changes", () => {
            setUpMocks();
            const { rerender } = render(<Home />);
            expect(observeMock).toHaveBeenCalledTimes(1);

            useGetPokemonsInfiniteQuery.mockReturnValue({
                data: infinitePages,
                fetchNextPage: jest.fn(),
                hasNextPage: true,
                isFetchingNextPage: false,
                error: undefined,
                refetch: jest.fn(),
            });
            rerender(<Home />);

            expect(observeMock).toHaveBeenCalledTimes(2);
        });

        it("should unobserve the sentinel element when unmounted", () => {
            setUpMocks();
            const { unmount } = render(<Home />);

            unmount();

            expect(unobserveMock).toHaveBeenCalledTimes(1);
        });

        it("should show the loading text while fetching the next page", () => {
            setUpMocks({ infiniteQueryOverrides: { isFetchingNextPage: true } });

            render(<Home />);

            expect(screen.getByText(/loading more pokemons/i)).toBeInTheDocument();
        });

        it("should not show the loading text when not fetching the next page", () => {
            setUpMocks({ infiniteQueryOverrides: { isFetchingNextPage: false } });

            render(<Home />);

            expect(screen.queryByText(/loading more pokemons/i)).not.toBeInTheDocument();
        });
    });
});
