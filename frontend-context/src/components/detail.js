import React, { Component } from 'react';
import styles from './detail.module.css';
import { Link } from "react-router-dom";

import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker
} from "react-google-maps";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import API from "../utils/api"

class Detail extends Component {
    constructor( props ) {
        super( props );
        this.state = {
          data: {
            id: null,
            name: null,
            description: null,
            coordinate: {},
            images: [],
            facilities: []
          },
        }
      }

    getDetail(id) {
      API.place().fetchById(id)
        .then(res => {
          this.setState({ data : res.data })
        })
        .catch(err => {
          console.log("API Error " + err.response);
        });
    }

    async componentDidMount() {
        let id = this.props.match.params.id
        this.getDetail(id)
    }

    render() {
        const settings = {
          arrows: true,
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 1
        };

        const data = this.state.data

        const AsyncMap = withScriptjs(
          withGoogleMap(
            props => (
              <GoogleMap
                defaultZoom={17}
                defaultCenter={{ lat: data.coordinate.lat, lng: data.coordinate.lng }}
                >
                  <Marker
                    key={data.id}
                    position={{
                      lat: data.coordinate.lat,
                      lng: data.coordinate.lng
                    }}
                  />
              </GoogleMap>
            )
          )
        );

        return (
            <div className={styles.detailContainer}>
                <div className={styles.detailNav}>
                  <span><Link to="/" >Back</Link></span>
                </div>
                
                <div className={styles.detailHeader}>
                    <img src={data.images[0]} className={styles.detailImage} alt="Logo" />
                </div>

                <div className={styles.detailBody}>
                    <div className={styles.detailName}> {data.name} </div>
                    <div className={styles.detailContent}>
                      <div className={styles.leftContent}>
                        <span>Description</span>
                        <span className={styles.descriptionContent}>{data.description}</span>
                        <span>Facilities</span>
                        <div className={styles.facilitiesContent}>
                          {data.facilities.map(function(name, index){
                            return <span className={styles.facilitiesItem} key={ index }>{name}</span>;
                          })}
                        </div>
                      </div>
                      <div className={styles.rightContent}>
                        <span>Location</span>
                        <span  className={styles.descriptionContent}>{data.address}</span>
                        <div className={styles.mapContent}>
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
                </div>

                <div className={styles.detailFooter}>
                  <Slider {...settings}>
                      {data.images.map(function(image, index){
                          return <div><img src={image} alt="Logo" /></div>
                      })}
                  </Slider>
                </div>
            </div>
        )
    }
    
  }

export default Detail;