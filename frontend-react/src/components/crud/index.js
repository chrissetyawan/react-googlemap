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
	const [ meta, setMeta ] = useState({
		page: 1,
        hasPrevPage: false,
        hasNextPage: true,
        prevPage: null,
		nextPage: 2,
		totalPages: 0
	})
	let [ category, setCategory ] = useState("all")
	let [ name, setName ] = useState("")

	// Pagination
	const nameChange = async (event) => {
		const {value} = event.target
		meta.page = 1
		await setMeta(meta);
		name = value
		await setName(value)
		getPlaces()
	}

	const categoryChange = async (event) => {
		const {value} = event.target
		meta.page = 1
		await setMeta(meta);
		category = value
		await setCategory(value)
		getPlaces()
	}

	const onFirstClick = async () => {
		if (meta.page !== 1) {
			meta.page = 1
			await setMeta(meta);
			getPlaces()
		}
	}
	
	const onLastClick = async () => {
		
		if (meta.page !== meta.totalPages) {
			meta.page = meta.totalPages
			await setMeta(meta);
			getPlaces()
		}
	}

	const onPrevClick = async () => {
		if (meta.hasPrevPage) {
			meta.page = meta.prevPage
			await setMeta(meta);
			getPlaces()
		}
	}
	
	const onNextClick = async () => {
		
		if (meta.hasNextPage) {
			meta.page = meta.nextPage
			await setMeta(meta);
			getPlaces()
		}
	}

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

	// get data
	useEffect(
		() => {
		  getPlaces()
		},
		[]
	)

	const getPlaces = () => {
		API.get(`places?page=${meta.page}&limit=10&keyword=${name}&category=${category}`)
		.then(res => {
			setPlaces(res.data.places)
			setMeta(res.data.meta)
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
					<div className="table-header" >
						<div className="table-filter" >
							<div>
								<input type="text" value={name} onChange={nameChange} placeholder="Search..." />
							</div>
							<div>
								<select name="category" onChange={categoryChange} >
									<option value="all">All</option>
									<option value="apartment">Apartment</option>
									<option value="office">Office</option>
								</select>
							</div>
						</div>
					</div>
					<div className="table-container">
						<Table places={places} editRow={editRow} deletePlace={deletePlace} />
					</div>
					<div className="table-pagination">
						<span>
							page {meta.page} of {meta.totalPages}
						</span>
						<div>
							<button className="btn" onClick={onFirstClick}> First </button>
							<button className="btn" onClick={onPrevClick}> Prev </button>
							<button className="btn" onClick={onNextClick}> Next </button>
							<button className="btn" onClick={onLastClick}> Last </button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default crud
