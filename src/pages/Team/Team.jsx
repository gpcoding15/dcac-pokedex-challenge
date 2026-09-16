import { useFavorites } from "../../hooks/useFavorites";
import { FavoritePokemon } from "../../components/FavoritePokemon/FavoritePokemon";
import styles from "./Team.module.css";

export const Team = () => {
    const { favoriteIds } = useFavorites();

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <h1>Favorites</h1>
                <p className={styles.count}>{favoriteIds.length} / 6 Pokémon</p>
            </header>

            {favoriteIds.length === 0 ? (
                <p className={styles.empty}>No favorite Pokémons on your list yet.</p>
            ) : (
                <div className={styles.grid}>
                    {favoriteIds.map((pokemonId) => (
                        <FavoritePokemon
                            key={pokemonId}
                            pokemonId={pokemonId}
                        />
                    ))}
                </div>
            )}
        </main>
    );
};
