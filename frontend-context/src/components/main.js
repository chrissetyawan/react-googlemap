import React, { Component } from 'react';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import { Link } from "react-router-dom";
import { MapContext } from "../context/mapContext";

class Main extends Component {
  static contextType = MapContext;

  onDetailClick = (map) => {
      this.props.history.push(`/detail/${map.id}`); 
  } 

  capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async componentDidMount() {
    await this.context.reset();
    await this.context.setRowsPerPage(4)
    this.context.getMaps()
  }

  render() {
    const context = this.context
    let box = []

    for (const [index, item] of context.maps.entries()) {
      box.push(
        <div className="item" key={index}>
          <div className="item-image">
            <img src={item.images[0]} className="image-map" alt="Logo" />
          </div>
          <div className="item-body">
            <div className="item-body-title">{item.name}</div>
            <span>
              Category : { this.capitalize(item.category) } <br />
              Address : { item.address }
            </span>
          </div>
          <div className="item-footer">
            <button className="btn" 
              onClick={() => this.onDetailClick(item)}
            >Detail</button>
          </div>
        </div>
      )
    }

    const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
          <GoogleMap
            defaultZoom={12}
            defaultCenter={{ lat: -6.21462, lng: 106.84513 }}
            >
            {context.maps.map(item => (
              <Marker
                key={item.id}
                position={{
                  lat: item.coordinate.lat,
                  lng: item.coordinate.lng
                }}
                onClick={() => {
                  context.setSelectedMap(item);
                }}
                /* 
                if you want mouse over
                onMouseOver={() => {
                  this.setSelectedMap(park);
                }} */
              />
            ))}

            {context.selectedMap && (
              <InfoWindow
                onClose={() => {
                  context.setSelectedMap(null);
                }}
                position={{
                  lat: context.selectedMap.coordinate.lat + 0.0150,
                  lng: context.selectedMap.coordinate.lng
                }}
              >
                <span style={{ padding: 0, margin: 0 }}>
                  <h3>{context.selectedMap.name}</h3>
                  <p>
                    Category : { this.capitalize(context.selectedMap.category) } <br />
                    { context.selectedMap.address}
                  </p>
                  <div className="info-window-button" >
                    <button className="btn" 
                      onClick={() => this.onDetailClick(context.selectedMap)}
                    >Detail</button>
                  </div>
                </span>
              </InfoWindow>
            )}
          </GoogleMap>
				)
			)
		);

    return (
      <div className="main-container">

        <div className="header-container" >
            <div>
              <input type="text" onChange={context.nameChange} placeholder="Search..." />
            </div>

            <div>
               <select name="category" onChange={context.categoryChange} >
                  <option value="all">All</option>
                  <option value="apartment">Apartment</option>
                  <option value="office">Office</option>
               </select>
           </div>

           <span><Link to="/crud" >Go to CRUD</Link></span>
           
        </div>

        <div className="body-container" >

          <div className="left-container">

            <div className="box-container">
              { box }
            </div>

            <div className="pagination">
              <span>
                page {context.meta.page} of {context.meta.totalPages}
              </span>
              <div>
                <button className="btn" onClick={context.onPrevClick}>Prev</button>
                <button className="btn" onClick={context.onNextClick}>Next</button>
              </div>
            </div>

          </div>

          <div className="right-container"  >
              <AsyncMap
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${
                    process.env.REACT_APP_GOOGLE_KEY
                  }`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
              />
          </div>

        </div>

      </div>
    )
  }
}

export default Main;
