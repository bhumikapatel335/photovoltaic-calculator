import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({

  errors: DS.Errors.create(),
  selectedOrientation: null,
  selectedElevation: null,
  selectedOvershading: null,

  actions: {
    setOrientation: function(selected) {
      this.set('selectedOrientation', selected);
    },

    setElevation: function(selected) {
      this.set('selectedElevation', selected);
    },

    setOvershading: function(selected) {
      this.set('selectedOvershading', selected);
    },

    addPhotovoltaic: function() {
      var peakPower = this.get('peakPower');
      var orientation = this.get('selectedOrientation');
      var elevation = this.get('selectedElevation');
      var overshading = this.get('selectedOvershading');

      if (this.validateInput(peakPower, orientation, elevation, overshading)) {

        // Send action to controller
        this.sendAction('addPhotovoltaic', peakPower, orientation, elevation, overshading);

        // Reset all the components after adding Photovoltaic
        this.resetAll();
      }
    }
  },

  //validate all the input fields
  validateInput: function(peakPower, orientation, elevation, overshading) {

    this.set('errors', DS.Errors.create());

    if (peakPower === undefined || peakPower.trim() === '') {
      this.get('errors').add('peakPower', "Peak Power cannot be empty");
    } else if (isNaN(peakPower)) {
      this.get('errors').add('peakPower', "Please enter number only");
    }

    if (orientation === null) {
      this.get('errors').add('orientation', "Please select Orientation");
    }

    if (elevation === null) {
      this.get('errors').add('elevation', "Please select Elevation");
    }

    if (overshading === null) {
      this.get('errors').add('overshading', "Please select Overshading");
    }

    return this.get('errors.isEmpty');
  },

  resetAll: function() {
    document.getElementById("orientation").selectedIndex = 0;
    document.getElementById("elevation").selectedIndex = 0;
    document.getElementById("overshading").selectedIndex = 0;

    this.setProperties({
      peakPower: '',
      selectedOrientation: null,
      selectedElevation: null,
      selectedOvershading: null
    });
  }
});
