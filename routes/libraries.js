var Plant = require('plant.js'),
    schedule = require('node-schedule'),
    sdb = require('./shareddb');

var parseLibraries = function(){
  console.log('parsing libraries at ' + Date.now());
  var browser = new Plant();

  browser.get('https://www.library.cornell.edu/libraries')
    .then(function($){
        var result = $('.today-hours , .library-info h2');
        var lib = null;
        var lib_stats = [];
        for( var i = 0; i < result.length; i++){
          try{
            if(result[i].children[0].data != undefined){
              if(lib == null)
                lib = result[i].children[0].data;
              else{
                lib_stats.push( {name: lib, hours: result[i].children[0].data})
                lib = null;
              }
            }
          } catch(e){
            // do nothing
          }
          try{
            if(result[i].children[1].data != undefined){
              if(lib == null){
                lib = result[i].children[1].data;
              }
              else{
                lib_stats.push( {name: lib.trim(), hours: result[i].children[1].data.trim()});
                lib = null;
              }
            }
          }

           catch(e){
            //do nothing dog
          }
        }

        for(var i = 0; i < lib_stats.length; i++){
            var dat = lib_stats[i];
          }

        //Insert into the database
          sdb.db.collection('libraries', function(err, collection) {
            if( collection != undefined){
                collection.drop(); //TODO: Replace data more reliably
            }
            for( var i = 0; i < lib_stats.length; i++ ) {
              collection.insert( lib_stats[i], function(err,records){
                if (err) throw err;
            });
            }
        });
    })
    .catch(function(e){
      return console.trace(e);
    });
}

//every day at 12:01 AM
schedule.scheduleJob('0 1 0 * * *', function(){
  parseLibraries();
});

//exports
exports.findAll = function(req, res) {
    sdb.db.collection('libraries', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
