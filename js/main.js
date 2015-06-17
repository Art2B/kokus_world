var Main = (function(my, Helpers){
  my.instance = {};
  my.init = function(){
    console.log('init');
    my.instance = new Kokus();
  }
  my.createMountain = function(rotation, params){
    var baseConfig = Config.mountain.snow;
    params = params || {color:{}};

    var snowColor = params.color.snow || baseConfig.color.snow;
    var baseColor = params.color.base || baseConfig.color.base;
    var mountainBaseSize = params.mountainBaseSize || baseConfig.mountainBaseSize;

    var materialTop = new THREE.LineBasicMaterial({color: snowColor});
    var materialBase = new THREE.LineBasicMaterial({color: baseColor});
    
    var geometryTop = new THREE.CylinderGeometry( 0, mountainBaseSize/3, mountainBaseSize/3, 4);
    var geometryBase = new THREE.CylinderGeometry( 0, mountainBaseSize, mountainBaseSize, 4);

    var snowTop = new THREE.Mesh( geometryTop, materialTop);
    var snowBase = new THREE.Mesh( geometryBase, materialBase);

    snowTop.applyMatrix( new THREE.Matrix4().makeTranslation(0, (mountainBaseSize/2), 0) );
    snowBase.applyMatrix( new THREE.Matrix4().makeTranslation(0, (mountainBaseSize*0.3)/2, 0) );

    var mountain = new THREE.Mesh();
    mountain.add(snowTop).add(snowBase);
    mountain.position.y = my.planet.geometry.parameters.radius;

    var pivot = new THREE.Object3D();
    pivot.add(mountain);
    pivot.rotation.set(rotation.x, rotation.y, rotation.z);

    my.scene.add(pivot);

  };
  return my;
}(Main || {}, Helpers || {}));
 
 
Main.init();