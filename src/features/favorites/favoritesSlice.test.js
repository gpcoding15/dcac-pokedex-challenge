import favoritesReducer, { addFavorite, removeFavorite } from "./favoritesSlice";

describe("favoritesSlice", () => {
    describe("addFavorite", () => {
        it(" should add the pokemon id to an empty favorites list", () => {
            const givenState = { pokemonIds: [] };

            const result = favoritesReducer(givenState, addFavorite(25));

            expect(result.pokemonIds).toEqual([25]);
        });

        it("should not add the same pokemon id twice", () => {
            const givenState = { pokemonIds: [25] };

            const result = favoritesReducer(givenState, addFavorite(25));

            expect(result.pokemonIds).toEqual([25]);
        });

        it("should not add a new pokemon once the list already has 6 favorites", () => {
            const givenState = { pokemonIds: [1, 2, 3, 4, 5, 6] };

            const result = favoritesReducer(givenState, addFavorite(7));

            // Then
            expect(result.pokemonIds).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });

    describe("removeFavorite", () => {
        it("should remove the given pokemon id from the favorites list", () => {
            const givenState = { pokemonIds: [25, 6, 150] };

            const result = favoritesReducer(givenState, removeFavorite(6));

            // Then
            expect(result.pokemonIds).toEqual([25, 150]);
        });

        it("should do nothing when the pokemon id is not in the favorites list", () => {
            const givenState = { pokemonIds: [25, 150] };

            const result = favoritesReducer(givenState, removeFavorite(999));

            expect(result.pokemonIds).toEqual([25, 150]);
        });
    });
});
