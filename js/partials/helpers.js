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
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = my.clone(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = my.clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  };
  my.isEmpty = function(obj){
    for(var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };
  return my;
}(Helpers || {}));


Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};