import { useFavorites } from "../../hooks/useFavorites";
import { FavoritePokemon } from "../../components/FavoritePokemon/FavoritePokemon";

export const Team = () => {
    const { favoriteIds } = useFavorites();

    return (
        <main>
            <h1>Favorites</h1>

            <p>{favoriteIds.length} / 6 Pokémon</p>

            {favoriteIds.length === 0 ? (
                <p>No favorite Pokémons on your list yet.</p>
            ) : (
                <div>
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