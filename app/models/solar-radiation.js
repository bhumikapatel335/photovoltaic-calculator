import DS from 'ember-data';

export default DS.Model.extend({
  monthId: DS.attr('number'),
  declinationValue: DS.attr('number'),
  solarFluxValue: DS.attr('number')
});
