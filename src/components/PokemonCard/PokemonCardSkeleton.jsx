import styles from "./PokemonCard.module.css";

export const PokemonCardSkeleton = () => {
    return (
        <li className={styles.card}>
            <div className={styles.skeletonNumber}></div>
            <div className={styles.skeletonName}></div>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonType}></div>
        </li>
    )
}