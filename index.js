import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "./node_modules/three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "./node_modules/three/examples/jsm/loaders/MTLLoader.js";
let { scene, camera, renderer, ray } = {
  scene: new THREE.Scene(),
  camera: new THREE.Camera(),
  renderer: new THREE.WebGLRenderer(),
  ray: new THREE.Raycaster(),
}

let christmasTree = null;

// 鼠标XY数据
let mouse = new THREE.Vector2();

// 光 
let { point, ambient } = {
  ambient: new THREE.AmbientLight("#fff", 0.5),
  point: new THREE.PointLight("#fff", 0.6)
}

let snows = new THREE.Group();

scene.add(ambient);
// scene.add(point);

let { that, lighePower } = {
  that: null,
  lighePower:1
}


class myScene {

  constructor() {

    this.init();
    
  }

  init() {

    that = this;

    //创建相机对象
    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(5, 5, 50); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)

    point.position.set(0, 30 ,80); //点光源位置

    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#c2c2c2");

    var texture = new THREE.TextureLoader().load("./assets/images/snow.jpg");
    // 批量创建雨滴精灵模型
    for (let i = 0; i < 3800; i++) {

      var spriteMaterial = new THREE.SpriteMaterial({
        map:texture,//设置精灵纹理贴图
      });
      // 创建精灵模型对象
      var sprite = new THREE.Sprite(spriteMaterial);
      snows.add(sprite);
      // 控制精灵大小
      sprite.scale.set(0.8, 1, 1); //// 只需要设置x、y两个分量就可以
      var k1 = Math.random() - 0.5;
      var k2 = Math.random() - 0.5;
      var k3 = Math.random() - 0.5;
      // 设置精灵模型位置，在整个空间上上随机分布
      sprite.position.set(800 * k1, 800*k3, 600 * k2)
    }
    scene.add(snows);//雨滴群组插入场景中

  // 控制精灵大小，比如可视化中精灵大小表征数据大小
  sprite.scale.set(10, 10, 1); //// 只需要设置x、y两个分量就可以

    this.initSkyBox();
    this.initAudio();
    this.initChristmasThree();
    this.initMapMesh();
    this.animation();
    this.hanldRender();
    this.initLight();
    new OrbitControls(camera, renderer.domElement);//创建控件对象

