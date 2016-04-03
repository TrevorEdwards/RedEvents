const BIKE_PATH = __dirname + "/static_data/maps/bikeracks.json";
const BLUE_PATH = __dirname + "/static_data/maps/bluelights.json";
const BUILDING_PATH = __dirname + "/static_data/maps/buildings.json";
const STOP_PATH = __dirname + "/static_data/maps/stop-locations.json";

exports.bikes = function(req, res) {
  res.sendFile( BIKE_PATH );
};

exports.blue = function(req, res) {
  res.sendFile( BLUE_PATH );
};

exports.building = function(req, res) {
  res.sendFile( BUILDING_PATH );
};

exports.stop = function(req, res) {
  res.sendFile( STOP_PATH );
};
