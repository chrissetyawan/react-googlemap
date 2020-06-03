import React from "react";
import API from "../utils/api"

let MapContext;
const { Provider, Consumer } = (MapContext = React.createContext());

class MapContextProvider extends React.PureComponent {

    state = {
        name : '',
        category : 'all',
        maps: [],
        meta: {
            page: 1,
            hasPrevPage: false,
            hasNextPage: true,
            prevPage: null,
            nextPage: 2,
            totalPages: 0
        },
        selectedMap: null,
        selectedPage : 1,
        rowsPerPage : 4,
        editing: false
    };
    
    nameChange = async (event) => {
        await this.setState({ 
            meta : {page: 1},
            name: event.target.value,
            selectedMap : null,
            editing : false
        });
        this.getMaps()
    }

    categoryChange = async (event) => {
        await this.setState({ 
            meta : {page: 1},
            category: event.target.value,
            selectedMap : null,
            editing : false
        });
        this.getMaps()
    }

    onFirstClick = async () => {
		if (this.state.meta.page !== 1) {
            await this.setState({ 
                meta : {page: 1},
                selectedMap : null,
                editing : false
            });
			this.getMaps()
		}
	}
   
	onLastClick = async () => {
		if (this.state.meta.page !== this.state.meta.totalPages) {
			await this.setState({ 
                meta : {page: this.state.meta.totalPages},
                selectedMap : null,
                editing : false
            });
			this.getMaps()
		}
	}

	onPrevClick = async () => {
		if (this.state.meta.hasPrevPage) {
			await this.setState({ 
                meta : {page: this.state.meta.prevPage},
                selectedMap : null,
                editing : false
            });
			this.getMaps()
		}
	}
	
	onNextClick = async () => {
		if (this.state.meta.hasNextPage) {
			await this.setState({ 
                meta : {page: this.state.meta.nextPage},
                selectedMap : null,
                editing : false
            });
			this.getMaps()
		}
	}
    
    getMaps = () => {
        API.place().fetchPagination(this.state.meta.page,this.state.rowsPerPage, this.state.name, this.state.category)
		  .then(res => {
            this.setState({ 
                maps: res.data.places,
                meta: res.data.meta
             });
		  })
		  .catch(err => {
			console.log("API Error : " + err.response);
		  });
    }
    
    setMaps = (maps) => {
        this.setState({maps})
    }

    setSelectedMap = (map) => {
        this.setState({selectedMap : map})
    }

    setSelectedPage = (page) => {
        this.setState({ meta : {page: page}});
    }

    setRowsPerPage = (rows) => {
        this.setState({ rowsPerPage : rows});
    }

    setEditing = (editing) => {
        this.setState({ editing : editing});
    }

    reset = () => {
        this.setState({ 
            name : '',
            category : 'all',
            maps: [],
            meta: {
                page: 1,
                hasPrevPage: false,
                hasNextPage: true,
                prevPage: null,
                nextPage: 2,
                totalPages: 0
            },
            selectedMap: null,
            selectedPage : 1,
            editing: false
        });
    }

    render() {
        return (
            <Provider
                value={{
                    ...this.state,
                    nameChange: this.nameChange,
                    categoryChange: this.categoryChange,
                    getMaps: this.getMaps,
                    setMaps: this.setMaps,
                    setSelectedMap: this.setSelectedMap,
                    setSelectedPage: this.setSelectedPage,
                    setRowsPerPage: this.setRowsPerPage,
                    setEditing: this.setEditing,
                    onFirstClick: this.onFirstClick,
                    onLastClick: this.onLastClick,
                    onPrevClick: this.onPrevClick,
                    onNextClick: this.onNextClick,
                    reset : this.reset
                }}
            >
                {this.props.children}
            </Provider>
        );
    }
}

export { MapContextProvider, Consumer, MapContext };
