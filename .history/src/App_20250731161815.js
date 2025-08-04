import {BrowserRouter , Routes, Route} from "react-router-dom"


import BodyPage from "./pages/BodyPage";

import "./styles/login.css";
import "./styles/component.css";
import "./styles/body.css";

function App() {
  return (
    <BrowserRouter>
         <BodyPage/>
    </BrowserRouter>
  );
}

export default App;
