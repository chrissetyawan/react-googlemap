const Place = require('../models/place.model.js');

const placesSerializer = data => ({
    id: data.id,
    name: data.name,
    category: data.category,
    description: data.description,
    address: data.address,
    city: data.city,
    coordinate:  data.coordinate,
    facilities: data.facilities,
    images : data.images
});

// Retrieve all data
exports.findAll =  (req, res) => {
    Place.find()
    .then(async data => {
        const places = await Promise.all(data.map(placesSerializer));
        res.send(places);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving places."
        });
    });
};

// Retrieve data with pagination
exports.findPagination = async (req, res) => {
    const { page = 1, keyword = "", category = "all" } = req.query;
    // console.log(req.query)

    let query = {}
    if ( category.toLowerCase() !== "all") {
        query =  { category : category }
        
        if (keyword.trim() !== "") {
            query = {
                $and: [ { category : category } , { name: new RegExp(`^${keyword}+`, "i") } ]
            }
        }
    }
    else if (keyword.trim() !== "") {
        query = { name: new RegExp(`^${keyword}+`, "i") }
    }

    const paginated = await Place.paginate(
        query,
        {
            select: 'name category description address city coordinate facilities images',
            page,
            limit : 4,
            lean: true,
            sort: { updatedAt: "desc" }
        }
    )
    
    const { docs: data, ...meta } = paginated;
    const places = await Promise.all(data.map(placesSerializer));
    res.json({ meta, places });
};

// Find one by ID
exports.findOne = (req, res) => {
    Place.findById(req.params.id)
        .then(place => {
            if(!place) {
                return res.status(404).send({
                    message: "place not found with id " + req.params.id
                });
            }
            res.send(place);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Place not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving place with id " + req.params.id
            });
        });
};

// create 
exports.create = (req, res) => {
    // Validate request
    if(!req.body.name) {
         return res.status(400).send({
             message: "Place name can not be empty"
         });
    }

    // Create an Place
    const place = new Place({
        name: req.body.name.trim(),
        category: req.body.category.trim(),
        description: req.body.description.trim(),
        address: req.body.address.trim(),
        city: req.body.city.trim(),
        coordinate: req.body.coordinate,
        facilities: req.body.facilities,
        images :req.body.images
    });

    // Save Place in the database
    place.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Place."
        });
    });
};

// Update
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Place name can not be empty"
        });
    }

    // Find place and update it with the request body
    Place.findByIdAndUpdate(req.params.id, {
        name: req.body.name.trim(),
        category: req.body.category.trim(),
        description: req.body.description.trim(),
        address: req.body.address.trim(),
        city: req.body.city.trim(),
        coordinate: req.body.coordinate,
        facilities: req.body.facilities,
        images :req.body.images
    }, {new: true})
    .then(place => {
        if(!place) {
            return res.status(404).send({
                message: "Place not found with id " + req.params.id
            });
        }
        res.send(place);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Place not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error updating place with id " + req.params.id
        });
    });
};

// Delete
exports.delete = (req, res) => {
  Place.findByIdAndRemove(req.params.id)
     .then(place => {
         if(!place) {
             return res.status(404).send({
                 message: "Place not found with id " + req.params.id
             });
         }
         res.send({ id: req.params.id, message: "Place deleted successfully!" });
     }).catch(err => {
         if(err.kind === 'ObjectId' || err.name === 'NotFound') {
             return res.status(404).send({
                 message: "Place not found with id " + req.params.id
             });
         }
         return res.status(500).send({
             message: "Could not delete place with id " + req.params.id
         });
     });
};
