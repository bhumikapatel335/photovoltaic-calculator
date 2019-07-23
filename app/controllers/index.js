import Ember from 'ember';
import CONSTANTS from 'photovoltaic-calculator/helpers/contants';
import KConstant from 'photovoltaic-calculator/helpers/kconstant';
import Radiation from 'photovoltaic-calculator/helpers/solarRadiation';
import Overshading from 'photovoltaic-calculator/helpers/overshading';

export default Ember.Controller.extend({

  radiation: Radiation.create(),

  overshadingValues: Overshading.create(),

  init() {
    var kconstant = KConstant.create();
    kconstant.storeKConstants(this.store);
    this.radiation.storeRadiation(this.store);
    this.overshadingValues.storeOvershading(this.store);
  },

  totalEnergy: Ember.computed('model.length', function() {
    var photovoltaicValues = this.store.peekAll('photovoltaic');
    var totalEnergy = 0;
    photovoltaicValues.forEach(function(photovoltaic) {
      var energy = photovoltaic.get('energy');
      console.log('energy is:' + energy);
      totalEnergy = totalEnergy + energy;
    });
    return totalEnergy;
  }),

  checkLeapYear: function(currentYear) {
    return (currentYear % 100 === 0) ? (currentYear % 400 === 0) : (currentYear % 4 === 0);
  },

  daysInYear: function(currentYear) {
    return this.checkLeapYear(currentYear) ? 366 : 365;
  },

  actions: {
    addPhotovoltaic: function(peakPower, orientation, elevation, overshading) {
      var solarRadiations = this.store.peekAll('solar-radiation');
      var totalSolarRadiation = 0;
      var store = this.store;
      var rad = this.radiation;
      solarRadiations.forEach(function(solarRadiation) {
        var monthId = solarRadiation.get('monthId');
        console.log("Month Id : " + monthId);
        console.log("orientation is:" + orientation);
        totalSolarRadiation = totalSolarRadiation + rad.calculateSolarRadiation(orientation, elevation, monthId, store);
        console.log("total Solar Radiation till Month " + monthId + " is : " + totalSolarRadiation);
      });

      var annualSolarRadiation = 0.024 * totalSolarRadiation;
      console.log("annual radiation is:" + annualSolarRadiation);

      var overshadingFactor = this.overshadingValues.getOvershadingFactor(overshading,store);
      console.log('overshading Factor is:' + overshadingFactor);

      var energyProduced = 0.8 * peakPower * annualSolarRadiation * overshadingFactor;
      console.log('energy produced by pv module:' + energyProduced);

      this.store.createRecord('photovoltaic', {
        peakPower: peakPower,
        orientation: orientation,
        elevation: elevation,
        overshading: overshading,
        energy: energyProduced
      });

    },

    deletePhotovoltaic: function(photovoltaic) {
      this.store.deleteRecord(photovoltaic);
    }
  }
});
