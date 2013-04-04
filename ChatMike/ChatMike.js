Messages = new Meteor.Collection('messages');

if (Meteor.isClient) {

  Template.main.events({
    'click #submit': function () {
      var nameEntry = $('#name').val();
      var text = $('#entermessage').val();
      if(nameEntry){
        console.log("hey")
        var ts = Date.now() / 1000;
        Messages.insert({name: nameEntry, message: text, time: ts});
        $('#entermessage').val("");
      }
    }
  });

  Template.messages.messages = function (){
    return Messages.find({},{sort: {time: -1}});
  };
}