import Ember from 'ember';
import KConstant from 'photovoltaic-calculator/helpers/kconstant';
import Radiation from 'photovoltaic-calculator/helpers/solarRadiation';
import Overshading from 'photovoltaic-calculator/helpers/overshading';

export default Ember.Controller.extend({

  radiation: Radiation.create(),

  overshadingValues: Overshading.create(),

  //store table U3, table U4 and table U5 data
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
      totalEnergy = totalEnergy + energy;
    });

    return totalEnergy;
  }),

  checkLeapYear: function(currentYear) {
    return (currentYear % 100 === 0) ? (currentYear % 400 === 0) : (currentYear % 4 === 0);
  },

  actions: {
    addPhotovoltaic: function(peakPower, orientation, elevation, overshading) {
      var solarRadiations = this.store.peekAll('solar-radiation');
      var totalSolarRadiation = 0;
      var store = this.store;
      var rad = this.radiation;

      //calculate solar radiation for each month
      solarRadiations.forEach(function(solarRadiation) {
        var monthId = solarRadiation.get('monthId');
        totalSolarRadiation = totalSolarRadiation + rad.calculateSolarRadiation(orientation, elevation, monthId, store);
      });

      var annualSolarRadiation = 0.024 * totalSolarRadiation;

      var overshadingFactor = this.overshadingValues.getOvershadingFactor(overshading,store);

      var energyProduced = 0.8 * peakPower * annualSolarRadiation * overshadingFactor;

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
