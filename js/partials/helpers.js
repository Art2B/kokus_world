var Helpers = (function(my){
  // Variation is in percentage
  my.randomVariation = function(value, variation){
    return my.getRandomInt(Math.floor(value * (100-variation)/100), Math.floor(value * (100+variation)/100));
  }
  my.getRandomInt = function(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  };
  my.mapValue = function(value, start1, stop1, start2, stop2){
    return ((stop2-start2)*(value-start1) / (stop1-start1)) + start2; 
  };
  my.checkValue = function(value){
    if(value != undefined){
      return true;
    }
    return false;
  };
  my.clone = function(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = my.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = my.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }



  return my;
}(Helpers || {}));