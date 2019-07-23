import Ember from 'ember';

export default Ember.Object.extend({
  storeKConstants: function(store) {
    var constantName = new Array('k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9');
    var north = new Array(26.3, -38.5, 14.8, -16.5, 27.3, -11.9, -1.06, 0.0872, -0.191);
    var northEastOrWest = new Array(0.165, -3.68, 3.0, 6.38, -4.53, -0.405, -4.38, 4.89, -1.99);
    var eastOrWest = new Array(1.44, -2.36, 1.07, -0.514, 1.89, -1.64, -0.542, -0.757, 0.604);
    var southeastOrWest = new Array(-2.95, 2.89, 1.17, 5.67, -3.54, -4.28, -2.72, -0.25, 3.07);
    var south = new Array(-0.66, -0.106, 2.93, 3.63, -0.374, -7.4, -2.71, -0.991, 4.59);

    constantName.forEach(function(constant, index) {
      store.createRecord('kconstant', {
        orientationType: 'north',
        constantName: constant,
        constantValue: north[index]
      });
    });

    constantName.forEach(function(constant, index) {
      store.createRecord('kconstant', {
        orientationType: 'north east',
        constantName: constant,
        constantValue: northEastOrWest[index]
      });
    });

    constantName.forEach(function(constant, index) {
      store.createRecord('kconstant', {
        orientationType: 'north west',
        constantName: constant,
        constantValue: northEastOrWest[index]
      });
    });

    constantName.forEach(function(constant, index) {
      store.createRecord('kconstant', {
        orientationType: 'east',
        constantName: constant,
        constantValue: eastOrWest[index]
      });
    });

    constantName.forEach(function(constant, index) {
      store.createRecord('kconstant', {
        orientationType: 'west',
        constantName: constant,
        constantValue: eastOrWest[index]
      });
    });

    constantName.forEach(function(constant, index) {
      store.createRecord('kconstant', {
        orientationType: 'south east',
        constantName: constant,
        constantValue: southeastOrWest[index]
      });
    });

    constantName.forEach(function(constant, index) {
      store.createRecord('kconstant', {
        orientationType: 'south west',
        constantName: constant,
        constantValue: southeastOrWest[index]
      });
    });

    constantName.forEach(function(constant, index) {
      store.createRecord('kconstant', {
        orientationType: 'south',
        constantName: constant,
        constantValue: south[index]
      });
    });
  }
});
