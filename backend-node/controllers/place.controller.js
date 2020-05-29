const Place = require('../models/place.model.js');

// Retrieve all data with pagination
exports.findAll = async (req, res) => {
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
    
    const { docs: places, ...meta } = paginated;
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
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        address: req.body.address,
        city: req.body.city,
        coordinate: {
          lat: req.body.coordinate.lat,
          lng: req.body.coordinate.lng
        },
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
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        address: req.body.address,
        city: req.body.city,
        coordinate: {
            lat: req.body.coordinate.lat,
            lng: req.body.coordinate.lng
        },
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
         res.send({message: "Place deleted successfully!"});
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
