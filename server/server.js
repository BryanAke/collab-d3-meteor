// Collab d3 and Meteor Diarams -- server

Meteor.publish("cards", function () {
  return Cards.find({});
});


Meteor.startup(function () {
    if (Cards.find().count() === 0) {
/*
        var c1 = Card().x(0.25).y(0.25).text('Default Text 1');
        var c2 = Card().x(0.5).y(0.5).text('Default Text 2');
        
        Cards.insert(c1);
        Cards.insert(c2);
*/        
//        Cards.insert({x: 0.25, y: 0.25, text: 'Default Text 1'})
//        Cards.insert({x: 0.5, y: 0.5, text: 'Default Text 2'})
    }
});