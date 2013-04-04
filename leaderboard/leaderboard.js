// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    if(Session.get("sort_name") === true){
      return Players.find({}, {sort: {name: 1}});
    } else {
      return Players.find({}, {sort: {score: -1, name: 1}});
    }
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click input.dec': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: -5}});
    },
    'click input.sortn': function () {
      Session.set("sort_name", true);
    },
    'click input.sortv': function () {
      Session.set("sort_name", false);
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    },
    'click input.delete': function (){
      Players.remove(this._id)
    }
  });

  Template.new_player.events({
    'click input.addbutton': function () {
      var new_player = $('input.addfield').val();
      console.log(new_player)
      Players.insert({name: new_player, score: 0});
    }
  })
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Math.random()*10)*5});
    }
  });
}
