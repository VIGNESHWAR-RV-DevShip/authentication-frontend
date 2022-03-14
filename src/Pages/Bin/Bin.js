import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container,Table } from "reactstrap";
import { API } from "../../API";
import { ListComponent } from "../../components/ListComponent/ListComponent";

export function Bin(){

    const navigate = useNavigate();

    const [lists , setLists] = useState([]);

    useEffect(()=>{
        const id = sessionStorage.getItem("id");
        const token = sessionStorage.getItem("token");
  
        if(id && token){
           fetch(`${API}/products/bin`,{method:"GET",headers:{id,token}})
           .then((response)=>{
             if(response.status === 400){
               return navigate("/dashboard");
             }
             else if(response.status === 200){
               return response.json();
             }
           })
           .then((data)=>{
               return setLists(data)});
        }
    },[navigate]);

    return(
        <Container className="p-5 border bg-primary" fluid>
        <Table className="bg-dark" hover borderless>
               <thead className="bg-dark text-white">
                 <tr>
                   <th className="col-3">
                     <h2>Title</h2>
                   </th>
                   <th className="col-5">
                     <h2>Description</h2>
                   </th>
                   <th className="col-2">
                       <h2>Price</h2>
                   </th>
                   <th className="col-2">
                       <h2>Status</h2>
                   </th>
                 </tr>
              </thead>
              <tbody>   
              {lists.map((list,index)=><ListComponent key={index} {...list}/>)}
              </tbody>
          </Table>
        </Container>
    )
}