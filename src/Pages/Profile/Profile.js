import { useEffect, useState } from "react";
import { API } from "../../API";
import { InputComponent } from "../../components/inputComponent/inputComponent";
import {Row,Button, Container, Col} from "reactstrap";
export function Profile(){

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
       console.log("error");
   }
   else if(response.status === 200){
       async function getting(){
           const reply = await response.json();
           setUserInfo(reply);
       }
       getting();
   }
})
},[]);

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
    validMessage:"Looks good",
    defaultValue:userInfo.firstName,
    required:true,
    disabled:edit,
    pattern:regExp.firstName},

    {name:"lastName",
    type:"text",
    label:"Last Name",
    placeholder:"Enter your Last Name Here",
    errorMessage:"Enter a valid Last Name",
    validMessage:"Looks good",
    defaultValue:userInfo.lastName,
    required:true,
    disabled:edit,
    pattern:regExp.firstName},

    {name:"gender",
     type:"select",
     options:[["Click here to select an option","",true],
              ["Male","male"],
              ["Female","female"],
              ["not preferred to enter","none"]],
     label:"Gender",
     placeholder:"Enter your gender if you wish",
     validMessage:"Awesome",
     errorMessage:"Its mandatory to select",
     defaultValue:userInfo.gender,
     required:true,
     disabled:edit,
     pattern:"([a-z]*)"},

     {name:"email",
     type:"email",
     label:"Email",
     placeholder:"Enter your Email Here",
     errorMessage:"Enter a Valid Email",
     validMessage:"Looks good",
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
    fetch(API+"/profile",
         {method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({userInfo})})
        .then((response)=>{
           if(response.status === 200){

           }
        })
    }
    return(
        <>
        <Container fluid className="p-4">
            {Inputs.map((input,index)=>
                 <InputComponent {...input} key={index} typing={handleChange}/>
             )}
             <Row>
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
        </Container>
        </>
    )
}