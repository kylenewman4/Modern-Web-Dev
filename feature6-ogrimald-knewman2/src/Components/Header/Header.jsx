import { BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";

const Header = () => {
  return (
    <header className="text-white">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="m-0">Meme Word Games</h2>
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link text-white custom-hover" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white custom-hover" to="/memes">Meme List</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white custom-hover" to="/games">Game List</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white custom-hover" to="/crossword">Crossword</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white custom-hover" to="/hangman">Hangman</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header;