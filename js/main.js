var Main = (function(my, Helpers){
  // Scene elements
  my.camera = {};
  my.scene = {};
  my.renderer = {};
  my.controls = {};
  my.stats = {};
 
  // Elements
  my.planet = {};
  my.tree = {};
  my.house = {};

  // Development purpose
  my.bool = false;

  my.initScene = function(){
    my.scene = new THREE.Scene();
    my.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    my.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    
    my.renderer = new THREE.WebGLRenderer({antialias: false});
    my.renderer.setClearColor( my.scene.fog.color );
    my.renderer.setPixelRatio( window.devicePixelRatio );
    my.renderer.setSize( window.innerWidth, window.innerHeight );
    my.renderer.shadowMapEnabled = true;
    document.body.appendChild( my.renderer.domElement );
  };
    
  my.initLight = function () {
    var light = new THREE.PointLight("#ffffff", 0.5);
	light.position.set(100, 100, 0);
	my.scene.add(light);
      
    var ambientLight = new THREE.AmbientLight("#dbdbdb");
	my.scene.add(ambientLight);
  };
    
  my.initControls = function(){
    my.controls = new THREE.OrbitControls( my.camera );
    my.controls.damping = 0.2;
    my.controls.addEventListener( 'change', my.render );
  };
    
  my.initStats = function(){
    my.stats = new Stats();
    my.stats.domElement.style.position = 'absolute';
    my.stats.domElement.style.top = '0px';
    my.stats.domElement.style.zIndex = 100;
    document.body.appendChild( my.stats.domElement );
  };

  my.createPlanet = function(){
    var material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
//      wireframe: true,
      transparent: false,
      vertexColors: THREE.FaceColors, // CHANGED
      overdraw: true
    });
    var geometry = new THREE.SphereGeometry(20, 13, 13);
    my.planet = new THREE.Mesh(geometry, material);

    console.log('Planet: ', my.planet);

    my.planet.geometry.faces.forEach(function(val, index){
      var red = Helpers.randomVariation(39, 10);
      var green = Helpers.randomVariation(174, 10);
      var blue = Helpers.randomVariation(96, 10);
 
      red = Helpers.mapValue(red, 0,255,0,1);
      green = Helpers.mapValue(green, 0,255,0,1);
      blue = Helpers.mapValue(blue, 0,255,0,1);
 
      val.color.setRGB(red, green, blue);
    });
    my.scene.add(my.planet);
  };
  // Rotation for creation must be in degrees :)
  my.createTree = function(rotation, params){
    var baseConfig = Config.tree.pine;
    params = params || {color:{}};

    var leafColor = params.color.leaf || baseConfig.color.leaf;
    var baseColor = params.color.base || baseConfig.color.base;
    var leafBaseSize = params.leafBaseSize || baseConfig.leafBaseSize;
    var leafBaseHeight = params.leafBaseHeight || baseConfig.leafBaseHeight;

    var materialLeaf = new THREE.LineBasicMaterial({color: leafColor});
    var materialBase = new THREE.LineBasicMaterial({color: baseColor});
    
    var geometryLeaf = new THREE.CylinderGeometry( 0, leafBaseSize, leafBaseHeight, 4);
    var geometryBase = new THREE.CylinderGeometry( leafBaseSize/4, leafBaseSize/4, leafBaseHeight*0.15, 4);

    var pineLeaf = new THREE.Mesh( geometryLeaf, materialLeaf);
    var pineBase = new THREE.Mesh( geometryBase, materialBase);

    pineLeaf.applyMatrix( new THREE.Matrix4().makeTranslation(0, (leafBaseHeight/2)+((leafBaseHeight*0.15)/2), 0) );
    pineBase.applyMatrix( new THREE.Matrix4().makeTranslation(0, (leafBaseHeight*0.15)/2, 0) );

    my.tree = new THREE.Mesh();
    my.tree.add(pineLeaf).add(pineBase);
    my.tree.position.y = my.planet.geometry.parameters.radius;

    var pivot = new THREE.Object3D();

    pivot.add(my.tree);
    pivot.rotation.set(rotation.x, rotation.y, rotation.z);

    my.scene.add(pivot);
  };
    
  my.createHouse = function(position, params){
    var baseConfig = Config.house.pine;
    params = params || {color:{}};

    var roofColor = params.color.roof || baseConfig.color.roof;
    var baseColor = params.color.base || baseConfig.color.base;
    var houseBaseSize = params.houseBaseSize || baseConfig.houseBaseSize;
    var chimneyBaseSize = houseBaseSize/4;
    var roofBaseSize = houseBaseSize/2;

    var materialRoof = new THREE.LineBasicMaterial({color: roofColor});
    var materialBase = new THREE.LineBasicMaterial({color: baseColor});
    var materialChimney = new THREE.LineBasicMaterial({color: baseColor});
    
    var geometryRoof = new THREE.CylinderGeometry( roofBaseSize, houseBaseSize, roofBaseSize, 4);
    var geometryBase = new THREE.CylinderGeometry( houseBaseSize, houseBaseSize, houseBaseSize, 4);
    var geometryChimney = new THREE.CylinderGeometry( chimneyBaseSize, chimneyBaseSize, houseBaseSize, 4);

    var cottageRoof = new THREE.Mesh( geometryRoof, materialRoof);
    var cottageBase = new THREE.Mesh( geometryBase, materialBase);
    var cottageChimney = new THREE.Mesh( geometryChimney, materialChimney);

    cottageBase.applyMatrix( new THREE.Matrix4().makeTranslation(0, houseBaseSize/2, 0) );
    cottageRoof.applyMatrix( new THREE.Matrix4().makeTranslation(0,houseBaseSize+(roofBaseSize/2), 0) );
    cottageChimney.applyMatrix( new THREE.Matrix4().makeTranslation((roofBaseSize/2)+(chimneyBaseSize/2),houseBaseSize+(chimneyBaseSize/2), 0) );

    var house = new THREE.Mesh();
    house.add(cottageRoof).add(cottageBase).add(cottageChimney);
    house.position.y = my.planet.geometry.parameters.radius;

    var pivot = new THREE.Object3D();
    pivot.add(house);
    pivot.rotation.set(Math.radians(rotation.x), Math.radians(rotation.y), Math.radians(rotation.z));

    my.scene.add(pivot);
  }
  
  my.animateTree = function(){
  };
 
  my.init = function(){
    my.initScene();
    my.initLight();
    my.initControls();
    my.initStats();
    my.createPlanet();

    // for(var i=0; i<20; i++){
    //   var x = Helpers.getRandomInt(0,10); 
    //   var z = Helpers.getRandomInt(0,10); 
    //   my.createTree({x: x, y: 0, z:z});
    // }
    my.createTree({x: 0, y: 0, z:90});

    // for(var i=0; i<10; i++){
    //   var x = Helpers.getRandomInt(0,10); 
    //   var z = Helpers.getRandomInt(0,10); 
    //   my.createHouse({x: x, y: 0, z:z});
    // }
    // my.createHouse({x: 20, y: 0, z:12});


    my.camera.position.z = 50;
    my.render();
  };
 
  my.render = function(){
    requestAnimationFrame(my.render);
    my.stats.update();

    // my.animateTree();

    my.renderer.render( my.scene, my.camera );  
  };
  return my;
}(Main || {}, Helpers || {}));
 
 
Main.init();