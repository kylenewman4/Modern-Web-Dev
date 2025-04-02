import Home from "./Home/Home.jsx";
import MemeList from "./MemeList/MemeList.jsx";
import Header from "./Header/Header.jsx"
import GameList from "./GameList/GameList.jsx"
import AuthModule from "./Auth/Auth.jsx";
import AuthRegister from "./Auth/AuthRegister.jsx";
import AuthLogin from "./Auth/AuthLogin.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";

import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

export default function Components () {
    return (
        <Routes>
            <Route path="/" element={<AuthModule />} />
            <Route path="/auth" element={<AuthModule />} />
            <Route path="/auth/register" element={<AuthRegister />} />
            <Route path="/auth/login" element={<AuthLogin />} />
            <Route path="/home" element={<Home />} />
            <Route path="/memes" element={<MemeList />} />
            <Route path="/games" element={<GameList />} />
        </Routes>
    )
}