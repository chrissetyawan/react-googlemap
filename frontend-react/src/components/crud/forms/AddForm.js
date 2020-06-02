import React, { useState } from 'react'
import ButterToast, { Cinnamon } from "butter-toast";

const AddForm = props => {
	const initialFormState = { 
		id: null, 
		name: "",
	  	category: "",
		description: "",
		address: "",
		city: "",
		coordinate: {
			lat: 0,
			lng: 0
		},
		facilities: [],
		images : []
	}

	const [ place, setPlace ] = useState(initialFormState)
	const [ errors, setErrors ] = useState({})
	
	const handleInputChange = event => {
		const { name, value } = event.target

		if(name === "lat" || name === "lng")  {
			setPlace({ 
				...place, coordinate:{...place.coordinate, [name]:value}
			})
		}
		else {
			setPlace({ ...place, [name]: value })
		}
	}

	const handleValidation = () => {
        let tempErrors = {};
        let formIsValid = true;

        if(!place.name || place.name.trim() ===  ""){
			formIsValid = false;
			tempErrors["name"] = "Cannot be empty";
		}
	
		if(!place.category){
			formIsValid = false;
			tempErrors["category"] = "Not selected yet";
		}
	
		if(!place.description || place.description.trim() ===  ""){
			formIsValid = false;
			tempErrors["description"] = "Cannot be empty";
		}
	
		if(!place.address || place.address.trim() ===  ""){
			formIsValid = false;
			tempErrors["address"] = "Cannot be empty";
		}

		if(!place.coordinate.lat || parseInt(place.coordinate.lat) === 0) {
			formIsValid = false;
			tempErrors["lat"] = "Cannot be zero or empty ";
		}

		if(!place.coordinate.lng || parseInt(place.coordinate.lng) === 0) {
			formIsValid = false;
			tempErrors["lng"] = "Cannot be zero or empty";
		}

		if (Array.isArray(place.facilities)) {
			if (place.facilities.length === 0) {
				formIsValid = false;
				tempErrors["facilities"] = "Input not valid";
			}
			else {
				for (const [index, facility] of place.facilities.entries()) {
					if (facility.trim() === "") {
						formIsValid = false;
						tempErrors["facilities"] = "Input not valid";
						break;
					}
				}
			}
		}
		else {
			if (place.facilities.trim() ===  "") {
				formIsValid = false;
				tempErrors["facilities"] = "Cannot be empty";
			}
			else {
				let arr = place.facilities.split(",")
				for (const [index, facility] of arr.entries()) {
					if (facility.trim() === "") {
						formIsValid = false;
						tempErrors["facilities"] = "Input not valid";
						break;
					}
				}
			}
		}
			
		if (Array.isArray(place.images)) {
			if (place.images.length === 0) {
				formIsValid = false;
				tempErrors["images"] = "Input not valid";
			}
			else {
				for (const [index, image] of place.images.entries()) {
					if (image.trim() === "") {
						formIsValid = false;
						tempErrors["images"] = "Input not valid";
						break;
					}
				}
			}
		}
		else {
			if (place.images.trim() ===  "") {
				formIsValid = false;
				tempErrors["images"] = "Cannot be empty";
			}
			else {
				let arr = place.images.split(",")
				for (const [index, image] of arr.entries()) {
					if (image.trim() === "") {
						formIsValid = false;
						tempErrors["images"] = "Input not valid";
						break;
					}
				}
			}
		}
      
		setErrors(tempErrors);
		return formIsValid;
    }

	const handleSubmit = (e) => {
        e.preventDefault();

        if(handleValidation()){
           props.addPlace(place)
		   setPlace(initialFormState)
		   
        }else{
		    ButterToast.raise({
				content: <Cinnamon.Crunch title="Error message"
					content="Failed validation"
					scheme={Cinnamon.Crunch.SCHEME_RED}
				/>
			})
        }
    }

	return (
		<form onSubmit= {handleSubmit} >
			<label>Name</label>
			<input type="text" name="name" value={place.name} onChange={handleInputChange} />
			<span style={{color: "red"}}>{errors["name"]}</span>

			<label>Category</label>
			<select name="category" onChange={handleInputChange} value={place.category} >
				<option value="" disabled>Select Category</option>
				<option value="apartment">Apartment</option>
				<option value="office">Office</option>
			</select>
			<span style={{color: "red"}}>{errors["category"]}</span>

			<label>Description</label>
			<textarea rows={4} name="description" value={place.description} onChange={handleInputChange} />
			<span style={{color: "red"}}>{errors["description"]}</span>

			<label>Address</label>
			<textarea rows={4} name="address" value={place.address} onChange={handleInputChange} />
			<span style={{color: "red"}}>{errors["address"]}</span>

			<label>City</label>
			<input type="text" name="city" value={place.city} onChange={handleInputChange} />

			<label>Latitude</label>
			<input type="text" name="lat" value={place.coordinate.lat} onChange={handleInputChange} />
			<span style={{color: "red"}}>{errors["lat"]}</span>

			<label>Longitude</label>
			<input type="text" name="lng" value={place.coordinate.lng} onChange={handleInputChange} />
			<span style={{color: "red"}}>{errors["lng"]}</span>

			<label>Facilities</label>
			<textarea rows={5} name="facilities" value={place.facilities} onChange={handleInputChange} 
				placeholder="Separated by comma, ex: facilities 1, facilities 2, etc" />
			<span style={{color: "red"}}>{errors["facilities"]}</span>

			<label>Images</label>
			<textarea rows={5} name="images" value={place.images} onChange={handleInputChange} 
				placeholder="Separated by comma, ex: /path/image1.jpg, /path/image2.png, etc" />
			<span style={{color: "red"}}>{errors["images"]}</span>

			<br />
			<button className="btn" style={{width:'80px', height:'34px', marginTop:'20px'}} >Add New</button>
		</form>
	)
}

export default AddForm
