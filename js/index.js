var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var World = function () {
  function World(width, height) {
    _classCallCheck(this, World);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.container = document.getElementsByClassName("world")[0];
    this.scene = new THREE.Scene();
    this.width = width;
    this.height = height;
    this.aspectRatio = width / height;
    this.fieldOfView = 50;
    var nearPlane = .1;
    var farPlane = 20000;
    this.targetRotX1 = Math.PI / 3;
    this.targetRotX2 = -Math.PI / 3;
    this.targetRotY1 = 0;
    this.targetRotY2 = 0;

    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, nearPlane, farPlane);
    this.camera.position.z = 250;
    this.container.appendChild(this.renderer.domElement);
    this.timer = 0;
    this.createPlanes();
    this.render();
  }

  _createClass(World, [{
    key: 'createPlanes',
    value: function createPlanes() {
      this.material = new THREE.RawShaderMaterial({
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        uniforms: {
          time: { type: 'f', value: 5 },
          uHue: { type: 'f', value: .95 },
          mousePosition: { type: 'v2', value: new THREE.Vector2(0.5, 0.5) }
        }
      });

      this.material2 = this.material.clone();
      this.material2.uniforms.time.value = 5;
      this.material2.uniforms.uHue.value = .6;

      this.shapeGeometry = new THREE.PlaneGeometry(200, 200, 256, 256);

      this.shape = new THREE.Mesh(this.shapeGeometry, this.material);
      this.shape.position.y = 50;
      this.shape.rotation.x = Math.PI / 3;

      this.shape2 = new THREE.Mesh(this.shapeGeometry, this.material2);
      this.shape2.position.y = -50;
      this.shape2.rotation.x = -Math.PI / 3;

      this.scene.add(this.shape);
      this.scene.add(this.shape2);
    }
  }, {
    key: 'render',
    value: function render() {
      this.timer += .01;

      this.shape2.rotation.y += (this.targetRotY2 - this.shape2.rotation.y) * .05;
      this.shape2.rotation.x += (this.targetRotX2 - this.shape2.rotation.x) * .05;

      this.shape.rotation.y += (this.targetRotY1 - this.shape.rotation.y) * .05;
      this.shape.rotation.x += (this.targetRotX1 - this.shape.rotation.x) * .05;

      this.shape.material.uniforms.time.value = this.timer;
      this.shape2.material.uniforms.time.value = this.timer;
      this.renderer.render(this.scene, this.camera);
    }
  }, {
    key: 'loop',
    value: function loop() {
      this.render();
      //this.shape.rotation.z += .005;
      requestAnimationFrame(this.loop.bind(this));
    }
  }, {
    key: 'updateSize',
    value: function updateSize(w, h) {
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }, {
    key: 'mouseMove',
    value: function mouseMove(mousePos) {
      if (this.shape) {
        this.shape.material.uniforms.mousePosition.value = new THREE.Vector2(mousePos.px, -mousePos.py);
        this.targetRotY1 = mousePos.px * .5;
        this.targetRotX1 = Math.PI / 3 - mousePos.py * .3;

        this.shape2.material.uniforms.mousePosition.value = new THREE.Vector2(mousePos.px, mousePos.py);
        this.targetRotY2 = mousePos.px * .5;
        this.targetRotX2 = -Math.PI / 3 - mousePos.py * .3;
      }
    }
  }]);

  return World;
}();

;

document.addEventListener("DOMContentLoaded", domIsReady);
var mousePos = { x: 0, y: 0, px: 0, py: 0 };
var PI = Math.PI;
var world = void 0;

function domIsReady() {
  world = new World(this.container, this.renderer, window.innerWidth, window.innerHeight);
  window.addEventListener('resize', handleWindowResize, false);
  document.addEventListener("mousemove", handleMouseMove, false);
  handleWindowResize();
  world.loop();
}

function handleWindowResize() {
  world.updateSize(window.innerWidth, window.innerHeight);
}

function handleMouseMove(e) {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  mousePos.px = mousePos.x / window.innerWidth * 2 - 1;
  mousePos.py = mousePos.y / window.innerHeight * 2 - 1;
  world.mouseMove(mousePos);
}