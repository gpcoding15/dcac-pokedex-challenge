import { NavLink } from "react-router-dom";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import styles from "./Navbar.module.css";

export const Navbar = () => {
    const isOnline = useOnlineStatus();

    const linkClassName = ({ isActive }) =>
        `${styles.link} ${isActive ? styles.activeLink : ""}`;

    return (
        <nav className={styles.navbar}>
            <div className={styles.inner}>
                <NavLink to="/" className={styles.brand}>
                    <span className={styles.pokeball} aria-hidden="true" />
                    Pokédex
                </NavLink>

                <div className={styles.links}>
                    <NavLink to="/" end className={linkClassName}>Home</NavLink>
                    <NavLink to="/team" className={linkClassName}>Team</NavLink>
                    <NavLink to="/compare" className={linkClassName}>Compare</NavLink>
                </div>

                <span className={`${styles.status} ${isOnline ? styles.online : styles.offline}`}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    {isOnline ? "Online" : "Offline"}
                </span>
            </div>
        </nav>
    );
};
