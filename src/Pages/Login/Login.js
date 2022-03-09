import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button,Container,Form} from "reactstrap";
import { InputComponent } from "../../components/inputComponent/inputComponent";
import { API } from "../../API";
import toast from "react-hot-toast";

export function Login(){

    const navigate = useNavigate();
    const [user,setUser] = useState({});
    
    useEffect(()=>{
        const id = sessionStorage.getItem("id");
        const token = sessionStorage.getItem("token");

        if(id && token){
             fetch(API+"/dashboard",
             {method:"GET",
              headers:{id,token}})
            .then((response)=>{
             if(response.status === 400){
                 return sessionStorage.clear();
             }
             else if(response.status === 200){
                 toast.success("you are already logged in!");
                 navigate("/dashboard");
                }})
        }

    },[]);

    const [errorMessage,setErrorMessage] = useState();

    const Inputs = [
      {name:"email",
       type:"email",
       label:"Email",
       placeholder:"Enter your Email Here",
       autoComplete:"email"
   },
      {name:"password",
       type:"password",
       label:"Password",
       placeholder:"Enter your Password Here",
       autoComplete:"current-password"  
   }
  ];

     const onChange = (e) =>{
       setErrorMessage();
       setUser({...user,[e.target.name]:e.target.value});
     }

     const handleSubmit=(e)=>{
        e.preventDefault();


        const userNameRegex = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
        const strongPasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})");
   
        if(!userNameRegex.test(user.email) 
           || 
           !strongPasswordRegex.test(user.password)){
         return setErrorMessage("invalid user credentials");
       }
        
       fetch(API+"/login",
       {method:"POST",
       headers:{"Content-Type":"application/json"},
        body:JSON.stringify(user)})
       .then((response)=>{
          if(response.status === 400){
            toast.error('Invalid credentials');
            return setErrorMessage("Invalid user credentials");
          }
          else{
            async function store(){
              const reply = await response.json();
              sessionStorage.setItem("id",reply.id);
              sessionStorage.setItem("token",reply.token);
              toast.success("welcome back user");
            return  setTimeout(()=>{
                navigate("/dashboard")
              },800);
        ;
            }
          return  store();
          }
       })

     }

    return(
        <>
          <Container className="bg-primary p-5" fluid>

            <Form onSubmit={handleSubmit} className="col-lg-4 col-md-6 col-sm-8">
                 <h1 className="text-dark">LOGIN PAGE</h1>
                 <br/>
                 {Inputs.map((input,index)=>
                   <InputComponent key={index} {...input} typing={onChange}/>
                 )}
                   {(errorMessage)
                     ?<p className="col-12 text-warning">
                        {errorMessage}
                      </p>
                     :""} 
                
                    <Button className="bg-success border"
                            type="submit" >
                           Login
                    </Button>
                    {" "}
                   <Button className="bg-secondary border" 
                           type="button"
                           onClick={()=>navigate("/signup")}>SignUp
                   </Button>
       
            </Form>
          </Container>
        </>
    )
}