import Ember from 'ember';

export default Ember.Object.extend({
  storeOvershading: function(store) {
    var overshadingType = new Array('heavy', 'significant', 'modest', 'little or none');
    var overshadingFactor = new Array(0.5, 0.65, 0.8, 1.0);

    overshadingType.forEach(function(overshading, index) {
      store.createRecord('overshading', {
        overshadingType: overshading,
        overshadingFactor: overshadingFactor[index]
      });
    });
  },
  getOvershadingFactor: function(overshading, store) {
    var allovershading = store.peekAll('overshading');
    var filterOvershanding = allovershading.filterBy('overshadingType', overshading);
    var overshadingFactor = 0;

    filterOvershanding.forEach(function(overshading) {
      overshadingFactor = overshading.get('overshadingFactor');
    });

    return overshadingFactor;
  }
});
