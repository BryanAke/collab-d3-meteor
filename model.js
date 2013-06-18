// PMASETools Cards -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Cards

/*
  Each card is represented by a document in the Cards collection:
    x, y: Number (screen coordinates in the interval [0, 1])
    text, description: String
  Eventually:
    owner: user id
*/
Cards = new Meteor.Collection("cards");

Cards.allow({
  insert: function (userId, card) {
    return false; // no cowboy inserts -- use createCard method
  },
  update: function (userId, card, fields, modifier) {
/* no users yet
  if (userId !== card.owner)
      return false; // not the owner
*/
    var allowed = ["text", "description", "x", "y"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, party) {
    // cant remove yet
    return false;
  }
});

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});

var Coordinate = Match.Where(function (x) {
  check(x, Number);
  return x >= 0 && x <= 500;
});

Meteor.methods({
  // options should include: text, description, x, y
  createCard: function (options) {
    check(options, {
      text: NonEmptyString,
//      description: NonEmptyString,
      x: Coordinate,
      y: Coordinate
    });

    // tweak as necessary, showing some data validation
    if (options.text.length > 100)
      throw new Meteor.Error(413, "Text too long");
//    if (options.description.length > 1000)
//      throw new Meteor.Error(413, "Description too long");
/* no users yet    
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
*/
    return Cards.insert({
//      owner: this.userId,
      x: options.x,
      y: options.y,
      text: options.text,
//      description: options.description,
    });
  },
});

///////////////////////////////////////////////////////////////////////////////
// Users - Coming soon
/*
displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};
*/