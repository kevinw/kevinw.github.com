/*
 * ideas: complimentary colors cycling through the hue space as you move
 */
var FOV = 75;
var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;
var BGCOLOR = 0xFFA900;
var CONTROLS_ENABLED = false;

function getCamInfo() {
  return {
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000
  };
}


var meshCopier = function(scene, mesh) {
  var root = new THREE.Object3D();

  var count = 30;
  var needsMeshUpdate = true;
  var radius = 3.0;

  var lastCount = -1;
  var lastRadius = 0.0;
  var lastRotation = new THREE.Euler();
  var rotation = new THREE.Euler();
  var rotationQ = new THREE.Quaternion();;

  function reserveChildren() {
    if (needsMeshUpdate) {
      for( var i = root.children.length - 1; i >= 0; i--)
        root.remove(root.children[i]);
      needsMeshUpdate = false;
    }

    while (root.children.length < count) {
      var newObj = mesh.clone()
      root.add(newObj);
    }

    while (root.children.length > count)
      root.remove(root.children[root.children.length - 1]);
  }

  var angleEuler = new THREE.Euler();
  var direction = new THREE.Quaternion();

  function update() {
    if (lastCount == count && lastRadius == radius && lastRotation.equals(rotation))
      return;

    lastCount = count;
    lastRadius = radius;
    lastRotation.copy(rotation);

    rotationQ.setFromEuler(rotation);

    reserveChildren(count);

    var angle = 0;
    for (var n = 0; n < count; ++n) {
      var obj = root.children[n];

      angle += (Math.PI * 2) / count;
      angleEuler.set(0, 0, angle);
      direction.setFromEuler(angleEuler);

      obj.position.set(1 * radius, 0, 0);
      obj.position.applyQuaternion(direction);
      obj.quaternion.setFromEuler(angleEuler);
      obj.quaternion.multiply(rotationQ);
      obj.updateMatrix();
    }

  }

  reserveChildren();

  return {
    setCount: function (c) { count = c; reserveChildren(); },
    setRotation: function (x, y, z) { rotation.set(x, y, z); },
    update: update,
    root: root
  };

};

var loader = new THREE.SceneLoader();
loader.load('js/HollowCube.js', function (result) {
  var scene = result.scene;
  window.scene = scene;

  // create a new material
  var material = new THREE.MeshLambertMaterial({
    //map: THREE.ImageUtils.loadTexture('path_to_texture'),  // specify and load the texture
    colorAmbient: [0.480000026226044, 0.480000026226044, 0.480000026226044],
    colorDiffuse: [0.480000026226044, 0.480000026226044, 0.480000026226044],
    colorSpecular: [0.8999999761581421, 0.8999999761581421, 0.8999999761581421]
  });
  scene.children[0].material.materials.push(material);
  var cube = scene.children[0];
  cube.castShadow = true;
  cube.receiveShadow = true;

  /*
  // create a mesh with models geometry and material
  var mesh = new THREE.Mesh(
    geometry,
    material
  );
  mesh.rotation.y = -Math.PI/5;
  scene.add(mesh);
  */

  var ambient = new THREE.AmbientLight(0x222222);
	scene.add(ambient);

  var light = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 2, 1);
  light.position.set(5, 10, 10);
  light.target.position.set(0, 0, 0);

  //light.shadowCameraVisible = true;

  light.castShadow = true;
  light.shadowCameraNear = 5;
  light.shadowCameraFar = 30;
  light.shadowCameraFov = 30;
  light.shadowMapWidth = 512;
  light.shadowMapHeight = 512;
  light.shadowDarkness = 0.2;



  //light.shadowBias = 0.0001;
  //light.shadowDarkness = 0.5;

  scene.add(light);

  var clock = new THREE.Clock();

  var camInfo = getCamInfo();

  var camera = new THREE.PerspectiveCamera(FOV, camInfo.aspect, camInfo.near, camInfo.far);

  camera.position.z = 5;
  //camera.position.set(50, 5, 5);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var renderer = new THREE.WebGLRenderer();
  function onSize() {
    var camInfo = getCamInfo();
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = camInfo.aspect;
    camera.near = camInfo.near;
    camera.far = camInfo.far;
    requestAnimationFrame(render);
  }

  window.addEventListener('resize', onSize, true);
  onSize();
  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("class", "background-canvas");
  document.body.appendChild(renderer.domElement);

  var mouse = new THREE.Vector3();

  var copier = meshCopier(scene, cube);

  scene.add(copier.root);

  document.addEventListener("mousemove", function(e) {
    mouse.x = e.clientX / window.innerWidth * (2 * Math.PI);
    mouse.y = e.clientY / window.innerHeight * (2 * Math.PI);
  });

  scene.remove(cube);

  // the floor!
  var geometry = new THREE.PlaneBufferGeometry(10, 10);
  var planeMaterial = new THREE.MeshBasicMaterial({color: BGCOLOR});

  var ground = new THREE.Mesh(geometry, planeMaterial);
  ground.position.set(0, 0, -1);
  //ground.rotation.x = - Math.PI / 2;
  ground.scale.set(10, 10, 10);
  ground.castShadow = false;
  ground.receiveShadow = true;

  scene.add(ground);

  var controls;
  if (CONTROLS_ENABLED) {
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ];
    //controls.addEventListener('change', function() { requestAnimationFrame(render); });
  }

  function render() {
    copier.setRotation(-mouse.y, mouse.x, 0);
    copier.update();

    var speed = clock.getDelta();
    if (controls) controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();



});
