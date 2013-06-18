// PMSAE Tools Crads -- client

Meteor.subscribe("cards");

// If no card selected, select one.
Meteor.startup(function () {
  Deps.autorun(function () {
    if (! Session.get("selected")) {
      var card = Cards.findOne();
      if (card)
        Session.set("selected", card._id);
    }
  });
});

///////////////////////////////////////////////////////////////////////////////
// Details sidebar - nothing happening yet

Template.details.card = function () {
  return Cards.findOne(Session.get("selected"));
};

var ENTER = 13;
  
var Z = 1;

var ZOOM = 1;

var card_collection = window.card_collection = [];

function Card(){
    var my = {
        x: 0,
        y: 0,
        text: null,
        id: +(new Date()) + Math.random()
    };

    function wrap(attr){
        return function(val){
            if(val === void 0){ return my[attr]; }
            my[attr] = val;
            return api;
        };
    }

    var api = {
        x: wrap("x"),
        y: wrap("y"),
        text: wrap("text"),
        id: wrap("id")
    };
    
    return api;
}

// Use jquery to get the position clicked relative to the map element.
var coordsRelativeToElement = function (element, event) {
  var offset = $(element).offset();
  var x = event.pageX - offset.left;
  var y = event.pageY - offset.top;
  return { x: x, y: y };
};

Template.cards.events({
  'mousedown circle, mousedown text': function (event, template) {
    Session.set("selected", event.currentTarget.id);
  },
  'dblclick .cards': function (event, template) {
// NO USERS YET
//    if (! Meteor.userId()) // must be logged in to create events
//      return;
    var coords = coordsRelativeToElement(event.currentTarget, event);
//    openCreateDialog(coords.x, coords.y);
    var card = Card().x(coords.x).y(coords.y).text('Default Text');
    card._editable = 1;
    card_collection.push(card);
    
    console.log('card: ', card, 'card.text(): ', card.text())
    console.log('coords: ', coords)
    
    Meteor.call('createCard', {
        text: card.text(),
        x: coords.x, 
        y: coords.y, 
      }, function (error, card) {
        if (! error) {
          Session.set("selected", card);
        }
      });
  },
  'dblclick .card': function (event, template) {
//    alert('card edit!');
    console.log('clicked card event: ', event);
    console.log('clicked card template: ', template);
    event.currentTarget._editable = true;
    d3.select(event.currentTarget).select(".text").node().focus();
    event.stopPropagation();
/*    
    d._editable = true;
    render();
    d3.select(this).select(".text").node().focus();
    d3.event.stopPropagation();
*/
  }
});

Template.cards.rendered = function () {
    var self = this;
    self.node = self.find(".cards");
    

/*    
    Card.create = function(){
        var card = Card().x(d3.event.x).y(d3.event.y);
        card._editable = 1;
        card_collection.push(card);
//        render();

        var div = d3.selectAll(".card").filter(function(d){
            return d === card;
        }).node();

        Card.click.call(div, card);
    };
  
    Card.click = function(d, i){
        d._editable = true;
        render();
        d3.select(this).select(".text").node().focus();
        d3.event.stopPropagation();
    };
  
    Card.keyup = function(d, i){
        if(d3.event.shiftKey && d3.event.keyCode === ENTER){
            Card.save(d, i);
        }
    };
  
    Card.save = function(d, i){
        if(d._editable){ return; }
        console.log("saved!");
        this.blur();
        var text = d3.select(this);
        d.text(this.innerHTML);
        d._editable = false;
        render();
    };
*/  
    Card.zoom = function(){
        var regex = {
            scale: /scale\(([\d\.]*)\)/,
            mtx: /matrix\(([\d\.]*), /,
        };
        var old_zoom = (
            root.style("transform") || 
            root.style("-webkit-transform") ||
            "");

        d3.entries(regex).map(function(regex, key){
            var match = old_zoom.match(regex.value);
            if(match !== null){
                old_zoom = +match[1];
            }
        });

        if(!old_zoom === null){
            old_zoom = 1;
        }
        ZOOM = Math.max(0.01, old_zoom + d3.event.wheelDelta / 1000);
        root.call(xb_scale(ZOOM));
    };
  
  Card.drag = d3.behavior.drag()
    .origin(function(){
      var that = d3.select(this);
      return {
        x: parseInt(that.style("left")),
        y: parseInt(that.style("top"))
      }
    })
    .on("drag", function(d, i){
      if(editable(d)){return;}
      
      console.log('Card.drag d: ', d, ' i: ', i)
      
      d.x(d3.event.x)
        .y(d3.event.y);
        
      d3.select(this)
        .style("left", d3.event.x + "px")
        .style("top", d3.event.y + "px")
        .style("z-index", Z++);
    });
  
    function attr(att){
        return function(d){
            return d[att];
        };
    }
  
    attr.px = function(att){
        var func = attr(att);
        return function(d, i){
            return func(d, i) + "px";
        };
    };
  
    function xb_scale(amount){
        var val = "scale(" + amount + ")";
        return function(selection){
            selection
            .transition()
            .style("transform", val)
            .style("-webkit-transform", val)
        };
    }
      
    if (! self.handle) {
        // initialize the frame
        var root = d3.select(".cards")
            .on("mousewheel", Card.zoom)
            .selectAll("#root")
            .data([1]);

        root.enter().append("div")
            .attr("id", "root")
            .on("dblclick", Card.create)
            .call(xb_scale(ZOOM));

            function editable(d, i){
            return d._editable;
        }
        
        self.handle = Deps.autorun(function () {
            card_collection = Cards.find().fetch();
            console.log('card_collection: ', card_collection);
            
            var card = root.selectAll(".card")
                .data(card_collection),
            card_init = card.enter()
                .append("div")
                .attr("class", "card")
                .call(Card.drag)
                .style("left", function(d){ return d.x+"px"; })
                .style("top", function(d){ return d.y+"px"; })
                .on("dblclick", Card.click);
      
            card_init.append("div")
                .classed("text", 1)
                .on("keydown", Card.keyup)
                .on("blur", function(d, i){
                    d._editable = false;
                    Card.save.call(this, d,i);
                });
            
            card.select(".text")
                .attr("contenteditable", editable)
                .each(function(d, i){
                    this.innerHTML = d.text;
                });
                
            card
                .style("left", attr.px("x"))
                .style("top", attr.px("y"));
        });
    }
};

Template.cards.destroyed = function () {
  this.handle && this.handle.stop();
};

///////////////////////////////////////////////////////////////////////////////
// Create Card dialog - not yet used, but will probably make use of it in a tablet setting

var openCreateDialog = function (x, y) {
  Session.set("createCoords", {x: x, y: y});
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

// From the parties example
/*
Template.page.showCreateDialog = function () {
  return Session.get("showCreateDialog");
};

Template.createDialog.events({
  'click .save': function (event, template) {
    var title = template.find(".title").value;
    var description = template.find(".description").value;
    var coords = Session.get("createCoords");

    if (title.length && description.length) {
      Meteor.call('createCard', {
        title: title,
        description: description,
        x: coords.x,
        y: coords.y,
      }, function (error, card) {
        if (! error) {
          Session.set("selected", card);
      });
      Session.set("showCreateDialog", false);
    } else {
      Session.set("createError",
                  "It needs a title and a description, or why bother?");
    }
  },

  'click .cancel': function () {
    Session.set("showCreateDialog", false);
  }
});

Template.createDialog.error = function () {
  return Session.get("createError");
};
*/

