/*
var Main = (function(my, Helpers){
  my.instance = {};
  my.init = function(){
    console.log('init');
    my.instance = new Kokus();
  }
  return my;
}(Main || {}, Helpers || {}));
*/
 
 
var kok = new Kokus();
var array = [new Kokus.Mountain(null, null, kok)];
var rotation = {};
rotation.x = 12;
var mountain = new Kokus.Mountain(rotation, {elements: array}, kok);
console.log(mountain.collision());