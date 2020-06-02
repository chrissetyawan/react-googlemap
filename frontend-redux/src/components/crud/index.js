import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PlaceForm from "./form/PlaceForm";
import { Grid, Paper, withStyles, Typography, AppBar } from '@material-ui/core';
import { Link } from "react-router-dom";
import DataTable from './table/DataTable'
import './crud.css';

const styles = theme => ({
    paper: {
        margin: theme.spacing(3),
        padding: theme.spacing(2)
    }
})

const PlaceList = ({ classes, ...props }) => {
    const [currentId, setCurrentId] = useState(0)

    const onEditClick = (event, id) => {
        setCurrentId(id);
    };

    return (
        <div>
            <AppBar position="static" color="inherit" style={{padding:"20px"}}>
                <div style={{display:"flex", alignItems:"center", justifyContent: "space-between"}}>
                    <Typography
                        variant="h5"
                        align="left"
                        >
                        CRUD with Redux and Material UI
                    </Typography>
                    <span><Link to="/" >Go to Map</Link></span>
                </div>
            </AppBar>
        
            <Grid container>
                <Grid item xs={5}>
                    <Paper className={classes.paper}>
                        <PlaceForm {...{ currentId, setCurrentId }} />
                    </Paper>
                </Grid>
                <Grid item xs={7}>
                    <DataTable 
                        onEditClick={onEditClick} 
                        {...{ currentId, setCurrentId }} 
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default (withStyles(styles)(PlaceList));
