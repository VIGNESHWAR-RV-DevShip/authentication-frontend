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

      if(new RegExp(pattern).test(e.target.value)){
          return  setValidation({valid:true,invalid:false});    
        }
    }

    const handleFocus = (e)=>{
         if(!new RegExp(pattern).test(e.target.value)){
           return  setValidation({valid:false,invalid:true});
        }
    }

    return(
        <FormGroup floating>
            {(type === "select")
                 ?
                     <Input name={name}
                            className="text-primary border"
                            type={type}
                            id={name}
                            onBlur={handleFocus}
                            onChange={handleChange}
                            pattern={pattern}
                            {...inputprops}
                            invalid={validation.invalid}
                            valid={validation.valid}>

                     {inputprops.options.map((option,index)=>
                         <option key={index} 
                                 value={option.value} 
                                 hidden={option.hidden}
                                 selected={option.selected}>
                               {option.name}
                         </option>)}

                    </Input>
                 :
                  <Input name={name}
                         type={type}
                         className="text-primary border"
                         id={name}
                         onBlur={handleFocus}
                         onChange={handleChange}
                         pattern={pattern}
                         {...inputprops}
                         invalid={validation.invalid} 
                         valid={validation.valid}/>
                         
                }
              
             <label htmlFor={name} className="text-dark">{label}</label>

             {(validation.invalid)
                 ?<FormFeedback className="bg-danger text-white" invalid="true">
                    {errorMessage}
                  </FormFeedback>
                 :""}
              {(validation.valid)
                  ?<FormFeedback className="bg-success text-white" valid>
                    {validMessage}
                   </FormFeedback>
                  :""}
                  
        </FormGroup>
    )
}