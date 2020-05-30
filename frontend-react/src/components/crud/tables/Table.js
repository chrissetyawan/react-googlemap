import React from 'react'

const Table = props => (
  
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {props.places.length > 0 ? (
        props.places.map((place, index) => (
          <tr key={index}>
            <td style={{flex:'1'}}>{place.name}</td>
            <td style={{width:'150px'}}>{place.category.charAt(0).toUpperCase() + place.category.slice(1)}</td>
            <td style={{width:'180px'}}>
              <button
                onClick={() => {
                  props.editRow(place)
                }}
                className="btn"
                style={{width:'80px', marginRight:'10px'}}
              >
                Edit
              </button>
              <button
                onClick={() => props.deletePlace(place.id)}
                className="btn"
                style={{width:'80px'}}
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3}>No places</td>
        </tr>
      )}
    </tbody>
  </table>
)

export default Table
