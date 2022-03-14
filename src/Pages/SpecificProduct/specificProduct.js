import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row , Col, Button , Form } from "reactstrap"
import { API } from "../../API";
import { InputComponent } from "../../components/inputComponent/inputComponent";

export function SpecificProduct(){

    const navigate = useNavigate();

    const {slug} = useParams();

    const [product,setProduct] = useState(""); // to get the product details;

    //for preview purposes;
    const [src,setSrc] = useState(product.image); //to preview selected image

    //for getting only updated values
    const [updatedDetails , setupdatedDetails] = useState({}); //to get the values updated

    //to turn edit mode on and off
    const [edit,setEdit] = useState(false); //to make it editable

    //to check perticularly for image slection and updation
    const [updatedImage,setUpdatedImage] = useState({}); //to get selected image;

    //to trigger useEffect after updation
    const [postUpdation,setPostUpdation] = useState(false);

    useEffect(()=>{
        const id = sessionStorage.getItem("id");
        const token = sessionStorage.getItem("token");

        if(id && token ){
          toast.loading("getting the product info");
            fetch(`${API}/products/${slug}`,
                  {method:"GET",
                   headers:{"Content-Type":"application/json",id,token}})
            .then((response)=>{
                toast.remove();
                if(response.status === 400){
                toast.error("Couldnt get the info, please try after some times");
                return navigate("/products");
                }
                if(response.status === 200){
                    toast.success("got the product info!!!");
                    async function details(){
                        const details = await response.json();
                       setProduct(details.productDetails); //updating product details
                       setupdatedDetails({status:details.productDetails.status}); //setting default status to make radio buttons work
                       setSrc(`${API}/${details.productDetails.image}`); //to initially set src to product's image
                       setUpdatedImage({});
                       setEdit(false);
                       return;
                    }
                    return details();
                }

            })
      }
},[navigate,slug,postUpdation]);


   

    //  console.log(product,src,updatedImage,updatedDetails);

    const handleChange = (e)=>{

    if(e.target.files){
    //    console.log(e.target.files[0]);
           if(e.target.files[0]){
              const fileURL = URL.createObjectURL(e.target.files[0]);
                    //    console.log(fileURL);
              setSrc(fileURL);
              return setUpdatedImage({...updatedImage,[e.target.name]:e.target.files[0]});

           }
        //    if select is opened and cancelled
           setSrc(`${API}/${product.image}`)
           return delete updatedImage.image;
    //    const data = new FormData;
    //    data.append("image",e.target.files[0]);
    //    console.log(data);
       }

    if(e.target.type === "radio"){
        if(e.target.value === "true"){
            return setupdatedDetails({...updatedDetails,[e.target.name]:true});
        }else{
            return setupdatedDetails({...updatedDetails,[e.target.name]:false});
        }

    }

    if(e.target.type === "number"){
        return setupdatedDetails({...updatedDetails,[e.target.name]:(+e.target.value)});
      } 
    
    return setupdatedDetails({...updatedDetails,[e.target.name]:e.target.value});

}


    const reset=(e)=>{
       e.target.parentNode.children[2].firstChild.value = "";
       setSrc(`${API}/${product.image}`);
       return delete updatedImage.image;
    }

    const handleSubmit = (e)=>{
        e.preventDefault();

  async function submit(){
       const id = sessionStorage.getItem("id");
       const token = sessionStorage.getItem("token");
     if(id && token ){
         let path = {};
        if(updatedImage.image){
            toast.loading("updating product image");

            const data = new FormData();
            data.append("image",updatedImage.image);

         const response = await fetch(`${API}/products/uploadSingle/`,{method:"POST",headers:{id,token},body:data});
            toast.remove();
          if(response.status === 400){
                  return  toast.error("image upload failed , try again later");
            }else if(response.status === 200){
                  toast.success("image uplaod success!!!");
                   path = await response.json();
                 // setupdatedDetails({...updatedDetails,...path});
                  // console.log("executes this function 1",updatedDetails,path);
                         //setProduct({...product,image:path});
                   }
            }
          toast.remove();
          toast.loading("updating the product details");
        //   console.log(path , "line 124");
        const response = await fetch(`${API}/products/${slug}`,{method:"PUT",headers:{"Content-Type":"application/json",id,token,oldPath:(path.image)?product.image:""},body:JSON.stringify({...updatedDetails,...path})});
        toast.remove();
        if(response.status === 400){
           return toast.error("Couldnt update the details, please try after some times");
        }
        if(response.status === 200){
            toast.success("updated the details!!!");
            setPostUpdation(!postUpdation);
            // console.log("executes this function 2",product,updatedDetails);
            return ;
        }         
      }
    }
  submit();
};

    const productUpdate = ()=>{
        const id = sessionStorage.getItem("id");
        const token = sessionStorage.getItem("token");
        if(id && token){
        toast.loading("moving to bin");
        fetch(`${API}/products/${slug}`,{method:"PUT",headers:{"Content-Type":"application/json",id,token},body:JSON.stringify({isBin:!product.isBin})})
        .then((response)=>{
            toast.remove();
            if(response.status === 400){
                return toast.error("Couldn't move the product to bin");
            }
            else if(response.status === 200){
                toast.success("moved to bin");
                return setPostUpdation(!postUpdation);
            }
        })
      }
    };

    const deleteProduct = ()=>{
        const id = sessionStorage.getItem("id");
        const token = sessionStorage.getItem("token");
        if(id && token){
        toast.loading("moving to bin");
        fetch(`${API}/products/delete`,{method:"DELETE",headers:{"Content-Type":"application/json",id,token,image:product.image},body:JSON.stringify({slug:product.slug})})
        .then((response)=>{
            toast.remove();
            if(response.status === 400){
                return toast.error("Couldn't delete the product");
            }
            else if(response.status === 200){
                toast.success("successfully deleted the product");
                return navigate("/products");
            }
        })
      }
    }

const imageStyle = {width:"50vh",height:"50vh",objectFit:"contain"};

    return(
        <>
     {product
       ?
        <Container fluid className="border bg-primary p-4 pb-5" xs="1">
        <Form onSubmit={handleSubmit} >
          <Row className="bg-primary">
              <Col className="col-auto p-5">
                {(edit)
                  ?<>
                   <h2 className="text-white"><b>Preview</b></h2>                
                   <img style={imageStyle} src={`${src}`} alt="Preview"></img>
                   <InputComponent 
                                   typing={handleChange} 
                                   label="Image" 
                                   name="image" 
                                   type="file" 
                                   encType="multipart/form-data"
                                   accept="image/*" />

                      {(updatedImage.image)
                          ?<Button className="col-12 bg-danger" onClick={reset}>Clear</Button>
                          :""}
                   </>
                  :<img style={imageStyle} src={`${API}/${product.image}`} alt={product.title}></img>}
              </Col>
              
             
              <Col style={{minWidth:"50vw"}} className="p-5 bg-dark">
                <Row>
                   <Col className="text-white">
                      {(edit)
                       ?<InputComponent label="Title" 
                                        name="title" 
                                        defaultValue={product.title} 
                                        type="text" 
                                        required={true}
                                        typing={handleChange} />
                       :<h1><b>{product.title}</b></h1>}
                       
                      {(edit)
                       ? <Row className="col-8">
                           <Row>
                               <h2 className="text-white">
                                   Availability
                               </h2>
                           </Row >
                            <Col >
                              <InputComponent label="Available" 
                                              name="status" 
                                              defaultValue={true} 
                                              type="radio" 
                                              required={true}
                                              checked={(updatedDetails.status) ? true : false}
                                              typing={handleChange}/>
                            </Col>
                           <Col>
                             <InputComponent label="Out Of Stock" 
                                             name="status" 
                                             value={false} 
                                             type="radio" 
                                             required={true}
                                             checked={(updatedDetails.status) ? false : true}
                                             typing={handleChange}/>
                           </Col>
                         </Row>
                       :
                       <b className={(product.status)?"bg-success text-white border":"bg-danger text-white border"}>
                           {(product.status)?"Available":"Out Of Stock"}
                        </b>}
                    
                   </Col>
                </Row>

                <br/>

                <Row className="text-white">
                  {(edit)
                    ?<InputComponent style={{height:"10rem"}}
                                     label="Description" 
                                     name="description" 
                                     defaultValue={product.description} 
                                     typing={handleChange} 
                                     required={true}
                                     type="textarea"/>
                    :<h4>{product.description}</h4>}
                   
                </Row>

                <br/>

                <Row className="text-white">
                    {(edit)
                      ?<InputComponent label="Price" 
                                       name="price" 
                                       defaultValue={product.price} 
                                       typing={handleChange}
                                       required={true} 
                                       type="number"/>
                      :<h3>Price - <b>${product.price}</b></h3>}
                    
                </Row>

                <br/>

                <Row>
                    {(edit)
                       ?<Row>
                           <Col className="col-lg-6">
                           <Button className="col-5 bg-success" 
                                   type="submit">
                                       Update
                           </Button>
                            {" "}
                            <Button className="col-5 bg-danger" 
                                    type="button" 
                                    onClick={()=>{setEdit(false);
                                                  setSrc(`${API}/${product.image}`);
                                                  setupdatedDetails({});
                                                  setUpdatedImage({})}}>
                                        Cancel
                            </Button>
                           </Col>
                       </Row>
                       :<Button className="col-sm-3" 
                                type="button" 
                                onClick={()=>setEdit(true)}>
                          Edit
                        </Button>
                    }
                </Row>
                <br/>
                <Row>
                {(product.isBin)
                  ?
                  <Button type="button" onClick={productUpdate} className="bg-success col-sm-3">
                       Restore to list
                  </Button>
                  : 
                  <Button onClick={productUpdate} className="bg-danger col-sm-3" 
                          type="button">
                        Move to Bin
                  </Button>
                   }
                </Row>
                <br/>
                <Row>
                   {(product.isBin === true)
                      ? <Button type="button" className="bg-danger col-sm-3" onClick={deleteProduct}>
                           delete Permanently
                        </Button>
                      :""}
                </Row>
              </Col>   
          </Row>
        </Form>
        </Container>
    :""}
        </>
    )
};