import { useNavigate } from "react-router-dom";

export function ListComponent({title,description,price,status,slug}){


  const navigate = useNavigate();

  const style = {cursor:"pointer"};

  return(
      <>
       <tr style={style} onClick={()=>{navigate(`/products/${slug}`)}}
            // onMouseEnter={(e)=>e.target.style.background="grey"} 
            // onMouseLeave={(e)=>e.target.style.background="steelblue"}
            className="bg-white border">

          <td className="col-3">
            <h4 className="text-dark">{title}</h4>
            </td>
          
          <td  className="col-5">
            <h5 className="text-dark">
            {description}
            </h5>
          </td>
     
          <td className="col-2">
            <h4 className="text-dark">
            {price}
            </h4>
          </td>
   
          <td className="col-2 text-white">
            <h5 style={{textAlign:"center",padding:"3% 0"}} className={(status)?"bg-success":"bg-danger"}>
            {(status)?"available":"out of stock"}
            </h5>
          </td>
         
        </tr>
      </>
  )
}