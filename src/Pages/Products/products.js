import { useEffect, useState } from "react";
import {Table,Container,Button, Form,Row,Col } from "reactstrap";
import { ListComponent } from "../../components/ListComponent/ListComponent";
import { InputComponent } from "../../components/inputComponent/inputComponent";
import { API } from "../../API";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function Products(){

  const navigate = useNavigate();

  const [lists,setLists] = useState([]);

  const [add,setAdd] = useState(false);
  const previewImage = "https://th.bing.com/th/id/R.02ae2ac8756f6d11ddf4511dcc7d441d?rik=%2bTqWpr39FfVOyQ&riu=http%3a%2f%2fres.freestockphotos.biz%2fpictures%2f8%2f8040-illustration-of-a-sneak-preview-sign-pv.png&ehk=sVH9BG0swFr4%2ba1N2hmj87pp4JWp0XGqA10k67nxTyE%3d&risl=&pid=ImgRaw&r=0";
  const [src,setSrc] = useState(previewImage);
  const [newImage , setNewImage] = useState({});
  const [newProduct , setNewProduct] = useState({});

  const [postUpdation,setPostUpdation] = useState(false);

  useEffect(()=>{
      const id = sessionStorage.getItem("id");
      const token = sessionStorage.getItem("token");

      if(id && token){
         fetch(`${API}/products/`,{method:"GET",headers:{id,token}})
         .then((response)=>{
           if(response.status === 400){
             return navigate("/dashboard");
           }
           else if(response.status === 200){
             return response.json();
           }
         })
         .then((data)=>{
              setAdd(false);
              setSrc(previewImage);
              setNewImage({});
              setNewProduct({});
             return setLists(data)});
      }
  },[navigate,postUpdation]);

    // const Inputs = [
    //     {title:"Iphone 12 Pro Max",
    //     description:"This is the most good product.",
    //     price:85,
    //     status:true,
    //     slug:"Iphone-12-pro-max"
    //     },
    
    //     {title:"Mi Note 10 Ultra",
    //     description:"This is the most good product.",
    //     price:75,
    //     status:true,
    //     slug:"Mi-note-10-Ultra"},
    
    //     {title:"POCO F1",
    //     description:"The Xiaomi Pocophone F1 is a smartphone developed by Xiaomi Inc, a Chinese electronics company based in Beijing. It was announced on 22 August 2018 in New Delhi, India. Though part of Xiaomi's line of mid-range devices, it is equipped with high-end specifications. The device is available globally in limited numbers, except for India where it enjoys wide availability. The Pocophone was often considered to be a flagship model of the Redmi line of 2019, although officially marketed as a separate and distinct model.",                                  
    //     price:66,
    //     status:true,
    //     slug:"Poco-F1"},
    
    //      {title:"Asus Rog Phone 5",
    //      description:"This is the most good product.",
    //      price:80,
    //      status:true,
    //      slug:"Asus-Rog-phone-5"}];

        //  console.log(newProduct);
    const handleChange=(e)=>{
        if(e.target.files){
        //    console.log(e.target.files[0]);
               if(e.target.files[0]){
                  const fileURL = URL.createObjectURL(e.target.files[0]);
                        //    console.log(fileURL);
                  setSrc(fileURL);
                  return setNewImage({...newImage,[e.target.name]:e.target.files[0]});
    
               }
            //    if select is opened and cancelled
               setSrc(previewImage);
               return delete newImage.image;
        //    const data = new FormData;
        //    data.append("image",e.target.files[0]);
        //    console.log(data);
           }
    
        if(e.target.type === "radio"){
            if(e.target.value === "true"){
                return setNewProduct({...newProduct,[e.target.name]:true});
            }else{
                return setNewProduct({...newProduct,[e.target.name]:false});
            }
    
        }
        
        if(e.target.type === "number"){
          return setNewProduct({...newProduct,[e.target.name]:(+e.target.value)});
        } 

        return setNewProduct({...newProduct,[e.target.name]:e.target.value});
    }

    const reset=(e)=>{
      e.target.parentNode.children[2].firstChild.value = "";
      setSrc(previewImage);
      return delete newImage.image;
   }


    const handleSubmit=(e)=>{
      e.preventDefault();

       
    
      // console.log(newProduct);
      const id = sessionStorage.getItem("id");
      const token = sessionStorage.getItem("token");

      if(id && token){
        toast.loading("uploading the image");
          const data = new FormData();
          data.append("image",newImage.image);
        //  let path = {};
            fetch(`${API}/products/uploadSingle/`,{method:"POST",headers:{id,token},body:data})
            .then((response)=>{
              toast.remove();
              if(response.status === 400){
                return toast.error("Couldn't upload image, please try again after some time");
              }
              else if(response.status === 200){
                toast.success("Image uploaded successfully");
                 return response.json();
              }
            })
            .then((path)=>{
                     toast.loading("adding product info");
                    const slug = {slug:(newProduct.title.split(" ").join("-"))};
                    //  console.log(path);
                    //  console.log({...slug,...newProduct,...path,isBin:false});
                   fetch(`${API}/products/add`,
                      {method:"POST",
                       headers:{"Content-Type":"application/json",id,token},
                      body:JSON.stringify({...newProduct,...path,...slug,isBin:false})})
                   .then((response)=>{
                    toast.remove();
                    if(response.status === 400){
                       return toast.error("Couldnt add the product, please try after some times");
                    }
                    if(response.status === 200){
                        toast.success("added the new product!!!");
                        setPostUpdation(!postUpdation);
                        return ;
                      }
                   })
                })
          }
    }

    const imageStyle = {width:"100%",height:"46vh",objectFit:"contain"};

    return(
    <Container className="p-5 border bg-primary" fluid>
  <Table className="bg-dark" hover borderless>
         <thead className="bg-dark text-white">
           <tr>
             <th className="col-3">
               <h2>Title</h2>
             </th>
             <th className="col-5">
               <h2>Description</h2>
             </th>
             <th className="col-2">
                 <h2>Price</h2>
             </th>
             <th className="col-2">
                 <h2>Status</h2>
             </th>
           </tr>
        </thead>
        <tbody>   
        {lists.map((list,index)=><ListComponent key={index} {...list}/>)}
        </tbody>
    </Table>
    <hr className=" bg-white"/>
  {(add===false)
    ?
      <Button onClick={()=>setAdd(true)} className="bg-success border">
        Add New Product
      </Button>
   : 
     <>
     <Row>
       <Col>
          <h1 className="text-white px-3"><b>Add New Product</b></h1>
       </Col>
       <Col style={{display:"flex",justifyContent:"end",alignItems:"center"}}>
          <Button className="bg-danger col-lg-3" onClick={()=>setAdd(false)}>
            Cancel
          </Button>
       </Col>
     </Row>
      <Form className="bg-dark p-5" onSubmit={handleSubmit}>
       <Row className="p-4" xs="1" sm="1" md="1" lg="2">
          <Col>
          <h2 className="text-white">Preview</h2>
          <img style={imageStyle} className="text-white" src={src} alt="preview"></img>
          <InputComponent required={true}
                      typing={handleChange} 
                      label="Image" 
                      name="image" 
                      type="file" 
                      encType="multipart/form-data"
                      accept="image/*" /> 
          {(newImage.image)
              ?<Button className="col-12 bg-danger" onClick={reset} type="button" >clear</Button>
              :""}
          </Col>
          <Col style={{display:"grid",alignContent:"space-evenly"}}>
            <h2 className="text-white">Title</h2>
          <InputComponent label="Title" 
                                 name="title" 
                                 type="text" 
                                 required={true}
                                 typing={handleChange} />
                          <Row>              
                               <h2 className="text-white">
                                   Availability
                               </h2>
                          <Row xs="1" sm="2"> 
                            <Col>
                              <InputComponent label="Available" 
                                              name="status" 
                                              defaultValue={true} 
                                              type="radio" 
                                              required={true}
                                              typing={handleChange}/>
                            </Col>
                            <Col >
                             <InputComponent label="Out Of Stock" 
                                             name="status" 
                                             value={false} 
                                             type="radio" 
                                             required={true}
                                             typing={handleChange}/>
                            </Col>
                           </Row>
                         </Row>
                         <br/>
                <h2 className="text-white">Description</h2>
                <InputComponent style={{height:"12rem"}}
                                label="Description" 
                                name="description"
                                typing={handleChange} 
                                required={true}
                                type="textarea"/>
                          <br/>
                <h2 className="text-white">Price</h2>
                <InputComponent label="Price" 
                                 name="price"
                                 typing={handleChange}
                                 required={true} 
                                 type="number"/>
          </Col>
          
       </Row>
       <Button type="submit" className="bg-success border col-12"><b>Add product</b></Button>
      </Form>
    </>
   }
  </Container>)
};