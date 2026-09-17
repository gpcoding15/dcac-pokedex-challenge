import { buildStatsChartData } from "./buildStatsChartData";

const buildPokemon = (stats) => ({ stats });

describe("buildStatsChartData", () => {
    it("should map each stat key to its friendly display label", () => {
        const statNames = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
        const pokemon1 = buildPokemon(statNames.map((name) => ({ stat: { name }, base_stat: 1 })));
        const pokemon2 = buildPokemon(statNames.map((name) => ({ stat: { name }, base_stat: 1 })));

        const chartData = buildStatsChartData(pokemon1, pokemon2);

        expect(chartData.map((entry) => entry.stat)).toEqual([
            "HP",
            "Attack",
            "Defense",
            "Sp. Atk",
            "Sp. Def",
            "Speed",
        ]);
    });

    it("should pair each stat entry with both pokemon's base_stat at the same position", () => {
        const pokemon1 = buildPokemon([{ stat: { name: "speed" }, base_stat: 90 }]);
        const pokemon2 = buildPokemon([{ stat: { name: "speed" }, base_stat: 65 }]);

        const chartData = buildStatsChartData(pokemon1, pokemon2);

        expect(chartData).toEqual([{ stat: "Speed", pokemon1: 90, pokemon2: 65 }]);
    });

    it("should fall back to the raw stat name when it has no known friendly label", () => {
        const pokemon1 = buildPokemon([{ stat: { name: "accuracy" }, base_stat: 100 }]);
        const pokemon2 = buildPokemon([{ stat: { name: "accuracy" }, base_stat: 100 }]);

        const chartData = buildStatsChartData(pokemon1, pokemon2);

        expect(chartData[0].stat).toBe("accuracy");
    });

    it("should produce one entry per stat on the first pokemon", () => {
        const pokemon1 = buildPokemon([
            { stat: { name: "hp" }, base_stat: 1 },
            { stat: { name: "attack" }, base_stat: 2 },
            { stat: { name: "defense" }, base_stat: 3 },
        ]);
        const pokemon2 = buildPokemon([
            { stat: { name: "hp" }, base_stat: 1 },
            { stat: { name: "attack" }, base_stat: 2 },
            { stat: { name: "defense" }, base_stat: 3 },
        ]);

        const chartData = buildStatsChartData(pokemon1, pokemon2);

        expect(chartData).toHaveLength(3);
    });
});
