import { useState } from "react";

const useForm = (initialFieldValues, setCurrentId) => {

    const [values, setValues] = useState(initialFieldValues)
    const [errors, setErrors] = useState({})

    const handleInputChange = e => {
        const { name, value } = e.target
        
        if(name === "lat" || name === "lng")  {
			setValues({ 
				...values, coordinate:{...values.coordinate, [name]:value}
			})
		}
        else {
            setValues({ ...values, [name]: value })
        }
        
    }

    const resetForm =() =>{
        setValues(initialFieldValues)
        setErrors({})
        setCurrentId(0)
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    };
}

export default useForm;
