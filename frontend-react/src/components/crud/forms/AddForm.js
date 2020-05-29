import React, { useState } from 'react'

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

	const handleInputChange = event => {
		const { name, value } = event.target

		if(name === "lat" || name === "lng")            
			setPlace({ 
				...place, coordinate:{...place.coordinate, [name]:value}
			})
		else
			setPlace({ ...place, [name]: value })
	}

	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				if (!place.name || !place.description) return

				props.addPlace(place)
				setPlace(initialFormState)
			}}
		>
			<label>Name</label>
			<input type="text" name="name" value={place.name} onChange={handleInputChange} />

			<label>Category</label>
			<input type="text" name="category" value={place.category} onChange={handleInputChange} />

			<label>Description</label>
			<input type="text" name="description" value={place.description} onChange={handleInputChange} />

			<label>Address</label>
			<input type="text" name="address" value={place.address} onChange={handleInputChange} />

			<label>City</label>
			<input type="text" name="city" value={place.city} onChange={handleInputChange} />

			<label>Latitude</label>
			<input type="text" name="lat" value={place.coordinate.lat} onChange={handleInputChange} />

			<label>Longitude</label>
			<input type="text" name="lng" value={place.coordinate.lng} onChange={handleInputChange} />

			<label>Facilities</label>
			<input type="text" name="facilities" value={place.facilities} onChange={handleInputChange} 
				placeholder="Use comma to separate between facilities" />

			<label>Images</label>
			<input type="text" name="images" value={place.images} onChange={handleInputChange} 
				placeholder="Use comma to separate between images" />

			<button className="btn" style={{width:'80px', height:'34px', marginTop:'20px'}} >Add new</button>
		</form>
	)
}

export default AddForm
