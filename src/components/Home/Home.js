import { useEffect } from "react";
import {Routes,Route,useNavigate} from "react-router-dom";
import { DashBoard } from "../Dashboard/DashBoard";
import { NavBar } from "../NavBar/NavBar";
import { Profile } from "../Profile/Profile";

export function Home(){

    const navigate = useNavigate();

useEffect(()=>{
    const id = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    if(!(token && id)){
        navigate("/login");
    }

})
 



    return(
        <>
        <NavBar/>
        <Routes>
          <Route path="home" element={<DashBoard/>}/>
              
          <Route path="profile" element={<Profile/>}/>
    
          <Route path="*" element={<h1>404</h1>}/>
        </Routes>
        </>
    )
}