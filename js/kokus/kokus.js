Kokus = function(options){
  options = options || {};
  this.options = {};
  this.options.backgroundColor = options.backgroundColor || Config.world.backgroundColor;

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
  init: function(){
    var _self = this;
    _self.initScene();
    _self.initCamera();
    _self.initRenderer();
    // _self.initControls();
    _self.initStats();

    _self.render();
   _self.initWorld();
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
    document.body.appendChild( _self.renderer.domElement );
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
    _self.world = new Kokus.World({},_self);
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
  },
  animate: function(){
    var _self = this;
    _self.scene.rotation.y += 0.01;
  },
  reset: function(){
    var _self = this;
    _.each(_.rest(_self.scene.children, 1), function( object ) {
      _self.scene.remove(object);
    });
    _self.initWorld();
  }
};