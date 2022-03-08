import './App.css';
import { Routes,Route } from "react-router-dom";
import { Login } from "./Pages/Login/Login";
import { SignUp } from './Pages/SignUp/SignUp';
import { Home } from "./Pages/Home/Home";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="login" element={<Login/>}/> 
        
        <Route path="signup" element={<SignUp/>} />
          
        <Route path="*" element={ <Home/>}/>
          
      </Routes>
    </div>
  );
}

export default App;
