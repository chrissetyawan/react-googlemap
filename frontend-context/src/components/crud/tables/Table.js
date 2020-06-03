import React from 'react'
import { Consumer } from "../../../context/mapContext";

const Table = props => (
  <Consumer> 
    {(mapContext) => (
      <React.Fragment>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mapContext.maps.length > 0 ? (
                mapContext.maps.map((map, index) => (
                  <tr key={index}>
                    <td style={{flex:'1'}}>{map.name}</td>
                    <td style={{width:'150px'}}>{map.category.charAt(0).toUpperCase() + map.category.slice(1)}</td>
                    <td style={{width:'180px'}}>
                      <button
                        onClick={() => {
                          props.editRow(map)
                        }}
                        className="btn btn-table"
                        style={{width:'80px', marginRight:'10px'}}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => props.deleteMap(map.id)}
                        className="btn btn-table"
                        style={{width:'80px'}}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No Maps data</td>
                </tr>
              )}
            </tbody>
          </table>

      </React.Fragment>	
    )}
  </Consumer>
)

export default Table
