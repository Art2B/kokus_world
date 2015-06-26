Kokus.Tree = function(rotation, options, kokusObject, save){
  this.options = {};

  rotation = rotation || {};
  this.options.rotation = {};
  this.options.rotation.x = rotation.x || 0;
  this.options.rotation.y = rotation.y || 0;
  this.options.rotation.z = rotation.z || 0;

  var defaultOption = Config.tree.pine;
  options = options || {color:{}};
  options.color = options.color || {};

  this.options.color = {};
  this.options.color.leaf = options.color.leaf || defaultOption.color.leaf;
  this.options.color.base = options.color.base || defaultOption.color.base;
  this.options.leafBaseSize = options.leafBaseSize || defaultOption.leafBaseSize;
  this.options.leafBaseHeight = options.leafBaseHeight || defaultOption.leafBaseHeight;

  this.options.save = (save !== undefined) ? save : true;
    
  this.kokusObject = kokusObject;


  // need to check collision
  // this.create();
  return this;
};
Kokus.Tree.prototype = {
  kokusObject: {},
  tree: {},
  pivot: {},
  create: function(){
    var _self = this;

    var materialLeaf = new THREE.LineBasicMaterial({color: _self.options.color.leaf});
    var materialBase = new THREE.LineBasicMaterial({color: _self.options.color.base});
    var geometryLeaf = new THREE.CylinderGeometry( 0, _self.options.leafBaseSize, _self.options.leafBaseHeight, 4);
    var geometryBase = new THREE.CylinderGeometry( _self.options.leafBaseSize/4, _self.options.leafBaseSize/4, _self.options.leafBaseHeight*0.15, 4);       
    var pineLeaf = new THREE.Mesh( geometryLeaf, materialLeaf);
    var pineBase = new THREE.Mesh( geometryBase, materialBase);
    var space = _self.options.leafBaseSize / 10;

    pineLeaf.applyMatrix( new THREE.Matrix4().makeTranslation(0, (_self.options.leafBaseHeight/2)+((_self.options.leafBaseHeight*0.15)/2), 0) );
    pineBase.applyMatrix( new THREE.Matrix4().makeTranslation(0, (_self.options.leafBaseHeight*0.0025), 0) );

    _self.tree = new THREE.Mesh();
    _self.tree.add(pineLeaf).add(pineBase);
    _self.tree.position.y = _self.kokusObject.world.planet.geometry.parameters.radius - space;
    _self.tree.position.baseY = _self.tree.position.y;

    _self.pivot = new THREE.Object3D();
    _self.pivot.add(_self.tree);
    _self.pivot.rotation.set(Math.radians(_self.options.rotation.x), Math.radians(_self.options.rotation.y), Math.radians(_self.options.rotation.z));

    _self.kokusObject.scene.add(_self.pivot);
    _self.tree.scale.x = 0;
    _self.tree.scale.y = 0;
    _self.tree.scale.z = 0;
    _self.kokusObject.animations.push({
      function: _self.animate,
      scope: _self
    });
      
    if(_self.options.save) {
      var options = _self.options;
        var savedComponents = JSON.parse(localStorage.getItem("worldElements"));      
        savedComponents.push({
            type: "tree",
            //  baseY: _self.tree.position.baseY,
            options: options
        });
        console.log(savedComponents);
        localStorage.setItem("worldElements", JSON.stringify(savedComponents));
    }

    return _self;
  },
  animate: function(){
    var _self = this;
    var isGrowing;

    if(_self.tree.position.y < _self.tree.position.yNeeded){
      if(_self.tree.position.yNeeded - _self.tree.position.y > 0.1){
        _self.tree.position.y += 0.1;
      } else {
        _self.tree.position.y += _self.tree.position.yNeeded - _self.tree.position.y;
      }
    }

    if(_self.tree.scale.x >= 1){
      isGrowing = false;
    }
    else{
      isGrowing = true;
    }

    if(isGrowing){
      _self.tree.scale.x += 0.05;
      _self.tree.scale.y += 0.05;
      _self.tree.scale.z += 0.05;
    }
  },
  collision: function(){
    var _self = this;

    var treeBaseSize = _self.options.leafBaseSize;
    var rotation = _self.options.rotation;
    var radius = _self.kokusObject.world.planet.geometry.parameters.radius;
    var elements = _self.kokusObject.options.elements;

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

      if(elements[i].house  !== undefined)
        totalElementsWidth = elements[i].house.children[1].geometry.parameters.radiusBottom + treeBaseSize;
      else if(elements[i].tree  !== undefined)
        totalElementsWidth = elements[i].tree.children[0].geometry.parameters.radiusBottom + treeBaseSize;
      else if(elements[i].mountain  !== undefined)
        totalElementsWidth = elements[i].mountain.children[1].geometry.parameters.radiusBottom + treeBaseSize;

      console.log(totalElementsWidth);
      if (totalElementsWidth >= distance.hypotenuse)
        return true;
    };

    return false;
  }
};