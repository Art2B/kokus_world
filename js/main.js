
var Main = (function(my, Helpers){
  my.instance = {};
  my.init = function(){
    console.log('init');
    my.instance = new Kokus();
    var arbre = new Kokus.Tree({x: 50, y: 50, z: 50}, {}, my.instance);
    var maison = new Kokus.House({x: 150, y: 150, z: 150}, {}, my.instance);
  }
  return my;
}(Main || {}, Helpers || {}));

Main.init(); 
 

// var kok = new Kokus();
// var array = [new Kokus.Mountain(null, null, kok)];
// var rotation = {};
// rotation.x = 12;
// var mountain = new Kokus.Mountain(rotation, {elements: array}, kok);
// console.log(mountain.collision());