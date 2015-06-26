Kokus.Mountain = function(rotation, options, kokusObject, save){
  this.options = {};

  rotation = rotation || {};
  this.options.rotation = {};
  this.options.rotation.x = rotation.x || 0;
  this.options.rotation.y = rotation.y || 0;
  this.options.rotation.z = rotation.z || 0;

  var defaultOption = Config.mountain.snow;
  options = options || {color:{}};
  options.color = options.color || {};

  this.options.color = {};
  this.options.color.snow = options.color.snow || defaultOption.color.snow;
  this.options.color.base = options.color.base || defaultOption.color.base;
  this.options.mountainBaseSize = options.mountainBaseSize || defaultOption.mountainBaseSize;

  this.options.save = (save !== undefined) ? save : true;
    
  this.kokusObject = kokusObject;

  this.create();
  return this;
};
Kokus.Mountain.prototype = {
  kokusObject: {},
  mountain: {},
  pivot: {},
  create: function(){
    var _self = this;

    var mountainBaseSize = _self.options.mountainBaseSize;

    var materialTop = new THREE.LineBasicMaterial({color: _self.options.color.snow});
    var materialBase = new THREE.LineBasicMaterial({color: _self.options.color.base});
    
    var geometryTop = new THREE.CylinderGeometry( 0, mountainBaseSize/3, mountainBaseSize/3, 4);
    var geometryBase = new THREE.CylinderGeometry( 0, mountainBaseSize, mountainBaseSize, 4);

    var snowTop = new THREE.Mesh( geometryTop, materialTop);
    var snowBase = new THREE.Mesh( geometryBase, materialBase);

    snowTop.applyMatrix( new THREE.Matrix4().makeTranslation(0, (mountainBaseSize/2), 0) );
    snowBase.applyMatrix( new THREE.Matrix4().makeTranslation(0, (mountainBaseSize*0.3)/2, 0) );

    _self.mountain = new THREE.Mesh();
    _self.mountain.add(snowTop).add(snowBase);
    _self.mountain.position.y = _self.kokusObject.world.planet.geometry.parameters.radius;

    _self.pivot = new THREE.Object3D();
    _self.pivot.add(_self.mountain);
    _self.pivot.rotation.set(Math.radians(_self.options.rotation.x), Math.radians(_self.options.rotation.y), Math.radians(_self.options.rotation.z));

    _self.kokusObject.scene.add(_self.pivot);

    _self.mountain.scale.x = 0;
    _self.mountain.scale.y = 0;
    _self.mountain.scale.z = 0;
    _self.kokusObject.animations.push({
      function: _self.animate,
      scope: _self
    });

    if(_self.options.save) {
        var savedComponents = JSON.parse(localStorage.getItem("worldElements"));      
        savedComponents.push({
            type: "mountain",
            //  baseY: _self.tree.position.baseY,
            options: _self.options
        });
        localStorage.setItem("worldElements", JSON.stringify(savedComponents));
    }
  },
  animate: function(){
    var _self = this;
    var isGrowing;

    if(_self.mountain.scale.x >= 1){
      isGrowing = false;
    }
    else{
      isGrowing = true;
    }

    if(isGrowing){
      _self.mountain.scale.x += 0.05;
      _self.mountain.scale.y += 0.05;
      _self.mountain.scale.z += 0.05;
    }
  }
};