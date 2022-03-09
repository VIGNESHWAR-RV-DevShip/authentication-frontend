import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../API";
import { InputComponent } from "../../components/inputComponent/inputComponent";
import {Row,Button, Container, Col} from "reactstrap";
import toast from "react-hot-toast";

export function Profile(){

    const navigate = useNavigate();

    const [userInfo,setUserInfo] = useState({});

    const [edit,setEdit] = useState(true);

useEffect(()=>{

    const id = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token"); 

    fetch(API+"/profile",
    {method:"GET",
     headers:{id,token}})
.then((response)=>{
   if(response.status === 400){
       navigate("/login");
   }
   else if(response.status === 200){
       async function getting(){
           const reply = await response.json();
           setUserInfo(reply);
       }
       getting();
   }
})
},[navigate]);


const regExp = {firstName:"^[a-zA-Z ]{2,}$",
                userName:"^[a-zA-Z0-9@#]{4,16}$",
                email:"^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$",
                password:"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$"
                };

const Inputs = [
    {name:"firstName",
    type:"text",
    label:"First Name",
    placeholder:"Enter your First Name Here",
    errorMessage:"Enter a valid First Name",
    defaultValue:userInfo.firstName,
    required:true,
    disabled:edit,
    pattern:regExp.firstName},

    {name:"lastName",
    type:"text",
    label:"Last Name",
    placeholder:"Enter your Last Name Here",
    errorMessage:"Enter a valid Last Name",
    defaultValue:userInfo.lastName,
    required:true,
    disabled:edit,
    pattern:regExp.firstName},

    {name:"gender",
     type:"select",
     value:userInfo.gender,
     options:[ {name:"Male",value:"male"},
               {name:"Female",value:"female"},
               {name:"not preferred to enter",value:"none"}],
     label:"Gender",
     placeholder:"Enter your gender if you wish",
     errorMessage:"Its mandatory to select",
     required:true,
     selectedoption:"male",
     disabled:edit,
     pattern:"([a-z]*)"},

     {name:"email",
     type:"email",
     label:"Email",
     placeholder:"Enter your Email Here",
     errorMessage:"Enter a Valid Email",
     defaultValue:userInfo.email,
     required:true,
     disabled:edit,
     pattern:regExp.email,
     autoComplete:"email"}
];

const handleChange = (e)=>{
    setUserInfo({...userInfo,[e.target.name]:e.target.value})
}

const update = ()=>{
    const id = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    fetch(API+"/profile",
         {method:"POST",
          headers:{"Content-Type":"application/json",
                    id,token},
          body:JSON.stringify(userInfo)})
        .then((response)=>{
           if(response.status === 200){
             toast.success("successfully updated");
             setEdit(true);
           }else{
               toast.error("couldnt update please try again sometime")
           }
        })
    }

const signOut=()=>{

        const id = sessionStorage.getItem("id");
        const token = sessionStorage.getItem("token"); 
    
        fetch(API+"/signout",
        {method:"POST",
         headers:{id,token}})
    .then((response)=>{
       if(response.status === 400){
           toast.error("server busy, please try again later");
       }
       else if(response.status === 200){
           sessionStorage.clear();
               setUserInfo({});
            navigate("/login");
            toast.success("Signed out successfully")
       }
    })
}
    return(
        <>
        <Container fluid className="p-4">
          <div className="col-lg-4 col-md-8 col-sm-12">

            {Inputs.map((input,index)=>
                 <InputComponent {...input} key={index} typing={handleChange}/>
             )}
             <Row className="p-2">
            {(edit)
              ?
              <Button className="bg-danger"
                      onClick={()=>setEdit(false)}>
                  Edit
              </Button>
              :
              <Col>
              <Button className="bg-danger col-4"
                      onClick={()=>setEdit(true)}>
                  cancel
               </Button>
               {" "}
               <Button className="bg-success col-4"
                      onClick={()=>update()}>
                  Update Changes
               </Button>
               </Col>
               }
            </Row>
            <br/>

             <Button onClick={signOut}>
                 Sign Out
             </Button>

             </div>
        </Container>
        </>
    )
}