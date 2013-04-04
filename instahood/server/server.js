Places = new Meteor.Collection("places");

// Publish complete set of places
Meteor.publish("places", function () {
  return Places.find();
});

Places.allow({
  insert: function () {
    return false;
  },
  update: function () {
    return false;
  },
  remove: function () {
    return false;
  }
});

Meteor.startup(function () {
	if (Places.find().count() === 0) {
		var list = [{name: 'San Francisco', lat: '37.7750', lon: '-122.4183', dist: '4000'},
			{name: 'SOMA', lat: '37.7787', lon: '-122.3974', dist: '1000'}, 
			{name: 'North Beach', lat: '37.8058', lon: '-122.4122', dist: '1000'}, 
      {name: 'Marina', lat: '37.8030', lon:'-122.4375', dist: '1000'},
      {name: 'Presidio', lat: '37.7958', lon: '-122.4542', dist: '1000'},
      {name: 'Haight-Ashbury', lat: '37.7698', lon:'-122.4472', dist: '1000'},
      {name: 'Mission', lat: '37.7651', lon:'-122.4197', dist: '1000'}]

    for (var i = 0; i < list.length; i++){
        Places.insert({name: list[i].name, lat: list[i].lat, 
        	lon: list[i].lon, dist: list[i].dist});
    }
  }
});