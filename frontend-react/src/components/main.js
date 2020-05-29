import React, { Component } from 'react';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import API from "../utils/api"

class Main extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      meta: {
        page: 1,
        hasPrevPage: false,
        hasNextPage: true,
        prevPage: null,
        nextPage: 2
      },
      places : [],
      selectedPlace: null,
      selectedCategory: "all",
      selectedName: "",
    }
  }

  handleChange = async (event) => {
    await this.setState({ 
      meta : { 
        page : 1, 
        hasPrevPage: false,
        hasNextPage: true 
      },
      selectedName: event.target.value 
    });
    this.getPlaces();
  }

  onDropdownChange = async (event) => {
    await this.setState({ 
      meta : { 
        page : 1, 
        hasPrevPage: false,
        hasNextPage: true 
      },
      selectedCategory: event.target.value
    });
    this.getPlaces();
  }

  setSelectedPlace = (place) => {
    this.setState({selectedPlace : place})
  }

  onPrevClick = async () => {
    let meta = this.state.meta
    console.log(meta.hasPrevPage, meta.page)

    if (meta.hasPrevPage) {
      await this.setState({ meta : { page : meta.prevPage } });
      this.getPlaces()
    }
  }

  onNextClick = async () => {
    let meta = this.state.meta
    console.log(meta.hasNextPage, meta.page)

    if (meta.hasNextPage) {
      await this.setState({ meta : { page : meta.nextPage } });
      this.getPlaces()
    }
  }

  onDetailClick = (selected) => {
    this.props.history.push(`/detail/${selected.id}`); 
  }

  capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  componentDidMount() {
    this.getPlaces()
  }

  getPlaces() {
    // axios.get(`http://localhost:3001/places?page=${this.state.meta.page}&keyword=${this.state.selectedName}&category=${this.state.selectedCategory}`)
    API.get(`places?page=${this.state.meta.page}&keyword=${this.state.selectedName}&category=${this.state.selectedCategory}`)
      .then(res => {
        this.setState({ 
          meta : res.data.meta,
          places : res.data.places,
          selectedPlace : null
        })
      })
      .catch(err => {
        console.log("API GET : Error " + err.response);
      });
  }

  render() {
    let {meta, places} = this.state
    let box = []

    for (const [index, item] of places.entries()) {
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
            {places.map(place => (
              <Marker
                key={place.id}
                position={{
                  lat: place.coordinate.lat,
                  lng: place.coordinate.lng
                }}
                onClick={() => {
                  this.setSelectedPlace(place);
                }}
                /* 
                if you want mouse over
                onMouseOver={() => {
                  this.setSelectedPlace(park);
                }} */
              />
            ))}

            {this.state.selectedPlace && (
              <InfoWindow
                onClose={() => {
                  this.setSelectedPlace(null);
                }}
                position={{
                  lat: this.state.selectedPlace.coordinate.lat + 0.0150,
                  lng: this.state.selectedPlace.coordinate.lng
                }}
              >
                <span style={{ padding: 0, margin: 0 }}>
                  <h3>{this.state.selectedPlace.name}</h3>
                  <p>
                    Category : { this.capitalize(this.state.selectedPlace.category) } <br />
                    { this.state.selectedPlace.address}
                  </p>
                  <div className="info-window-button" >
                    <button className="btn" 
                      onClick={() => this.onDetailClick(this.state.selectedPlace)}
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
              <input type="text" onChange={this.handleChange} placeholder="Search..." />
            </div>

            <div>
               <select id="lang" onChange={this.onDropdownChange} >
                  <option value="all">All</option>
                  <option value="apartment">Apartment</option>
                  <option value="office">Office</option>
               </select>
               <p></p>
           </div>
        </div>

        <div className="body-container" >

          <div className="left-container">

            <div className="content-map">
              { box }
            </div>

            <div className="pagination">
              <span>
                page {meta.page} of {meta.totalPages}
              </span>
              <div>
                <button className="btn" onClick={this.onPrevClick}>Prev</button>
                <button className="btn" onClick={this.onNextClick}>Next</button>
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
