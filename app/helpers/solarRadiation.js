import Ember from 'ember';
import CONSTANTS from 'photovoltaic-calculator/helpers/contants';

export default Ember.Object.extend({
  storeRadiation: function(store) {
    var months = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
    var declinationValue = new Array(-20.7, -12.8, -1.8, 9.8, 18.8, 23.1, 21.2, 13.7, 2.9, -8.7, -18.4, -23.0);
    var solarFluxValue = new Array(26, 54, 96, 150, 192, 200, 189, 157, 115, 66, 33, 21);

    months.forEach(function(month, index) {
      store.createRecord('solarRadiation', {
        monthId: month,
        declinationValue: declinationValue[index],
        solarFluxValue: solarFluxValue[index]
      });
    });
  },

  calculateSolarRadiation: function(orientation, elevation, month, store) {
    var kValueMap = this.getKValueMap(store, orientation);

    var angleP = this.convertDegreeToRadian(elevation);

    //calculate sinPby2, sinPby2Square and sinPby2Cube
    var sinPby2 = Math.sin(angleP / 2);
    var sinPby2Square = Math.pow(sinPby2, 2);
    var sinPby2Cube = Math.pow(sinPby2, 3);

    //calculate A,B and C value
    var A = (kValueMap.get('k1') * sinPby2Cube) + (kValueMap.get('k2') * sinPby2Square) + (kValueMap.get('k3') * sinPby2);
    var B = (kValueMap.get('k4') * sinPby2Cube) + (kValueMap.get('k5') * sinPby2Square) + (kValueMap.get('k6') * sinPby2);
    var C = (kValueMap.get('k7') * sinPby2Cube) + (kValueMap.get('k8') * sinPby2Square) + (kValueMap.get('k9') * sinPby2) + 1;

    //Find solar declination and shm
    var allRadiation = store.peekAll('solar-radiation');
    var filteredRadiations = allRadiation.filterBy('monthId', month);
    var declination;
    var shm;

    filteredRadiations.forEach(function(radiation) {
      declination = radiation.get('declinationValue');
      shm = radiation.get('solarFluxValue');
    });

    //calculate rfactor (Rhinc)
    var RFactor = this.getRFactor(declination, A, B, C);

    //calculate solar radiation
    var solarRadiation = shm * RFactor;

    return solarRadiation;
  },

  getKValueMap: function(store, orientation) {
    var kValueMap = new Map();
    var kConstants = store.peekAll('kconstant');
    var filteredKConstants = kConstants.filterBy('orientationType', orientation);

    filteredKConstants.forEach(function(constant) {
      var consName = constant.get('constantName');
      var consValue = constant.get('constantValue');
      kValueMap.set(consName, consValue);
    });
    return kValueMap;
  },

  convertDegreeToRadian: function(degree) {
    return (Math.PI / 180) * degree;
  },

  getRFactor: function(declination, A, B, C) {

    //calculate cos and cosSquare value
    var cosAngle = this.convertDegreeToRadian(declination - CONSTANTS.LATITUDE);
    var cosValue = Math.cos(cosAngle);
    var cosSquare = Math.pow(cosValue, 2);

    var RFactor = (A * cosSquare) + (B * cosValue) + C;

    return RFactor;
  }
});
