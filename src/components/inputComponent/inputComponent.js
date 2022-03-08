import { useState } from "react"
import { FormFeedback, FormGroup,Input } from "reactstrap"

export function InputComponent({label,
                               name,
                               type,
                               typing,
                               pattern,
                               errorMessage,
                               validMessage,
                               ...inputprops}){

    const [validation,setValidation] = useState({valid:false,invalid:false});

    const handleChange = (e)=>{
        typing(e);

        if(!pattern){
            return ;
        }

        if(e.target.type === "select-one"){ 
            if(pattern.includes(e.target.value)){
              return   setValidation({valid:true,invalid:false});
            }
        }

      if(new RegExp(pattern).test(e.target.value)){
          return  setValidation({valid:true,invalid:false});    
        }
    }

    const handleFocus = (e)=>{

        if(e.target.type === "select-one"){
            if(!pattern.includes(e.target.value)){
               return  setValidation({valid:false,invalid:true});
            }else{
            return ;
            }
        }

         if(!new RegExp(pattern).test(e.target.value)){
           return  setValidation({valid:false,invalid:true});
        }
    }

    return(
        <FormGroup floating className="col-lg-4">
            {(type === "select")
                 ?
                     <Input name={name}
                     type={type}
                     id={name}
                     onBlur={handleFocus}
                     onChange={handleChange}
                     {...inputprops} 
                     invalid={validation.invalid}
                     valid={validation.valid}>

                     {inputprops.options.map((option,index)=>
                         <option key={index} hidden={option[1]}>
                               {option[0]}
                         </option>)}

                    </Input>
                 :
                  <Input name={name}
                         type={type}
                         id={name}
                         onBlur={handleFocus}
                         onChange={handleChange}
                         {...inputprops} 
                         invalid={validation.invalid} 
                         valid={validation.valid}/>
                         
                }
              
             <label htmlFor={name}>{label}</label>

             {(validation.invalid)
                 ?<FormFeedback invalid="true">
                    {errorMessage}
                  </FormFeedback>
                 :""}
              {(validation.valid)
                  ?<FormFeedback valid>
                    {validMessage}
                   </FormFeedback>
                  :""}
                  
        </FormGroup>
    )
}