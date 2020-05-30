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
		// formating input data
		const formatedInput = formatingInput(place)

		API.post(`places`, place)
		  .then(res => {
			formatedInput.id = res.data.id
			setPlaces([ ...places, formatedInput ])

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

	const updatePlace = (id, updatedPlace) => {
		setEditing(false)

		// formating input data
		const formatedInput = formatingInput(updatedPlace)

		API.put(`places/${id}`, formatedInput)
		  .then(res => {
			setPlaces(places.map(place => (place.id === id ? formatedInput : place)))

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

	const formatingInput = (input) => {
		if (!Array.isArray(input.facilities))
			input.facilities = input.facilities.split(",")

		if (!Array.isArray(input.images))
			input.images = input.images.split(",")
		
		for (const [index, item] of input.facilities.entries()) {
			input.facilities[index] = item.trim().replace("\n","").replace(/'/g,"").replace(/"/g,"")
		}

		for (const [index, item] of input.images.entries()) {
			input.images[index] = item.trim().replace("\n","").replace(/'/g,"").replace(/"/g,"")
		}

		return input
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
