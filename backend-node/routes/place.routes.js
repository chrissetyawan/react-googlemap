module.exports = (app) => {
  const places = require('../controllers/place.controller.js');

  // Read all
  app.get('/places', places.findAll);

  // Find one by ID
  app.get('/places/:id', places.findOne);

  // Create
  app.post('/places', places.create);

  // Update
  app.put('/places/:id', places.update);

  // Delete
  app.delete('/places/:id', places.delete);
}
