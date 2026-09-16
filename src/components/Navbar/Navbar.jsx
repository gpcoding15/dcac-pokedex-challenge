import { Link } from "react-router-dom";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export const Navbar = () => {
    const isOnline = useOnlineStatus();
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/team">Favorites</Link>
            <Link to="/compare">Compare</Link>

            <span>
                {isOnline ? "Online" : "Offline"}
            </span>
        </nav>
    );
};