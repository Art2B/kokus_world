Kokus.House = function(rotation, options, kokusObject){
  this.options = {};

  rotation = rotation || {};
  this.options.rotation = {};
  this.options.rotation.x = rotation.x || 0;
  this.options.rotation.y = rotation.y || 0;
  this.options.rotation.z = rotation.z || 0;

  var defaultOption = Config.house.cottage;
  options = options || {color:{}};
  options.color = options.color || {};

  this.options.color = {};
  this.options.color.roof = options.color.roof || defaultOption.color.roof;
  this.options.color.base = options.color.base || defaultOption.color.base;
  this.options.houseBaseSize = options.houseBaseSize || defaultOption.houseBaseSize;
  this.options.chimneyBaseSize = this.options.houseBaseSize/4;
  this.options.roofBaseSize = this.options.houseBaseSize/2;

  this.kokusObject = kokusObject;

  this.create();
  return this;
};
Kokus.House.prototype = {
  kokusObject: {},
  house: {},
  pivot: {},
  create: function(){
    var _self = this;

    var roofBaseSize = _self.options.roofBaseSize;
    var houseBaseSize = _self.options.houseBaseSize;
    var chimneyBaseSize = _self.options.chimneyBaseSize;

    var materialRoof = new THREE.LineBasicMaterial({color: _self.options.color.roof});
    var materialBase = new THREE.LineBasicMaterial({color: _self.options.color.base});
    var materialChimney = new THREE.LineBasicMaterial({color: _self.options.color.base});
    
    var geometryRoof = new THREE.CylinderGeometry( roofBaseSize, houseBaseSize, roofBaseSize, 4);
    var geometryBase = new THREE.CylinderGeometry( houseBaseSize, houseBaseSize, houseBaseSize, 4);
    var geometryChimney = new THREE.CylinderGeometry( chimneyBaseSize, chimneyBaseSize, houseBaseSize, 4);

    var cottageRoof = new THREE.Mesh( geometryRoof, materialRoof);
    var cottageBase = new THREE.Mesh( geometryBase, materialBase);
    var cottageChimney = new THREE.Mesh( geometryChimney, materialChimney);

    cottageBase.applyMatrix( new THREE.Matrix4().makeTranslation(0, houseBaseSize/2, 0) );
    cottageRoof.applyMatrix( new THREE.Matrix4().makeTranslation(0,houseBaseSize+(roofBaseSize/2), 0) );
    cottageChimney.applyMatrix( new THREE.Matrix4().makeTranslation((roofBaseSize/2)+(chimneyBaseSize/2),houseBaseSize+(chimneyBaseSize/2), 0) );

    _self.house = new THREE.Mesh();
    _self.house.add(cottageRoof).add(cottageBase).add(cottageChimney);
    _self.house.position.y = _self.kokusObject.world.planet.geometry.parameters.radius;

    _self.pivot = new THREE.Object3D();
    _self.pivot.add(_self.house);
    _self.pivot.rotation.set(Math.radians(_self.options.rotation.x), Math.radians(_self.options.rotation.y), Math.radians(_self.options.rotation.z));

  _self.kokusObject.scene.add(_self.pivot);
  },
  animate: function(){
    console.log('animate function');
  }
};