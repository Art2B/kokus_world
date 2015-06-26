Kokus = function(options){
  options = options || {};
  this.options = {};
  this.options.backgroundColor = options.backgroundColor || Config.world.backgroundColor;
  this.options.container = document.getElementById(options.idContainer) || document.body;

  this.options.elements = options.elements || [];

  this.init();
  return this;
};
Kokus.prototype = {
  scene: {},
  renderer: {},
  camera: {},
  controls: {},
  light: {},
  stats: {},
  world: {},
  animations: [],
  isCameraMoving: false,
  init: function(){
    var _self = this;
    _self.initScene();
    _self.initCamera();
    _self.initRenderer();
    // _self.initControls();
    _self.initStats();

    _self.render();
   _self.initWorld();
   _self.initSavedWorld();
  },
  initScene: function(){
    var _self = this;
    _self.scene = new THREE.Scene();
    _self.scene.fog = new THREE.FogExp2(_self.options.backgroundColor, 0.002);
  },
  initCamera: function(){
    var _self = this;
    _self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
  },
  initRenderer: function(){
    var _self = this;
    _self.renderer = new THREE.WebGLRenderer({antialias: false});
    _self.renderer.setClearColor( _self.scene.fog.color );
    _self.renderer.setPixelRatio( window.devicePixelRatio );
    _self.renderer.setSize( window.innerWidth, window.innerHeight );
    _self.renderer.shadowMapEnabled = true;

    _self.options.container.appendChild( _self.renderer.domElement );
  },
  initControls: function(){
    var _self = this;
    _self.controls = new THREE.OrbitControls( _self.camera );
    _self.controls.damping = 0.2;
    _self.controls.addEventListener( 'change', _self.render );
  },
  initLight: function(){
    var _self = this;
    var light = new THREE.PointLight("#ffffff", 0.5);
    light.position.set(100, 100, 0);
    _self.scene.add(light);

    var ambientLight = new THREE.AmbientLight("#dbdbdb");
    _self.scene.add(ambientLight);
  },
  initStats: function(){
    var _self = this;
    _self.stats = new Stats();
    _self.stats.domElement.style.position = 'absolute';
    _self.stats.domElement.style.top = '0px';
    _self.stats.domElement.style.zIndex = 100;
    document.body.appendChild( _self.stats.domElement );
  },
  initWorld: function(){
    var _self = this;
    _self.initLight();
    _self.camera.position.z = 50;
    _self.camera.previousPosition = _self.camera.position.z;
    _self.camera.stepValue = _self.camera.position.z*0.4;

    _self.world = new Kokus.World({},_self);
      
    if(localStorage.getItem("worldElements") == null) {
        localStorage.setItem("worldElements", JSON.stringify([]));
    }
  },
  initSavedWorld: function(){
    var _self = this;
    var savedElements = JSON.parse(localStorage.getItem("worldElements"));
    console.log(savedElements);
    
    var i = 0;
    savedElements.forEach(function(elem){
        switch(elem.type) {
            case "tree":
                _self.options.elements.push(new Kokus.Tree(elem.options.rotation, elem.options, _self, false).create());
                break;
            case "mountain":
                setTimeout(function(){
                    _self.options.elements.push(new Kokus.Mountain(elem.options.rotation, elem.options, _self, false).create());
                }, 400);
                break;
            case "house":
                setTimeout(function(){
                    _self.options.elements.push(new Kokus.House(elem.options.rotation, elem.options, _self, false).create());
                }, 800);
                break;
        }
    i++;

    if(i % 10)
        _self.dailyEvents();
    });      
  },
  render: function(){
    var _self = this;
    requestAnimationFrame(_self.render.bind(_self));
    _self.animations.forEach(function (element, index) {
      typeof element.function === 'function' && element.function.bind(element.scope)();
    });
    _self.stats.update();

    _self.animate();

    _self.renderer.render( _self.scene, _self.camera );   
    THREEx.WindowResize(_self.renderer, _self.camera);
  },
  animate: function(){
    var _self = this;
    _self.scene.rotation.y += 0.01;

    if(_self.isCameraMoving){
      _self.camera.position.z += 1;
      if(_self.camera.position.z >= _self.camera.previousPosition + _self.camera.stepValue){
        _self.isCameraMoving = false;
      }
    }
      
    if (_self.scene.position.y >5){
      _self.scene.pos = false;
    }
    if (_self.scene.position.y < 0 || _self.scene.position.y < -5){
      _self.scene.pos = true;
    }
    if (_self.scene.pos == true){
      _self.scene.position.y += 0.03;
      _self.scene.position.x += 0.01;
    } else{
      _self.scene.position.y -= 0.03;
      _self.scene.position.x -= 0.01;
    }

  },
  dailyEvents: function(){
    var _self = this;
    _self.world.grow();


    if(_self.world.scaleStep <= _self.world.planet.scale.x-_self.world.previousCameraMovePlanetScale){
      _self.world.previousCameraMovePlanetScale = _self.world.planet.scale.x;
      _self.camera.previousPosition = _self.camera.position.z;
      _self.isCameraMoving = true;
    }
  },
  reset: function(){
    var _self = this;
    _self.scene.children.forEach(function(object){
        _self.scene.remove(object);
    });
    localStorage.setItem("worldElements", JSON.stringify([]));
    _self.options.elements = [];   
    _self.initWorld();
  }
};