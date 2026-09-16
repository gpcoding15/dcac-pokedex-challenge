import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/team">Favorites</Link>
            <Link to="/compare">Compare</Link>
        </nav>
    );
};