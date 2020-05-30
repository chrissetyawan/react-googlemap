import React, { useState, useEffect, Fragment } from 'react'
import { Link } from "react-router-dom";
import AddForm from './forms/AddForm'
import EditForm from './forms/EditForm'
import Table from './tables/Table'
import './crud.css';
import API from "../../utils/api"
import ButterToast, { Cinnamon } from "butter-toast";

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
			place.id = res.data.id
			setPlaces([ ...places, place ])

			ButterToast.raise({
				content: <Cinnamon.Crunch title="Success message"
					content="Data succsefully added"
					scheme={Cinnamon.Crunch.SCHEME_GREEN}
				/>
			})
		  })
		  .catch(err => {
			console.log("API Error :  " + err.response);
		  });
	}

	const deletePlace = id => {
		if (window.confirm('Are you sure to delete this record?')) {
			setEditing(false)

			API.delete(`places/${id}`)
			.then(res => {
				setPlaces(places.filter(place => place.id !== id))

				ButterToast.raise({
					content: <Cinnamon.Crunch title="Success message"
						content="Data succsefully deleted"
						scheme={Cinnamon.Crunch.SCHEME_GREEN}
					/>
				})
			})
			.catch(err => {
				console.log("API Error :  " + err.response);
			});
		}
		
	}

	const updatePlace = (id, updatedPlace) => {
		setEditing(false)
		API.put(`places/${id}`, updatedPlace)
		  .then(res => {
			setPlaces(places.map(place => (place.id === id ? updatedPlace : place)))

			ButterToast.raise({
				content: <Cinnamon.Crunch title="Success message"
					content="Data succsefully updated"
					scheme={Cinnamon.Crunch.SCHEME_GREEN}
				/>
			})
		  })
		  .catch(err => {
			console.log("API Error :  " + err.response);
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
			setPlaces(res.data)
		  })
		  .catch(err => {
			console.log("API Error : " + err.response);
		  });
	}

	return (
		<div className="crud-container">
			<div className="crud-header-container">
				<div>
					<h2>CRUD with Hooks</h2>
				</div>
				<span><Link to="/" >Go to Map</Link></span>
			</div>
			
			<div className=" flex-row">
				<div className="flex-large one-fourth">
					{editing ? (
						<Fragment>
							<h2>Edit map</h2>
							<EditForm
								editing={editing}
								setEditing={setEditing}
								currentPlace={currentPlace}
								updatePlace={updatePlace}
							/>
						</Fragment>
					) : (
						<Fragment>
							<h2>Add map</h2>
							<AddForm addPlace={addPlace} />
						</Fragment>
					)}
				</div>
				<div className="flex-large">
					<h2>List maps</h2>
					<Table places={places} editRow={editRow} deletePlace={deletePlace} />
				</div>
			</div>
		</div>
	)
}

export default crud
