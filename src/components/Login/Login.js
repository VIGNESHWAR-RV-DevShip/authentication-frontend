import { Button,Container,Input, InputGroup } from "reactstrap";
export function Login(){

    return(
        <>
          <Container className="bg-primary border" fluid>
          <h1>login Page</h1>
          <p>check</p>
          <Input placeholder="enter user name"/>
          <br/>
          <Input placeholder="enter password"/>
          <br/>
          <Button className="bg-dark">Login</Button>
          </Container>
        </>
    )
}