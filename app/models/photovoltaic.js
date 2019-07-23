import DS from 'ember-data';

export default DS.Model.extend({
  peakPower: DS.attr('number'),
  orientation: DS.attr('string'),
  elevation: DS.attr('string'),
  overshading: DS.attr('string'),
  energy: DS.attr('number')
});
