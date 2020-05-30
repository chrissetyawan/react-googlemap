import React, { useState, useEffect } from 'react'
import ButterToast, { Cinnamon } from "butter-toast";

const EditForm = props => {
  const [ place, setPlace ] = useState(props.currentPlace)
  const [ errors, setErrors ] = useState({})

  useEffect(
    () => {
      setPlace(props.currentPlace)
    },
    [ props ]
  )
  // You can tell React to skip applying an effect if certain values haven’t changed between re-renders. [ props ]

  const handleInputChange = event => {
      const { name, value } = event.target

      if(name === "lat" || name === "lng") {
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

    if(!place.name){
       formIsValid = false;
       tempErrors["name"] = "Cannot be empty";
    }

    if(!place.category){
       formIsValid = false;
       tempErrors["category"] = "Not selected yet";
    }

    if(!place.description){
      formIsValid = false;
      tempErrors["description"] = "Cannot be empty";
    }

    if(!place.address){
      formIsValid = false;
      tempErrors["address"] = "Cannot be empty";
    }

    if(!place.coordinate.lat || place.coordinate.lat === 0){
      formIsValid = false;
      tempErrors["lat"] = "Cannot have zero value or empty";
    }

    if(!place.coordinate.lng || place.coordinate.lng === 0){
      formIsValid = false;
      tempErrors["lng"] = "Cannot have zero value or empty";
    }

    if(place.facilities.length === 0){
      formIsValid = false;
      tempErrors["facilities"] = "Cannot be empty";
    }

    if(place.images.length === 0){
      formIsValid = false;
      tempErrors["images"] = "Cannot be empty";
    }
      
    setErrors(tempErrors);
    return formIsValid;
  }

  const handleSubmit = (e) => {
      e.preventDefault();

      if(handleValidation()){
        props.updatePlace(place.id, place)
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
				placeholder="Facilities 1, Facilities 2, etc" />
			<span style={{color: "red"}}>{errors["facilities"]}</span>

			<label>Images</label>
			<textarea rows={5} name="images" value={place.images} onChange={handleInputChange} 
				placeholder="/image1.jpg, /image2.png, etc" />
			<span style={{color: "red"}}>{errors["images"]}</span>

      <br />
      <button className="btn" style={{width:'80px', height:'34px', marginTop:'20px', marginRight:'10px'}} >Update</button>
      <button  className="btn" onClick={() => props.setEditing(false)} style={{width:'80px', height:'34px', marginTop:'20px', marginRight:'10px'}} >
        Cancel
      </button>
    </form>
  )
}

export default EditForm
