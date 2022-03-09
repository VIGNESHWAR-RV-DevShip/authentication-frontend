import { Container,Col,Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

export function NavBar(){
    const navigate = useNavigate();
    return(
        <>
        <Container fluid className=" bg-primary p-2 ">
           <h1>Menu</h1>
               <Col className="col-auto">
               <Button className="bg-success text-white border"
                       onClick={()=>navigate("dashboard")}>🏠</Button>
                 {" "}
                <Button className="bg-success text-white border"
                       onClick={()=>navigate("profile")}>
                        Profile
                </Button>
               </Col>
        </Container>
        </>
    )
}