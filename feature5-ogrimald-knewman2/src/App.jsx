import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles.css'
//import * as Env from './environments.js'
import { BrowserRouter as Router } from "react-router-dom";
import Parse from 'parse';
import Components from './Components/Components.jsx';
import Header from './Components/Header/Header.jsx';

const Env = {
  APPLICATION_ID: "nPvieL2fzxOb5pCM3vijxMyhyV7rjdwv3AmFDaNw",
  JAVASCRIPT_KEY: "zJ9PtsCNRyiYJNBfprgDyICsFktQSToeYWk3OHaU",
  SERVER_URL: "https://parseapi.back4app.com",
}

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Components />
      </Router>
    </div>
  )
}

export default App
