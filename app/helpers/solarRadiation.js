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
    var sinPby2 = Math.sin(angleP / 2);
    console.log("sine value is:" + sinPby2);
    var sinPby2Square = Math.pow(sinPby2, 2);
    console.log("sine square value is:" + sinPby2Square);
    var sinPby2Cube = Math.pow(sinPby2, 3);
    console.log("sine cube value is:" + sinPby2Cube);

    //calculate A,B and C value
    var A = (kValueMap.get('k1') * sinPby2Cube) + (kValueMap.get('k2') * sinPby2Square) + (kValueMap.get('k3') * sinPby2);
    console.log("A value is:" + A);
    var B = (kValueMap.get('k4') * sinPby2Cube) + (kValueMap.get('k5') * sinPby2Square) + (kValueMap.get('k6') * sinPby2);
    console.log("B value is:" + B);
    var C = (kValueMap.get('k7') * sinPby2Cube) + (kValueMap.get('k8') * sinPby2Square) + (kValueMap.get('k9') * sinPby2) + 1;
    console.log("C value is:" + C);

    //Find solar declination and shm
    var allRadiation = store.peekAll('solar-radiation');
    var filteredRadiations = allRadiation.filterBy('monthId', month);
    var declination;
    var shm;
    filteredRadiations.forEach(function(radiation) {
      declination = radiation.get('declinationValue');
      shm = radiation.get('solarFluxValue');
      console.log("declination Value is:" + declination);
      console.log("shm value is:" + shm);
    });

    //calculate rfactor (Rhinc)
    var RFactor = this.getRFactor(declination, A, B, C);

    //calculate solar radiation
    var solarRadiation = shm * RFactor;
    console.log("solar radiation value is for month " + month + " is : " + solarRadiation);

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
    var cosAngle = this.convertDegreeToRadian(declination - CONSTANTS.LATITUDE);
    var cosValue = Math.cos(cosAngle);
    console.log("cos value is: " + cosValue);

    var cosSquare = Math.pow(cosValue, 2);
    console.log("cos square value is: " + cosSquare);

    var RFactor = (A * cosSquare) + (B * cosValue) + C;
    console.log("Rfactor value is:" + RFactor);

    return RFactor;
  }
});
