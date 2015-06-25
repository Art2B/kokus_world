Kokus.House = function(rotation, options, kokusObject, save){
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

  this.options.save = (save !== undefined) ? save : true;

  this.options.elements = options.elements || [];

  this.kokusObject = kokusObject;  

  // Need to check collision
  this.create();
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
    var space = houseBaseSize / 3;

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
    _self.house.position.y = _self.kokusObject.world.planet.geometry.parameters.radius - space;
    _self.house.position.baseY = _self.house.position.y;

    _self.pivot = new THREE.Object3D();
    _self.pivot.add(_self.house);
    _self.pivot.rotation.set(Math.radians(_self.options.rotation.x), Math.radians(_self.options.rotation.y), Math.radians(_self.options.rotation.z));

    _self.kokusObject.scene.add(_self.pivot);
    _self.house.scale.x = 0;
    _self.house.scale.y = 0;
    _self.house.scale.z = 0;
    _self.kokusObject.animations.push({
      function: _self.animate,
      scope: _self
    });
      
    if(_self.options.save) {
        var savedComponents = JSON.parse(localStorage.getItem("worldElements"));      
        savedComponents.push({
            type: "house",
            //  baseY: _self.tree.position.baseY,
            options: _self.options
        });
        localStorage.setItem("worldElements", JSON.stringify(savedComponents));
    }

    return _self;
  },
  collision: function(){
    var _self = this;

    var houseBaseSize = _self.options.houseBaseSize;
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

      if(typeof elements[i].house !== undefined)
        totalElementsWidth = elements[i].house.children[1].geometry.parameters.radiusBottom + houseBaseSize;
      else if(typeof elements[i].tree !== undefined)
        totalElementsWidth = elements[i].tree.children[0].geometry.parameters.radiusBottom + houseBaseSize;
      else if(typeof elements[i].mountain !== undefined)
        totalElementsWidth = elements[i].mountain.children[1].geometry.parameters.radiusBottom + houseBaseSize;

      console.log(totalElementsWidth);
      if (totalElementsWidth >= distance.hypotenuse)
        return true;
    };

    return false;
  },
  animate: function(){
    var _self = this;
    var isGrowing;

    if(_self.house.position.y < _self.house.position.yNeeded){
      if(_self.house.position.yNeeded - _self.house.position.y > 0.1){
        _self.house.position.y += 0.1;
      } else {
        _self.house.position.y += _self.house.position.yNeeded - _self.house.position.y;
      }
    }

    if(_self.house.scale.x >= 1){
      isGrowing = false;
    }
    else{
      isGrowing = true;
    }

    if(isGrowing){
      _self.house.scale.x += 0.05;
      _self.house.scale.y += 0.05;
      _self.house.scale.z += 0.05;
    }
  }
};