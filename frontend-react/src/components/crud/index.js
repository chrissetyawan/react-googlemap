import React, { useState, useEffect, Fragment } from 'react'
import { Link } from "react-router-dom";
import AddForm from './forms/AddForm'
import EditForm from './forms/EditForm'
import Table from './tables/Table'
import './crud.css';
import API from "../../utils/api"

const crud = () => {
	const placesData = []
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

	// Setting state
	const [ places, setPlaces ] = useState(placesData)
	const [ currentPlace, setCurrentPlace ] = useState(initialFormState)
	const [ editing, setEditing ] = useState(false)

	// CRUD operations
	const addPlace = place => {
		place.facilities = place.facilities.trim().split(",")
		place.images = place.images.trim().split(",")
		API.post(`places`, place)
		  .then(res => {
			// console.log(res.data)
			place.id = res.data.id
			setPlaces([ ...places, place ])
		  })
		  .catch(err => {
			console.log("API GET : Error " + err.response);
		  });
	}

	const deletePlace = id => {
		setEditing(false)

		API.delete(`places/${id}`)
		  .then(res => {
			console.log(res.data)
			setPlaces(places.filter(place => place.id !== id))
		  })
		  .catch(err => {
			console.log("API GET : Error " + err.response);
		  });

		
	}

	const updatePlace = (id, updatedPlace) => {
		setEditing(false)
		API.put(`places/${id}`, updatedPlace)
		  .then(res => {
			console.log(res.data)
			setPlaces(places.map(place => (place.id === id ? updatedPlace : place)))
		  })
		  .catch(err => {
			console.log("API GET : Error " + err.response);
		  });
	}

	const editRow = place => {
		setEditing(true)
		setCurrentPlace({ 
			id: place.id, 
			name: place.name, 
			category: place.category,
			description: place.description,
			address: place.address,
			city: place.city,
			coordinate: {
				lat: place.coordinate.lat,
				lng: place.coordinate.lng
			},
			facilities: place.facilities,
			images : place.images
		})
	}
	
	useEffect(
		() => {
		  getPlaces()
		},
		[]
	  )

	const getPlaces = () => {
		API.get(`places/list`)
		  .then(res => {
			console.log(res.data)
			
			setPlaces(res.data)
			
		  })
		  .catch(err => {
			console.log("API GET : Error " + err.response);
		  });
	}

	return (
		<div className="container">
			<div className="header-container">
				<div>
					<h2>CRUD with Hooks</h2>
				</div>
				<span><Link to="/" >Go to Map</Link></span>
			</div>
			
			<div className=" flex-row">
				<div className="flex-large one-fourth">
					{editing ? (
						<Fragment>
							<h2>Edit place</h2>
							<EditForm
								editing={editing}
								setEditing={setEditing}
								currentPlace={currentPlace}
								updatePlace={updatePlace}
							/>
						</Fragment>
					) : (
						<Fragment>
							<h2>Add place</h2>
							<AddForm addPlace={addPlace} />
						</Fragment>
					)}
				</div>
				<div className="flex-large">
					<h2>View places</h2>
					<Table places={places} editRow={editRow} deletePlace={deletePlace} />
				</div>
			</div>
		</div>
	)
}

export default crud
