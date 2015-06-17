Kokus.World = function(options, kokusObject){
  options = !Helpers.isEmpty(options) ? options : {baseColor: {}};
  options.baseColor = options.baseColor || {};
  this.options = {baseColor: {}};

  if(options.baseColor.r && options.baseColor.g && options.baseColor.b){
    this.options.baseColor.r = options.baseColor.r;
    this.options.baseColor.g = options.baseColor.g;
    this.options.baseColor.b = options.baseColor.b;
  } else {
    this.options.baseColor.r = Config.world.baseColor.r;
    this.options.baseColor.g = Config.world.baseColor.g;
    this.options.baseColor.b = Config.world.baseColor.b;
  }

  this.options.baseColorVariation = options.baseColorVariation || Config.world.baseColorVariation;
  this.options.radius = options.radius || Config.world.radius;
  this.options.segments = options.segments || Config.world.segments;
  this.options.wireframe = options.wireframe || false;

  this.kokusObject = kokusObject;

  this.generate();
  return this;
};
Kokus.World.prototype = {
  kokusObject: {},
  planet: {},
  generate: function(){
    var _self = this;

    var material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      wireframe: false,
      transparent: false,
      vertexColors: THREE.FaceColors, // CHANGED
      overdraw: true
    });
    var geometry = new THREE.SphereGeometry(_self.options.radius, _self.options.segments, _self.options.segments);
    _self.planet = new THREE.Mesh(geometry, material);

    _self.changeFaces();
    _self.kokusObject.scene.add(_self.planet);
    // Add animate function to rendering. To animate the world.
    // _self.kokusObject.animations.push({
    //   function: _self.animate,
    //   scope: _self
    // });
  },
  changeFaces: function(){
    var _self = this;
    _self.planet.geometry.faces.forEach(function(val, index){
      var red = Helpers.randomVariation(_self.options.baseColor.r, _self.options.baseColorVariation);
      var green = Helpers.randomVariation(_self.options.baseColor.g, _self.options.baseColorVariation);
      var blue = Helpers.randomVariation(_self.options.baseColor.b, _self.options.baseColorVariation);
 
      red = Helpers.mapValue(red, 0,255,0,1);
      green = Helpers.mapValue(green, 0,255,0,1);
      blue = Helpers.mapValue(blue, 0,255,0,1);
      
      val.color.setRGB(red, green, blue);
    });
  },
  animate: function(){
    var _self = this;
    _self.planet.rotation.y += 0.01;
  }
};