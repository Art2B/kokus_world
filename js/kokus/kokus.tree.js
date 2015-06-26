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
    
  this.create();
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
    pineBase.applyMatrix( new THREE.Matrix4().makeTranslation(0, (_self.options.leafBaseHeight*0.15)/2, 0) );

    _self.tree = new THREE.Mesh();
    _self.tree.add(pineLeaf).add(pineBase);
    _self.tree.position.y = _self.kokusObject.world.planet.geometry.parameters.radius - space;

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
        var savedComponents = JSON.parse(localStorage.getItem("worldElements"));      
        savedComponents.push({
            type: "tree",
            //  baseY: _self.tree.position.baseY,
            options: _self.options
        });
        localStorage.setItem("worldElements", JSON.stringify(savedComponents));
    }

    return _self;
  },
  animate: function(){
    var _self = this;
    var isGrowing;

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
  }
};