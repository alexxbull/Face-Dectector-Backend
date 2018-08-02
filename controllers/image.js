const clarifai = require('clarifai');

const api = new Clarifai.App({
   apiKey: process.env.API_CLARIFAI,
});

console.log('key', api.apiKey)

 const handleApiCall = (req, res) =>
 {
   api.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => res.json(data))
      .catch(err => res.status(400).json('unable to work with API'))
 }

const updateAttempts = (db) => (req, res) =>
{
   const { id } = req.body;

   db('users').where('id', '=', id)
     .increment('attempts', 1)
     .returning('attempts')
     .then(attempts => res.json(attempts[0]))
     .catch(err => res.status(400).json('unable to get attempts'))
}

module.exports = {
  updateAttempts,
  handleApiCall,
}