    setTimeout(() => {
      document.querySelector("#loadingShadow").style.display = "none";
    }, 3000);

  }

  initSkyBox() {

    let skyBox = {
      path: "./assets/sky_box/christmas/",
      imageList: ["夜景_LF.jpg", "夜景_RT.jpg", "夜景_UP.jpg", "夜景_DN.jpg", "夜景_FR.jpg", "夜景_BK.jpg"]
    }

    let cubTextureLoader = new THREE.CubeTextureLoader();

    cubTextureLoader.setPath(skyBox.path);

    let realTexture = cubTextureLoader.load(skyBox.imageList);

    realTexture.encoding = THREE.sRGBEncoding;

    scene.background = realTexture;

  }

  initChristmasThree () {
    // 添加颜色和材质
    new MTLLoader()
      .setPath('./3dPage/obj/')
      .load('charsitmasTree.mtl', function (materials) {

        materials.preload();

        new OBJLoader()
        .setMaterials(materials)
        .setPath('./3dPage/obj/')
        .load('charsitmasTree.obj', function (object) {
          
          object.position.y = - 40;
          object.position.x = - 40;
          object.isChristmasTree = true;
  
          let scaleVal = 1;
          object.scale.x = scaleVal;
          object.scale.y = scaleVal;
          object.scale.z = scaleVal;
  
          christmasTree = object;
          scene.add(object);

          var christmasTreeLight = new THREE.SpotLight( "#fff", 5 );

          christmasTreeLight.castShadow = true;
          christmasTreeLight.angle = 0.8;
          christmasTreeLight.position.y = 80;
          christmasTreeLight.position.x = 50;
          christmasTreeLight.position.z = -40;
          scene.add(christmasTreeLight);
          // scene.add(new THREE.SpotLightHelper(christmasTreeLight))
          christmasTreeLight.target = christmasTree;
          
        });

      });
     
  }

  initAudio () {
    let audioElem = document.createElement("audio");
    audioElem.setAttribute("src", "./music/ddd.mp3");
    audioElem.setAttribute("autoplay", "true");
    audioElem.style.display = "none";
    document.body.appendChild(audioElem);
  }

  initMapMesh () {
    let theMeshArr = new THREE.Group();;
    let mesh1Geomertry = new THREE.BoxBufferGeometry(18, 18, 18);
    let mesh1Map = new THREE.TextureLoader().load('assets/mapping/christmas/src=http___img.51miz.com_Element_00_74_37_37_c2cb4906_E743737_6664c406.jpg!_quality_90_unsharp_true_compress_true_format_jpg&refer=http___img.51miz.jpg');
    let material1 = new THREE.MeshPhongMaterial({map: mesh1Map});
    let mesh = new THREE.Mesh(mesh1Geomertry, material1);
    mesh.rotateY(-20);
    mesh.position.x = -32;
    mesh.position.y = -15;
    theMeshArr.add(mesh);

    let mesh2Geomertry = new THREE.BoxBufferGeometry(55, 55, 5);
    let mesh1Map1 = new THREE.TextureLoader().load('./assets/mapping/christmas/src=http___img1.dowebok.com_6457s.jpg&refer=http___img1.dowebok.jpg');
    let material2 = new THREE.MeshPhongMaterial({map: mesh1Map1});
    let mesh2 = new THREE.Mesh(mesh2Geomertry, material2);
    this.testMesh = mesh2;
    mesh2.position.z = -11;
    console.log(mesh2.position);
    theMeshArr.add(mesh2);

    let mesh3Geomertry = new THREE.BoxBufferGeometry(10, 10, 10);
    let mesh1Map2 = new THREE.TextureLoader().load('assets/mapping/christmas/src=http___picnew13.photophoto.cn_20181204_lvseshengdanhaibaobeijing-32425348_1.jpg&refer=http___picnew13.photophoto.jpg');
    let material3 = new THREE.MeshPhongMaterial({map: mesh1Map2});
    let mesh3 = new THREE.Mesh(mesh3Geomertry, material3);
    mesh3.position.y = - 17.5;
    mesh3.position.x = - 15;
    theMeshArr.add(mesh3);

    theMeshArr.position.x = 40;
    theMeshArr.position.y = -12;
    theMeshArr.position.z = 5;
    theMeshArr.rotateY(5.9);


    theMeshArr.children.forEach(item =>{
      item.receiveShadow = true;
      item.castShadow = true;
    });
    
    scene.add(theMeshArr);
  }

  initLight () {
    // 圣诞节三色灯光
    let redLight = new THREE.PointLight("red",lighePower, 70, 2);
    let greenLight = new THREE.PointLight("green",lighePower, 60, 2);
    let blueLight = new THREE.PointLight("blue",lighePower, 60 ,2);
    let sporLight = new THREE.SpotLight("#fff");
    sporLight.position.y += 5;
    sporLight.angle = 0.8;
    sporLight.penumbra = 0.9;
    sporLight.position.x = 35;
    sporLight.position.z = 10;

    scene.add(sporLight);
    sporLight.target = this.testMesh;
    // sporLight.penumbra = 1;

    redLight.position.set(35,6,30);
    greenLight.position.set(55,5,30);
    blueLight.position.set(20,5,20);
    // scene.add(new THREE.PointLightHelper(light1))
    //添加灯光
    // scene.add(light1);
    let lightGroup = new THREE.Group();

    lightGroup.add(redLight);
    lightGroup.add(greenLight);
    lightGroup.add(blueLight);

    lightGroup.isLightGroup = true;

    scene.add(lightGroup);
  }

  hanldRender() {
    window.addEventListener("resize", this.windowResize, false);
    document.querySelectorAll("canvas")[0].addEventListener("click", this.moueMove, false);
    // document.querySelectorAll("canvas")[0].addEventListener("mousemove", this.moueMove, false);

  }

  windowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  moueMove(e) {

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    ray.setFromCamera(mouse, camera);

    let theInt = ray.intersectObjects(christmasTree.children);

    if (theInt.length) {

      theInt.sort();
      console.log(theInt);

    }

  }

  animation() {

    renderer.render(scene, camera);

    let chrsitmas = scene.children.find(item => item.isChristmasTree);
    
    let lightGroup = scene.children.find(item => item.isLightGroup);

    if (lightGroup) {

     lightGroup.children.forEach(item => {

      var time = new Date() * 0.003;

      item.intensity = Math.sin(time) * 1 + 0.8;

     })

    }
    
    // 落雪
    snows.children.forEach(sprite => {

      sprite.position.y -= 0.4;

      if (sprite.position.y < - 200) {

        sprite.position.y = 200;

      }

    });
   
    // console.log(lighePower);
    if (chrsitmas) {

      chrsitmas.rotateY(0.004);

    };
    
    requestAnimationFrame(that.animation);

  }

}

let t = new myScene();
