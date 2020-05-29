module.exports = (app) => {
  const places = require('../controllers/place.controller.js');

  // Retrieve All data
  app.get('/places/list', places.findAll);

  // Retrieve data with pagination
  app.get('/places', places.findPagination);

  // Find one by ID
  app.get('/places/:id', places.findOne);

  // Create
  app.post('/places', places.create);

  // Update
  app.put('/places/:id', places.update);

  // Delete
  app.delete('/places/:id', places.delete);
}
