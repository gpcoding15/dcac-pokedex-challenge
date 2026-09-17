const STAT_LABELS = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
};

export const buildStatsChartData = (pokemon1, pokemon2) =>
    pokemon1.stats.map((stat, index) => ({
        stat: STAT_LABELS[stat.stat.name] ?? stat.stat.name,
        pokemon1: stat.base_stat,
        pokemon2: pokemon2.stats[index].base_stat,
    }));
