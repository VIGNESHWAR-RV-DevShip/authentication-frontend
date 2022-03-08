import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container,Button,Col, Form } from "reactstrap";
import { InputComponent } from "../../components/inputComponent/inputComponent";

export function SignUp(){

    const [newUser,setNewUser] = useState({});

    console.log(newUser);

    const navigate = useNavigate();

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
        required:true,
        pattern:regExp.firstName},
 
        {name:"lastName",
        type:"text",
        label:"Last Name",
        placeholder:"Enter your Last Name Here",
        errorMessage:"Enter a valid Last Name",
        validMessage:"Looks good",
        required:true,
        pattern:regExp.firstName},
 
        {name:"gender",
         type:"select",
         options:[["select an option",true],
                  ["Male"],
                  ["Female"],
                  ["not preferred to enter"]],
         label:"Gender",
         placeholder:"Enter your gender if you wish",
         validMessage:"Awesome",
         errorMessage:"Its mandatory to select",
         required:true,
         pattern:["Male",
                  "Female",
                  "not preferred to enter"]},
 
         {name:"email",
         type:"email",
         label:"Email",
         placeholder:"Enter your Email Here",
         errorMessage:"Enter a Valid Email",
         validMessage:"Looks good",
         required:true,
         pattern:regExp.email,
         autoComplete:"email"},
 
        {name:"password",
         type:"password",
         label:"Password",
         placeholder:"Enter your password Here",
         errorMessage:"Password should be minimum 8 letters with atleast(1 capital , 1 small ,1 number , 1 special character)",
         validMessage:"Looks good",
         required:true,
         pattern:regExp.password,
         autoComplete:"current-password"},
         
         {name:"confirm-Password",
         type:"password",
         label:"Confirm Password",
         placeholder:"please confirm your password",
         validMessage:"Looks good",
         errorMessage:"Passwords does not match",
         required:true,
         pattern:newUser.password,
         autoComplete:"current-password"}
    ];
 
    const handleChange = (e)=>{
        setNewUser({...newUser,[e.target.name]:e.target.value});
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log("hii");
    }

    return(
        <>
       <Container className="bg-primary p-5" fluid>   
         <Form onClick={handleSubmit}>
            <h1 className="text-dark">SIGN UP</h1>

             {Inputs.map((input,index)=>
                 <InputComponent {...input} key={index} typing={handleChange}/>
             )}
          
             <Button className="btn-success border"
                     type="submit">
                 Sign Up
             </Button>
     
              <Col>
                <label htmlFor="loginButton" className="text-warning">
                    already have account? 
                </label>
                {" "}
                <Button id="loginButton" 
                        type="button"
                        className="bg-warning"
                        onClick={()=>navigate("/login")}>
                    Login
                 </Button>
              </Col>
         </Form>
      </Container>
        </>
    )
}