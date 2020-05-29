import React, { useState, useEffect } from 'react'

const EditForm = props => {
  const [ place, setPlace ] = useState(props.currentPlace)

  useEffect(
    () => {
      setPlace(props.currentPlace)
    },
    [ props ]
  )
  // You can tell React to skip applying an effect if certain values haven’t changed between re-renders. [ props ]

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
        props.updatePlace(place.id, place)
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
			<input type="text" name="lat" value={place.coordinate.lat||0} onChange={handleInputChange} />

			<label>Longitude</label>
			<input type="text" name="lng" value={place.coordinate.lng||0} onChange={handleInputChange} />

			<label>Facilities</label>
			<input type="text" name="facilities" value={place.facilities} onChange={handleInputChange} 
				placeholder="Use comma to separate between facilities" />

			<label>Images</label>
			<input type="text" name="images" value={place.images} onChange={handleInputChange} 
				placeholder="Use comma to separate between images" />


      <button className="btn" style={{width:'80px', height:'34px', marginTop:'20px', marginRight:'10px'}} >Update</button>
      <button  className="btn" onClick={() => props.setEditing(false)} style={{width:'80px', height:'34px', marginTop:'20px', marginRight:'10px'}} >
        Cancel
      </button>
    </form>
  )
}

export default EditForm
