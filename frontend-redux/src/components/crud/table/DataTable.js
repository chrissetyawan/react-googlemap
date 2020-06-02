import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/place";
import ButterToast, { Cinnamon } from "butter-toast";
import { DeleteSweep } from "@material-ui/icons";
import { Paper, withStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter 
} from '@material-ui/core';
import CollapsibleRow from './CollapsibleRow'
import Pagination from './Pagination'
import { TextField, MenuItem } from "@material-ui/core";

const styles = theme => ({
    paper: {
        margin: theme.spacing(3),
        padding: theme.spacing(2)
    }
})

const DataTable = ({ classes, ...props }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    let [ category, setCategory ] = useState("all")
	let [ name, setName ] = useState("")

    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.meta.totalDocs - page * rowsPerPage)
    
    useEffect(() => {
        props.fetchPagination(1, rowsPerPage)
        // props.fetchAllData()
    }, [])//DidMount

    const onDelete = async id => {
        const onSuccess = () => {
            ButterToast.raise({
                content: <Cinnamon.Crisp title="Success Message"
                    content="Deleted successfully"
                    scheme={Cinnamon.Crisp.SCHEME_GREEN}
                    icon={<DeleteSweep />}
                />
            })
        }

        if (window.confirm('Are you sure to delete this record?')) {
            props.deletePlace(id, onSuccess)
        }
            
    }

    const onEditClick = async id => {
        props.setCurrentId(id)
    }

    const handleChangePage = async (event, newPage) => {
        await setPage(newPage);
        props.fetchPagination(newPage + 1, rowsPerPage)
    };

    const handleChangeRowsPerPage = async (event) => {
        if (event.target.value){
            const val = parseInt(event.target.value, 10)
            await setRowsPerPage(val);
            await setPage(0);
            props.fetchPagination(1, val)
        }
    };

	const nameChange = async (event) => {
		const { value } = event.target
		name = value
		await setName(value)
		props.fetchPagination(1, rowsPerPage,  value, category)
	}

	const categoryChange = async (event) => {
		const { value } = event.target
		category = value
		await setCategory(value)
		props.fetchPagination(1, rowsPerPage,  name, value)
    }
    
    

    return (
        <Paper className={classes.paper}>   
            <h3>Map List</h3> <br />
            <TableContainer component={Paper} >
                <div className="table-filter" >
                        <TextField
                            name="name"
                            variant="outlined"
                            label="Search by Name"
                            value={name}
                            onChange={nameChange}
                            autoComplete="off"
                        />
                        <TextField 
                            select
                            name="category"
                            label="Category" 
                            value={category}
                            variant="outlined"
                            onChange={categoryChange}
                            >
                            <MenuItem value={"all"}>All</MenuItem>
                            <MenuItem value={"apartment"}>Apartment</MenuItem>
                            <MenuItem value={"office"}>Office</MenuItem>
                        </TextField>
                </div>

                <div >
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell style={{fontWeight:'600'}}>Name</TableCell>
                                <TableCell style={{fontWeight:'600'}}>Category</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody  style={{ height: "150px", overflow: "auto" }} >
                            {props.placeList.map((row, index) => (
                                <CollapsibleRow 
                                    key={index} 
                                    row={row} 
                                    onEditClick={onEditClick}
                                    onDelete={onDelete} 
                                />
                            ))}    
                            {/* {emptyRows > 0 && (
                                <TableRow className={classes.root} style={{ height: 63.2 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )} */}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <Pagination 
                                    handleChangePage={handleChangePage} 
                                    handleChangeRowsPerPage={handleChangeRowsPerPage} 
                                    count={props.meta.totalDocs || 0}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </TableContainer>
        </Paper>
    );
}

const mapStateToProps = state => ({
    placeList: state.place.list,
    meta: state.place.meta
})

const mapActionToProps = {
    fetchAllData: actions.fetchAll,
    fetchPagination: actions.Pagination,
    deletePlace: actions.Delete
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(DataTable));
