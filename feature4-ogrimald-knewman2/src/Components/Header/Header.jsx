import { BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";

const Header = () => {
    return (
        <header>
            <h2>Meme Word Games</h2>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/memes">Meme List</Link></li>
                    <li><Link to="/games">Game List</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;