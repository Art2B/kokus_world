Kokus.Mountain = function(rotation, options, kokusObject){
  this.options = {};

  rotation = rotation || {};
  this.options.rotation = {};
  this.options.rotation.x = rotation.x || 0;
  this.options.rotation.y = rotation.y || 0;
  this.options.rotation.z = rotation.z || 0;

  var defaultOption = Config.mountain.snow;
  options = options || {color:{}};
  options.color = options.color || {};

  this.options.elements = options.elements || [];

  this.options.color = {};
  this.options.color.snow = options.color.snow || defaultOption.color.snow;
  this.options.color.base = options.color.base || defaultOption.color.base;
  this.options.mountainBaseSize = options.mountainBaseSize || defaultOption.mountainBaseSize;

  this.kokusObject = kokusObject;

  // Need to check collision
  this.create();
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
    _self.mountain.position.baseY = _self.mountain.position.y;

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

    return _self;
  },
  animate: function(){
    var _self = this;
    var isGrowing;

    if(_self.mountain.position.y < _self.mountain.position.yNeeded){
      if(_self.mountain.position.yNeeded - _self.mountain.position.y > 0.1){
        _self.mountain.position.y += 0.1;
      } else {
        _self.mountain.position.y += _self.mountain.position.yNeeded - _self.mountain.position.y;
      }
    }
    
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
  },
  collision: function(){
    var _self = this;

    var mountainBaseSize = _self.options.mountainBaseSize;
    var rotation = _self.options.rotation;
    var radius = _self.kokusObject.world.planet.geometry.parameters.radius;
    var elements = _self.options.elements;

    for (var i = 0; i < elements.length; i++) {
      var angle = {};
      var distance = {};
      var totalElementsWidth;

      // Calcul de l'angle sur l'axe Z entre la maison et l'element i du tableau de tout les elements du monde
      if(Math.radians(rotation.z) > Math.radians(elements[i].pivot.rotation._z))
        angle.z = Math.radians(rotation.z) - Math.radians(elements[i].pivot.rotation._z);
      else if(Math.radians(rotation.z) < Math.radians(elements[i].pivot.rotation._z))
        angle.z = Math.radians(elements[i].pivot.rotation._z) - Math.radians(rotation.z);
      else
        angle.z = 0;

      // Calcul de l'angle sur l'axe X entre la maison et l'element i du tableau de tout les elements du monde
      if(Math.radians(rotation.x) > Math.radians(elements[i].pivot.rotation._x))
        angle.x = Math.radians(rotation.x) - Math.radians(elements[i].pivot.rotation._x);
      else if(Math.radians(rotation.x) < Math.radians(elements[i].pivot.rotation._x))
        angle.x = Math.radians(elements[i].pivot.rotation._x) - Math.radians(rotation.x);
      else
        angle.x = 0;

      console.log(angle);

      // Calcul de la distance sur le plan XY entre la maison et l'element u du tableau de tout les elements du monde
      distance.xy = Math.sqrt(2 * radius*radius - 2 * radius*radius * Math.cos(angle.z));
      // Calcul de la distance sur le plan YZ entre la maison et l'element u du tableau de tout les elements du monde
      distance.yz = Math.sqrt(2 * radius*radius - 2 * radius*radius * Math.cos(angle.x));

      // Calcul de l'hypoténuse du triangle des 2 distances précédentes
      distance.hypotenuse = Math.sqrt(distance.xy*distance.xy + distance.yz*distance.yz);

      console.log(distance);

      if(elements[i].house !== undefined)
        totalElementsWidth = elements[i].house.children[1].geometry.parameters.radiusBottom + mountainBaseSize;
      else if(elements[i].tree !== undefined)
        totalElementsWidth = elements[i].tree.children[0].geometry.parameters.radiusBottom + mountainBaseSize;
      else if(elements[i].mountain !== undefined)
        totalElementsWidth = elements[i].mountain.children[1].geometry.parameters.radiusBottom + mountainBaseSize;

      console.log(totalElementsWidth);
      if (totalElementsWidth >= distance.hypotenuse)
        return true;
    };

    return false;
  }
};