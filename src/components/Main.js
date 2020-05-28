import React, { Component } from 'react';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";

import * as maps from "../data/maps.json";

class Main extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      selectedMark: null,
      selectedCategory: "all",
      selectedName: "",
      filteredMap: maps.data.filter(l => {return l }),
      items : [],
      index : 0
    }
  }

  handleChange = async (event) => {
    await this.setState({ 
      index : 0, 
      selectedName: event.target.value 
    });
    this.filterMap();
  }

  onDropdownChange = async (event) => {
    await this.setState({ 
      index : 0,
      selectedCategory: event.target.value
    });
    this.filterMap();
  }

  filterMap = async () => {
    const {selectedName, selectedCategory} = this.state

    if (selectedCategory === "all") {
      await this.setState({
        filteredMap : maps.data.filter(x => {
          return x.name.toLowerCase().match(selectedName)
        })
      })
    }
    else {
      await this.setState({
        filteredMap : maps.data.filter(x => {
          return x.name.toLowerCase().match(selectedName) && x.category===selectedCategory;
        })
      })
    }

    this.setItems(0)
  }

  setSelectedMark = (mark) => {
    this.setState({selectedMark : mark})
  }

  onPrevClick = () => {
    let currIdx;

    if (this.state.index - 4 < 0)  currIdx = 0
    else currIdx = this.state.index - 4

    this.setState({index : currIdx})
    this.setItems(currIdx)
  }

  onNextClick = () => {
    if (this.state.index + 4 < this.state.filteredMap.length) {
      let currIdx = this.state.index + 4;
      this.setState({index : currIdx})
      this.setItems(currIdx)
    }
  }

  setItems = (idx) => {
    let items = []
    for (let i = idx; i < idx + 4; i++) {
      if(this.state.filteredMap[i]) items.push(this.state.filteredMap[i]);
    }
    this.setState({ items : items })
    this.setSelectedMark(null);
  }

  onDetailClick = (selected) => {
    this.props.history.push(`/detail/${selected.id}`); 
  }

  capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  componentDidMount() {
    this.setItems(0)
  }

  render() {
    let box = []

    for (const [index, item] of this.state.items.entries()) {
      box.push(
        <div className="item" key={index}>
          <div className="item-image">
            <img src={item.images[0]} className="image-map" alt="Logo" />
          </div>
          <div className="item-body">
            <div className="item-body-title">{item.name}</div>
            <span>
              Category : { this.capitalize(item.category)} <br />
              Address : { item.address}
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
            {this.state.items.map(mark => (
              <Marker
                key={mark.id}
                position={{
                  lat: mark.coordinate.lat,
                  lng: mark.coordinate.lng
                }}
                onClick={() => {
                  this.setSelectedMark(mark);
                }}
                /* 
                if you want mouse over
                onMouseOver={() => {
                  this.setselectedMark(park);
                }} */
              />
            ))}

            {this.state.selectedMark && (
              <InfoWindow
                onClose={() => {
                  this.setSelectedMark(null);
                }}
                position={{
                  lat: this.state.selectedMark.coordinate.lat + 0.0150,
                  lng: this.state.selectedMark.coordinate.lng
                }}
              >
                <span style={{ padding: 0, margin: 0 }}>
                  <h3>{this.state.selectedMark.name}</h3>
                  <p>
                    Category : { this.capitalize(this.state.selectedMark.category) } <br />
                    { this.state.selectedMark.address}
                  </p>
                  <div className="info-window-button" >
                    <button className="btn" 
                      onClick={() => this.onDetailClick(this.state.selectedMark)}
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
              {box}
            </div>

            <div className="pagination">
              <button className="btn" onClick={this.onPrevClick}>Prev</button>
              <button className="btn" onClick={this.onNextClick}>Next</button>
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
