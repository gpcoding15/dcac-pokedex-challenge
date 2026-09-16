import { comparisonSchema } from "./comparisonSchema";

describe("comparisonSchema", () => {
    it("should be valid when both pokemon are selected and different", () => {
        const values = { pokemon1: "pikachu", pokemon2: "bulbasaur" };

        expect(comparisonSchema.isValidSync(values)).toBe(true);
    });

    describe("pokemon1", () => {
        it("should be invalid when pokemon1 is missing", () => {
            const values = { pokemon1: "", pokemon2: "bulbasaur" };

            expect(comparisonSchema.isValidSync(values)).toBe(false);
        });

        it("should return the correct error message when pokemon1 is missing", () => {
            const values = { pokemon1: "", pokemon2: "bulbasaur" };

            expect(() => comparisonSchema.validateSync(values)).toThrow("Select the first Pokémon");
        });
    });

    describe("pokemon2", () => {
        it("should be invalid when pokemon2 is missing", () => {
            const values = { pokemon1: "pikachu", pokemon2: "" };

            expect(comparisonSchema.isValidSync(values)).toBe(false);
        });

        it("should return the correct error message when pokemon2 is missing", () => {
            const values = { pokemon1: "pikachu", pokemon2: "" };

            expect(() => comparisonSchema.validateSync(values)).toThrow("Select the second Pokémon");
        });

        it("should be invalid when pokemon2 is the same as pokemon1", () => {
            const values = { pokemon1: "pikachu", pokemon2: "pikachu" };

            expect(comparisonSchema.isValidSync(values)).toBe(false);
        });

        it("should return the correct error message when pokemon2 equals pokemon1", () => {
            const values = { pokemon1: "pikachu", pokemon2: "pikachu" };

            expect(() => comparisonSchema.validateSync(values)).toThrow("Choose two different Pokémon");
        });
    });
});
