import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../API";
import { InputComponent } from "../../components/inputComponent/inputComponent";
import {Row,Button, Container, Col,Form} from "reactstrap";
import toast from "react-hot-toast";

export function Profile(){

    //navigate route ( usehistory);
    const navigate = useNavigate();
 
     //useState for updating userInfo
    const [userInfo,setUserInfo] = useState({});

    //useState to set edit on inputs
    const [edit,setEdit] = useState(true);

    //to load the user detils while rendering the component;
useEffect(()=>{

    const id = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token"); 
  
    if(id && token){
      fetch(API+"/profile",{method:"GET",headers:{id,token}})
      .then((response)=>{
            if(response.status === 400){
                navigate("/login"); //if no such id and token redirecting to login page
            }
            else if(response.status === 200){
                async function getting(){
                    const reply = await response.json();
                    setUserInfo(reply);
                }
                getting(); //function to convert the response to data and update userInfo with data
            }})
        }else{
            navigate("/login"); //if no such id and token redirecting to login page
        }
},[navigate]);

        //regex pattern for input fields
const regExp = {firstName:"^[a-zA-Z ]{2,}$",
                userName:"^[a-zA-Z0-9@#]{4,16}$",
                email:"^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$",
                password:"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$"
                };

        //object attributes for input field
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
     autoComplete:"email"}];
 
       //updating user details while changing
const handleChange = (e)=>{
    setUserInfo({...userInfo,[e.target.name]:e.target.value})
    // updating userinfo on changing..
}

// for update changes if changes are made
const update = (e)=>{
    e.preventDefault(); //preventing form submission
    const id = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    fetch(API+"/profile",
         {method:"POST",
          headers:{"Content-Type":"application/json",
                    id,token},
          body:JSON.stringify(userInfo)})
        .then((response)=>{
           if(response.status === 200){
             toast.success("successfully updated"); //success toast
             setEdit(true); //disabling edit mode
           }else{
               toast.error("couldnt update please try again sometime"); //error toast
           }
        })
    }

    //function for signing out
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
          <Form className="col-lg-4 col-md-8 col-sm-12"
                 onSubmit={update}>

              {/* mapping input object attributes to create (input form group) */}
            {Inputs.map((input,index)=>
                 <InputComponent {...input} key={index} typing={handleChange}/>
             )}
             <Row className="p-2">
            {(edit)//checking edit to render the buttons
              ?
              <Button className="bg-danger"
                      type="button"
                      onClick={()=>setEdit(false)}>
                  Edit
              </Button>
              :
              <Col>
              {/* cancel button to set disable to inputs */}
              <Button className="bg-danger col-4"
                      type="button"
                      onClick={()=>setEdit(true)}>
                  cancel
               </Button>
               {" "}
               {/* update button to trigger update function */}
               <Button className="bg-success col-4">
                  Update Changes
               </Button>
               </Col>
               }
            </Row>
            <br/>
            {/* sign out button */}
             <Button  type="button" onClick={signOut}>
                 Sign Out
             </Button>

             </Form>
        </Container>
        </>
    )
}