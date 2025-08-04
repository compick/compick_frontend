import {BrowserRouter , Routes, Route} from "react-router-dom"

import LoginPage from "./pages/login/LoginUser";
import RegisterUserPage from "./pages/login/RegisterUser";
import BodyPage from "./pages/BodyPage";

import "./styles/login.css";
import "./styles/component.css";
import "./styles/body.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={ <LoginPage/> }/>
        <Route path="/regist" element={ <RegisterUserPage/> }/>
        <Route path="/" element={ <BodyPage/> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
