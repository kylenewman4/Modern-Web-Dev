import Home from "./Home/Home.jsx";
import MemeList from "./MemeList/MemeList.jsx";
import Header from "./Header/Header.jsx"
import GameList from "./GameList/GameList.jsx"
import AuthModule from "./Auth/Auth.jsx";

import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

export default function Components () {
    return (
        <Routes>
            <Route path="/" element={<AuthModule />} />
            <Route path="/home" element={<Home />} />
            <Route path="/memes" element={<MemeList />} />
            <Route path="/games" element={<GameList />} />
        </Routes>
    )
}