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
  stats: {},
  world: {},
  init: function(){
    var _self = this;
    _self.initScene();
    _self.initCamera();
    _self.initRenderer();
    _self.initControls();
    _self.initStats();

    _self.camera.position.z = 50;

    _self.render();
    _self.world = new Kokus.World({wireframe: true},_self);


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
  initStats: function(){
    var _self = this;
    _self.stats = new Stats();
    _self.stats.domElement.style.position = 'absolute';
    _self.stats.domElement.style.top = '0px';
    _self.stats.domElement.style.zIndex = 100;
    document.body.appendChild( _self.stats.domElement );
  },
  render: function(){
    var _self = this;
    requestAnimationFrame(_self.render.bind(_self));
    _self.stats.update();
    _self.renderer.render( _self.scene, _self.camera );   
  },
  get: function(){
    console.log(this);
  }
};