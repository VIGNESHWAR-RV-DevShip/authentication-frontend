import { Container } from "reactstrap";

export function DashBoard({info}){
    return(
        <>
        <Container fluid>
          <h1>Hii {info.firstName} {info.lastName}!!!</h1>
          <p>How was the day,today??</p>
        </Container>
        </>
    )
}