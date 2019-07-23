import DS from 'ember-data';

export default DS.Model.extend({
  constantName: DS.attr('string'),
  orientationType: DS.attr('string'),
  constantValue: DS.attr('number')
});
