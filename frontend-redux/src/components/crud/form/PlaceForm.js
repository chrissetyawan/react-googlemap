import React, { useEffect } from "react";
import { TextField, withStyles, Button, MenuItem } from "@material-ui/core";
import useForm from "./useForm";
import { connect } from "react-redux";
import * as actions from "../../../actions/place";
import ButterToast, { Cinnamon } from "butter-toast";
import { AssignmentTurnedIn } from "@material-ui/icons";

const initialFieldValues = {
    name: '',
    category: '',
    description: '',
    address: '',
    city: '',
    coordinate: {
      lat: 0,
      lng: 0,
    },
    facilities: [],
    images : []
}

const styles = theme => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1)
        },
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    postBtn: {
        width: "50%",
        marginTop: "30px",
        marginBottom: "20px"
    }
})

const PlaceForm = ({ classes, ...props }) => {

    useEffect(() => {
        if (props.currentId !== 0){
            setValues({
                ...props.placeList.find(x => x.id === props.currentId)
            })
            setErrors({})
        }
    }, [props.currentId])

    const validate = () => {
        let tempErrors = {};

        if(!values.name || values.name.trim() ===  ""){
			
			tempErrors["name"] = "Cannot be empty";
		}
	
		if(!values.category){
			
			tempErrors["category"] = "Not selected yet";
		}
	
		if(!values.description || values.description.trim() ===  ""){
			
			tempErrors["description"] = "Cannot be empty";
		}
	
		if(!values.address || values.address.trim() ===  ""){
			
			tempErrors["address"] = "Cannot be empty";
		}

		if(!values.coordinate.lat || parseInt(values.coordinate.lat) === 0) {
			
			tempErrors["lat"] = "Cannot be zero or empty ";
		}

		if(!values.coordinate.lng || parseInt(values.coordinate.lng) === 0) {
			
			tempErrors["lng"] = "Cannot be zero or empty";
		}

		if (Array.isArray(values.facilities)) {
			if (values.facilities.length === 0) {
				tempErrors["facilities"] = "Input not valid";
			}
			else {
				for (const [index, facility] of values.facilities.entries()) {
					if (facility.trim() === "") {
						tempErrors["facilities"] = "Input not valid";
						break;
					}
				}
			}
		}
		else {
			if (values.facilities.trim() ===  "") {
				tempErrors["facilities"] = "Cannot be empty";
			}
			else {
				let arr = values.facilities.split(",")
				for (const [index, facility] of arr.entries()) {
					if (facility.trim() === "") {
						tempErrors["facilities"] = "Input not valid";
						break;
					}
				}
			}
		}
			
		if (Array.isArray(values.images)) {
			if (values.images.length === 0) {
				
				tempErrors["images"] = "Input not valid";
			}
			else {
				for (const [index, image] of values.images.entries()) {
					if (image.trim() === "") {
						
						tempErrors["images"] = "Input not valid";
						break;
					}
				}
			}
		}
		else {
			if (values.images.trim() ===  "") {
				
				tempErrors["images"] = "Cannot be empty";
			}
			else {
				let arr = values.images.split(",")
				for (const [index, image] of arr.entries()) {
					if (image.trim() === "") {
						
						tempErrors["images"] = "Input not valid";
						break;
					}
				}
			}
		}
      
		setErrors(tempErrors)
        return Object.values(tempErrors).every(x => x === "")
    }

    let {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFieldValues,props.setCurrentId)

    const handleSubmit = e => {
        e.preventDefault()
        const onSuccess = () => {
            ButterToast.raise({
                content: <Cinnamon.Crisp title="Success Message"
                    content="Submitted successfully"
                    scheme={Cinnamon.Crisp.SCHEME_GREEN}
                    icon={<AssignmentTurnedIn />}
                />
            })
            resetForm()
        }
        if (validate()) {
            if (props.currentId === 0)
                props.createPlace(values, onSuccess)
            else
                props.updatePlace(props.currentId, values, onSuccess)
        }
    }

    return (
        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`}
            onSubmit={handleSubmit}>
            <TextField
                name="name"
                variant="outlined"
                label="Name"
                fullWidth
                value={values.name}
                onChange={handleInputChange}
                {...(errors.name && { error: true, helperText: errors.name })}
            />

            <TextField 
                select
                name="category"
                label="Category" 
                value={values.category}
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                {...(errors.category && { error: true, helperText: errors.category })}
                >
                <MenuItem value={"apartment"}>Apartment</MenuItem>
                <MenuItem value={"office"}>Office</MenuItem>
            </TextField>

            <TextField
                name="description"
                variant="outlined"
                label="Description"
                fullWidth
                multiline
                rows={5}
                value={values.description}
                onChange={handleInputChange}
                {...(errors.description && { error: true, helperText: errors.description })}
            />
            <TextField
                name="address"
                variant="outlined"
                label="Address"
                fullWidth
                multiline
                rows={3}
                value={values.address}
                onChange={handleInputChange}
                {...(errors.address && { error: true, helperText: errors.address })}
            />
            <TextField
                name="city"
                variant="outlined"
                label="City"
                fullWidth
                value={values.city}
                onChange={handleInputChange}
                {...(errors.city && { error: true, helperText: errors.city })}
            />
            <TextField
                name="lat"
                variant="outlined"
                label="Latitude"
                fullWidth
                value={values.coordinate.lat || 0}
                onChange={handleInputChange}
                {...(errors.lat && { error: true, helperText: errors.lat })}
            />
            <TextField
                name="lng"
                variant="outlined"
                label="Longitude"
                fullWidth
                value={values.coordinate.lng || 0}
                onChange={handleInputChange}
                {...(errors.lng && { error: true, helperText: errors.lng })}
            />
            <TextField
                name="facilities"
                variant="outlined"
                label="Facilities"
                placeholder="Separated by comma, ex: item1, item2, etc"
                fullWidth
                multiline
                rows={5}
                value={values.facilities}
                onChange={handleInputChange}
                {...(errors.facilities && { error: true, helperText: errors.facilities })}
            />
            <TextField
                name="images"
                variant="outlined"
                label="Images"
                placeholder="Separated by comma, ex: /path/img1.jpg, /path/img2.png, etc"
                fullWidth
                multiline
                rows={5}
                value={values.images}
                onChange={handleInputChange}
                {...(errors.images && { error: true, helperText: errors.images })}
            />
            <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                className={classes.postBtn}
            >Submit</Button>
        </form>
    );
}

const mapStateToProps = state => ({
    placeList: state.place.list
})

const mapActionToProps = {
    createPlace: actions.create,
    updatePlace: actions.update
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(PlaceForm));