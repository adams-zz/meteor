// Define Minimongo collection and subscribe to db
Meteor.subscribe("places");
Places = new Meteor.Collection("places");

var CLIENTID = '115c041ed2674786a9b047417174c1bc';

// Success callback for ajax request. Stores json in session variable.
function onJsonLoaded (json){
  if (json.meta.code == 200) {
    var show = json.data;
    Session.set('photoset', show);
  } else{
    alert(json.meta.error_message);
  };
}

var getNewPhotos = function (place) {
  $.ajax({
  url: 'https://api.instagram.com/v1/media/search?callback=?',
  dataType: 'json',
  data: {lat: place.lat, lng: place.lon, distance:place.dist, client_id: CLIENTID},
  success: onJsonLoaded,
  statusCode: {
    500: function () {
      // instagram API endpoint returns 500 when it's down
      alert('Sorry, service is temporarily down.');
    }
  }
  });
};

// On startup, make first api call
Meteor.startup(function(){
  Session.set('photoset', '');
  Session.set('selected', 'San Francisco');
  Session.set('zoomed', ''); 
  
  //TODO: Meteor.autorun
  $.ajax({
  url: 'https://api.instagram.com/v1/media/search?callback=?',
  dataType: 'json',
  //lat, lng hardcoded around bcn center
  data: {lat: '37.7750', lng: '-122.4183', distance:'4000', client_id: CLIENTID}, 
  success: onJsonLoaded,
  statusCode: {
    500: function () {
      // instagram API endpoint returns 500 when it's down
      alert('Sorry, service is temporarily down.');
    }
  }
  });

  // tweet button
  !function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(!d.getElementById(id)){
      js=d.createElement(s);js.id=id;
      js.src="https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js,fjs);
    }
  }(document,"script","twitter-wjs");

});


// HELPER to populate selector with place names
Handlebars.registerHelper('placesIterator', function (){
  var place_list = Places.find({});
  var out = "";
  place_list.forEach(function (place){
    out += "<option value="+place.name+">"+place.name+"</option>";
  });
  return out;
});


// TEMPLATE HELPERS
Template.instagram.helpers({
// make json data available to the template
photoset: function(){
  return Session.get('photoset');
}
});
/*
Template.main.helpers({
title: function () {
  return Session.get('selected') || "Barcelona";
}
});
*/

// EVENT MAP for INSTAGRAM template
Template.instagram.events({

// pagination event
'click #button-more': function(){
  var place = String(Session.get('selected'));
  var current_place = Places.findOne({name: place});
  getNewPhotos(current_place);
},
'click .photo': function(event){
  $('.photos-container').toggleClass('greyed');
  if (Session.equals('zoomed', '')) {
    $('<img src='+this.images.standard_resolution.url+' alt="">').appendTo('#zoomed-image');
    Session.set('zoomed', this.images.standard_resolution.url);
  } else{
    $('#zoomed-image').children().remove();
    Session.set('zoomed', '');
  };
}
});

// EVENT MAP for MAIN template
Template.main.events({

'change #place-selector': function(){
  var place = String($('#place-selector option:selected').val());
  var current_place = Places.findOne({name: place});
  Session.set('selected', current_place.name);
  getNewPhotos(current_place);
},
'mouseenter #place-selector': function (){
  $('#place-selector').focus();
},
'mouseleave #place-selector': function (){
  $('#place-selector').blur();
}
});