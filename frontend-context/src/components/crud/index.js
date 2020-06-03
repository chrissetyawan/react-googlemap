import React, { useState, useEffect, Fragment, useContext } from 'react'
import { Link } from "react-router-dom";
import AddForm from './forms/AddForm'
import EditForm from './forms/EditForm'
import Table from './tables/Table'
import './crud.css';
import API from "../../utils/api"
import ButterToast, { Cinnamon } from "butter-toast";
import { MapContext } from "../../context/mapContext";

const crud = () => {
	const mapContext = useContext(MapContext)

	// Setting state
	const [ editing, setEditing ] = useState(false)

	// CRUD operations
	const addMap = map => {
		const formatedInput = formatingInput(map)

		API.place().create(formatedInput)
		  .then(async res => {

			await mapContext.setSelectedPage(1)
			mapContext.getMaps()

			ButterToast.raise({
				content: <Cinnamon.Crunch title="Success message"
					content="Data succsefully added"
					scheme={Cinnamon.Crunch.SCHEME_GREEN}
				/>
			})
		  })
		  .catch(err => {
			console.log("API Error :  " + err);
		  });
	}

	const updateMap = (id, editedMap) => {
		const formatedInput = formatingInput(editedMap)

		API.place().update(id, formatedInput)
		  .then(res => {
			mapContext.setMaps(mapContext.maps.map(map => (map.id === res.data.id ? res.data : map)))
			mapContext.setEditing(false)

			ButterToast.raise({
				content: <Cinnamon.Crunch title="Success message"
					content="Data succsefully updated"
					scheme={Cinnamon.Crunch.SCHEME_GREEN}
				/>
			})
		  })
		  .catch(err => {
			console.log("API Error :  " + err);
		  });
	}

	const deleteMap = id => {
		if (window.confirm('Are you sure to delete this record?')) {
			setEditing(false)

			API.place().delete(id)
			.then(async res => {

				await mapContext.setSelectedPage(1)
				mapContext.getMaps()

				ButterToast.raise({
					content: <Cinnamon.Crunch title="Success message"
						content="Data succsefully deleted"
						scheme={Cinnamon.Crunch.SCHEME_GREEN}
					/>
				})
			})
			.catch(err => {
				console.log("API Error :  " + err);
			});
		}
	}

	const editRow = map => {
		mapContext.setEditing(true)
		mapContext.setSelectedMap(map)
	}

	const formatingInput = (input) => {
		if (!Array.isArray(input.facilities))
			input.facilities = input.facilities.split(",")

		if (!Array.isArray(input.images))
			input.images = input.images.split(",")
		
		for (const [index, facility] of input.facilities.entries()) {
			input.facilities[index] = facility.trim().replace("\n","").replace(/'/g,"").replace(/"/g,"")
		}

		for (const [index, image] of input.images.entries()) {
			input.images[index] = image.trim().replace("\n","").replace(/'/g,"").replace(/"/g,"")
		}

		return input
	}

	useEffect(() => {
		async function fetchData() {
			await mapContext.reset();
			await mapContext.setRowsPerPage(10)
			mapContext.getMaps()
		}
		fetchData();
	  }, []);

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
					{mapContext.editing ? (
						<Fragment>
							<h2>Edit map</h2>
							<EditForm
								editing={editing}
								setEditing={mapContext.setEditing}
								selectedMap={mapContext.selectedMap}
								updateMap={updateMap}
							/>
						</Fragment>
					) : (
						<Fragment>
							<h2>Add map</h2>
							<AddForm addMap={addMap} />
						</Fragment>
					)}
				</div>
				<div className="flex-large">
					<h2>List maps</h2>
					<div className="table-header" >
						<div className="table-filter" >
							<div>
								<input type="text" onChange={mapContext.nameChange} placeholder="Search..." />
							</div>
							<div>
								<select name="category" onChange={mapContext.categoryChange} >
									<option value="all">All</option>
									<option value="apartment">Apartment</option>
									<option value="office">Office</option>
								</select>
							</div>
						</div>
					</div>
					<div className="table-container">
						<Table editRow={editRow} deleteMap={deleteMap} />
					</div>
					<div className="table-pagination">
						<span>
							page {mapContext.meta.page} of {mapContext.meta.totalPages}
						</span>
						<div>
							<button className="btn" onClick={mapContext.onFirstClick}> First </button>
							<button className="btn" onClick={mapContext.onPrevClick}> Prev </button>
							<button className="btn" onClick={mapContext.onNextClick}> Next </button>
							<button className="btn" onClick={mapContext.onLastClick}> Last </button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default crud
