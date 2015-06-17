var Main = (function(my, Helpers){
  my.instance = {};
  my.init = function(){
    console.log('init');
    my.instance = new Kokus();
  }
  return my;
}(Main || {}, Helpers || {}));
 
 
Main.init();