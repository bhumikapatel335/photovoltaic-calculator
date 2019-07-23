import DS from 'ember-data';

export default DS.Model.extend({
  overshadingType: DS.attr('string'),
  overshadingFactor: DS.attr('number')
});
