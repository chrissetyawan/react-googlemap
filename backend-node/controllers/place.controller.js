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
    const { page = 1, limit = 4, name = "", category = "all" } = req.query;
    // console.log(req.query)

    let query = {}
    if ( category.toLowerCase() !== "all") {
        query =  { category : category }
        
        if (name.trim() !== "") {
            query = {
                $and: [ { category : category } , { name: new RegExp(`${name}+`, "i") } ]
            }
        }
    }
    else if (name.trim() !== "") {
        query = { name: new RegExp(`${name}+`, "i") }
    }

    const paginated = await Place.paginate(
        query,
        {
            page,
            limit,
            lean: true,
            sort: { updatedAt: "desc" }
        }
    )
    
    const { docs: data, ...meta } = paginated;
    const places = await Promise.all(data.map(placesSerializer));
    res.json({ meta, places });
};

exports.findOne = (req, res) => {
    Place.findById(req.params.id)
        .then(data => {
            if(!data) {
                return res.status(404).send({
                    message: "place not found with id " + req.params.id
                });
            }
            const place = placesSerializer(data)
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

exports.create = (req, res) => {
    if(!req.body.name) {
         return res.status(400).send({
             message: "Place name can not be empty"
         });
    }

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

    place.save()
    .then(data => {
        const place = placesSerializer(data)
        res.send(place);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Place."
        });
    });
};

exports.update = (req, res) => {
    if(!req.body.name) {
        return res.status(400).send({
            message: "Place name can not be empty"
        });
    }

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
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Place not found with id " + req.params.id
            });
        }
        const place = placesSerializer(data)
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
