import './App.css';
import { Routes,Route } from "react-router-dom";
import { Login } from "./components/Login/Login";
import { SignUp } from './components/SignUp/SignUp';
import { Home } from "./components/Home/Home";
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
