import React from 'react'
import { Consumer } from "../../../context/mapContext";

const Table = props => (
  <Consumer> 
    {(mapContext) => (
      <React.Fragment>
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
      </React.Fragment>	
    )}
  </Consumer>
)

export default Table
