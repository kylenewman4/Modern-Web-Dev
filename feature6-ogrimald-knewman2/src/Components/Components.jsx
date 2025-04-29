import Home from "./Home/Home.jsx";
import MemeList from "./MemeList/MemeList.jsx";
import Header from "./Header/Header.jsx";
import GameList from "./GameList/GameList.jsx";
import Hangman from "./Hangman/Hangman.jsx";
import AuthModule from "./Auth/Auth.jsx";
import AuthRegister from "./Auth/AuthRegister.jsx";
import AuthLogin from "./Auth/AuthLogin.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import CrosswordGame from "./Crossword/Crossword.jsx";

export default function Components () {
    return (
        <Routes>
            <Route path="/" element={<AuthModule />} />
            <Route path="/auth" element={<AuthModule />} />
            <Route path="/auth/register" element={<AuthRegister />} />
            <Route path="/auth/login" element={<AuthLogin />} />
            <Route path="/home" element={<ProtectedRoute path="/home" element={Home} />}/>
            <Route path="/memes" element={<ProtectedRoute path="/memes" element={MemeList} />}/>
            <Route path="/games" element={<ProtectedRoute path="/games" element={GameList} />}/>
            <Route path="/hangman" element={<ProtectedRoute path="/hangman" element={Hangman} />} />
            <Route path="/crossword" element={<ProtectedRoute path="/crossword" element={CrosswordGame} />}/>
        </Routes>
    )
}