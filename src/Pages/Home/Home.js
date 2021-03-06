import { useEffect, useState } from "react";
import {Routes,Route,useNavigate} from "react-router-dom";
import { DashBoard } from "../Dashboard/DashBoard";
import { NavBar } from "../NavBar/NavBar";
import { Profile } from "../Profile/Profile";
import { Products } from "../Products/products";
import { SpecificProduct } from "../SpecificProduct/specificProduct";
import { Bin } from "../Bin/Bin";
import { API } from "../../API";

export function Home(){

    const navigate = useNavigate();

    const [info , setInfo ] = useState("");

useEffect(()=>{
    const id = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    if(id && token){
     fetch(API+"/dashboard",
           {method:"GET",
            headers:{id,token}})
     .then((response)=>{
          if(response.status === 400){
              navigate("/login");
          }
          else if(response.status === 200){
              async function getting(){
                  const reply = await response.json();
                  setInfo(reply);
              }
              getting();
          }
     })
    }else{
        navigate("/login");
    }

},[navigate]);
 

    return(
        <>
        <NavBar/>
        <Routes>
          <Route path="dashboard" element={<DashBoard info={info}/>}/>
              
          <Route path="profile" element={<Profile/>}/>

          <Route path="products" element={<Products/>}/>

          <Route path="/bin" element={<Bin/>}/>
    
          <Route path="products/:slug" element={<SpecificProduct/>}/>

          <Route path="*" element={<h1>404</h1>}/>
        </Routes>
        </>
    )
}