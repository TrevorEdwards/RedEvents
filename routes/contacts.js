var CONTACTS_PATH = __dirname + "/static_data/emergencycontacts.json";

exports.findAll = function(req, res) {
  res.sendFile( CONTACTS_PATH );
}
