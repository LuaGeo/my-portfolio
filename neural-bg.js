import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const config = {
  paused: false,
  activePaletteIndex: 0,
  currentFormation: 0,
  densityFactor: 1,
};

const colorPalettes = [
  [
    new THREE.Color(0x667eea),
    new THREE.Color(0x764ba2),
    new THREE.Color(0xf093fb),
    new THREE.Color(0x9d50bb),
    new THREE.Color(0x6e48aa),
  ],
  [
    new THREE.Color(0xf857a6),
    new THREE.Color(0xff5858),
    new THREE.Color(0xfeca57),
    new THREE.Color(0xff6348),
    new THREE.Color(0xff9068),
  ],
  [
    new THREE.Color(0x4facfe),
    new THREE.Color(0x00f2fe),
    new THREE.Color(0x43e97b),
    new THREE.Color(0x38f9d7),
    new THREE.Color(0x4484ce),
  ],
];

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.002);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 8, 28);

const canvas = document.getElementById("neural-network-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x050508);
renderer.outputColorSpace = THREE.SRGBColorSpace;

function createStarfield() {
  const count = 6000;
  const positions = [],
    colors = [],
    sizes = [];
  for (let i = 0; i < count; i++) {
    const r = THREE.MathUtils.randFloat(50, 150);
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    positions.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    );
    const c = Math.random();
    if (c < 0.7) colors.push(1, 1, 1);
    else if (c < 0.85) colors.push(0.7, 0.8, 1);
    else colors.push(1, 0.9, 0.8);
    sizes.push(THREE.MathUtils.randFloat(0.1, 0.3));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float size; attribute vec3 color; varying vec3 vColor; uniform float uTime;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float twinkle = sin(uTime * 2.0 + position.x * 100.0) * 0.3 + 0.7;
        gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }`,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        gl_FragColor = vec4(vColor, alpha * 0.8);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geo, mat);
}

const starField = createStarfield();
scene.add(starField);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.6;
controls.minDistance = 8;
controls.maxDistance = 80;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.2;
controls.enablePan = false;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.8,
  0.6,
  0.7,
);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

const pulseUniforms = {
  uTime: { value: 0.0 },
  uPulsePositions: {
    value: [
      new THREE.Vector3(1e3, 1e3, 1e3),
      new THREE.Vector3(1e3, 1e3, 1e3),
      new THREE.Vector3(1e3, 1e3, 1e3),
    ],
  },
  uPulseTimes: { value: [-1e3, -1e3, -1e3] },
  uPulseColors: {
    value: [
      new THREE.Color(1, 1, 1),
      new THREE.Color(1, 1, 1),
      new THREE.Color(1, 1, 1),
    ],
  },
  uPulseSpeed: { value: 18.0 },
  uBaseNodeSize: { value: 0.6 },
};

const noiseFunctions = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const nodeShader = {
  vertexShader: `${noiseFunctions}
  attribute float nodeSize; attribute float nodeType; attribute vec3 nodeColor; attribute float distanceFromRoot;
  uniform float uTime; uniform vec3 uPulsePositions[3]; uniform float uPulseTimes[3]; uniform float uPulseSpeed; uniform float uBaseNodeSize;
  varying vec3 vColor; varying float vNodeType; varying vec3 vPosition; varying float vPulseIntensity; varying float vDistanceFromRoot; varying float vGlow;
  float getPulse(vec3 wp,vec3 pp,float pt){
    if(pt<0.0)return 0.0;float ts=uTime-pt;if(ts<0.0||ts>4.0)return 0.0;
    float pr=ts*uPulseSpeed;float d=distance(wp,pp);return smoothstep(3.0,0.0,abs(d-pr))*smoothstep(4.0,0.0,ts);
  }
  void main(){
    vNodeType=nodeType;vColor=nodeColor;vDistanceFromRoot=distanceFromRoot;
    vec3 worldPos=(modelMatrix*vec4(position,1.0)).xyz;vPosition=worldPos;
    float pi=0.0;for(int i=0;i<3;i++)pi+=getPulse(worldPos,uPulsePositions[i],uPulseTimes[i]);
    vPulseIntensity=min(pi,1.0);
    float breathe=sin(uTime*0.7+distanceFromRoot*0.15)*0.15+0.85;
    float ps=nodeSize*breathe*(1.0+vPulseIntensity*0.25);
    vGlow=0.5+0.5*sin(uTime*0.5+distanceFromRoot*0.2);
    vec3 mp=position;
    if(nodeType>0.5){float noise=snoise(position*0.08+uTime*0.08);mp+=normal*noise*0.15;}
    vec4 mvp=modelViewMatrix*vec4(mp,1.0);
    gl_PointSize=ps*uBaseNodeSize*(1000.0/-mvp.z);
    gl_Position=projectionMatrix*mvp;
  }`,
  fragmentShader: `
  uniform float uTime; uniform vec3 uPulseColors[3];
  varying vec3 vColor; varying float vNodeType; varying vec3 vPosition; varying float vPulseIntensity; varying float vDistanceFromRoot; varying float vGlow;
  void main(){
    vec2 center=2.0*gl_PointCoord-1.0;float dist=length(center);if(dist>1.0)discard;
    float g1=1.0-smoothstep(0.0,0.5,dist);float g2=1.0-smoothstep(0.0,1.0,dist);
    float gs=pow(g1,1.2)+g2*0.3;
    vec3 fc=vColor*(0.9+0.1*sin(uTime*0.6+vDistanceFromRoot*0.25));
    if(vPulseIntensity>0.0){vec3 pc=mix(vec3(1.0),uPulseColors[0],0.4);fc=mix(fc,pc,vPulseIntensity*0.08);fc*=(1.0+vPulseIntensity*0.12);gs*=(1.0+vPulseIntensity*0.1);}
    fc+=vec3(1.0)*smoothstep(0.4,0.0,dist)*0.3;
    float alpha=gs*(0.95-0.3*dist)*smoothstep(100.0,15.0,length(vPosition-cameraPosition));
    fc*=(1.0+vGlow*0.1);
    gl_FragColor=vec4(fc,alpha);
  }`,
};

const connectionShader = {
  vertexShader: `${noiseFunctions}
  attribute vec3 startPoint; attribute vec3 endPoint; attribute float connectionStrength; attribute float pathIndex; attribute vec3 connectionColor;
  uniform float uTime; uniform vec3 uPulsePositions[3]; uniform float uPulseTimes[3]; uniform float uPulseSpeed;
  varying vec3 vColor; varying float vConnectionStrength; varying float vPulseIntensity; varying float vPathPosition; varying float vDistanceFromCamera;
  float getPulse(vec3 wp,vec3 pp,float pt){
    if(pt<0.0)return 0.0;float ts=uTime-pt;if(ts<0.0||ts>4.0)return 0.0;
    float pr=ts*uPulseSpeed;float d=distance(wp,pp);return smoothstep(3.0,0.0,abs(d-pr))*smoothstep(4.0,0.0,ts);
  }
  void main(){
    float t=position.x;vPathPosition=t;
    vec3 mid=mix(startPoint,endPoint,0.5);
    vec3 perp=normalize(cross(normalize(endPoint-startPoint),vec3(0.0,1.0,0.0)));
    if(length(perp)<0.1)perp=vec3(1.0,0.0,0.0);
    mid+=perp*sin(t*3.14159)*0.15;
    vec3 p0=mix(startPoint,mid,t);vec3 p1=mix(mid,endPoint,t);
    vec3 fp=mix(p0,p1,t)+perp*snoise(vec3(pathIndex*0.08,t*0.6,uTime*0.15))*0.12;
    vec3 wp=(modelMatrix*vec4(fp,1.0)).xyz;
    float pi=0.0;for(int i=0;i<3;i++)pi+=getPulse(wp,uPulsePositions[i],uPulseTimes[i]);
    vPulseIntensity=min(pi,1.0);vColor=connectionColor;vConnectionStrength=connectionStrength;
    vDistanceFromCamera=length(wp-cameraPosition);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(fp,1.0);
  }`,
  fragmentShader: `
  uniform float uTime; uniform vec3 uPulseColors[3];
  varying vec3 vColor; varying float vConnectionStrength; varying float vPulseIntensity; varying float vPathPosition; varying float vDistanceFromCamera;
  void main(){
    float f1=sin(vPathPosition*25.0-uTime*4.0)*0.5+0.5;
    float f2=sin(vPathPosition*15.0-uTime*2.5+1.57)*0.5+0.5;
    float cf=(f1+f2*0.5)/1.5;
    vec3 fc=vColor*(0.8+0.2*sin(uTime*0.6+vPathPosition*12.0));
    float fi=0.4*cf*vConnectionStrength;
    if(vPulseIntensity>0.0){fc=mix(fc,mix(vec3(1.0),uPulseColors[0],0.3)*1.2,vPulseIntensity*0.07);fi+=vPulseIntensity*0.08;}
    fc*=(0.7+fi+vConnectionStrength*0.5);
    float alpha=mix(0.7*vConnectionStrength+cf*0.3,min(1.0,(0.7*vConnectionStrength+cf*0.3)*2.5),vPulseIntensity*0.1);
    gl_FragColor=vec4(fc,alpha*smoothstep(100.0,15.0,vDistanceFromCamera));
  }`,
};

class Node {
  constructor(position, level = 0, type = 0) {
    this.position = position;
    this.connections = [];
    this.level = level;
    this.type = type;
    this.size =
      type === 0
        ? THREE.MathUtils.randFloat(0.8, 1.4)
        : THREE.MathUtils.randFloat(0.5, 1.0);
    this.distanceFromRoot = 0;
  }
  addConnection(node, strength = 1.0) {
    if (!this.isConnectedTo(node)) {
      this.connections.push({ node, strength });
      node.connections.push({ node: this, strength });
    }
  }
  isConnectedTo(node) {
    return this.connections.some((c) => c.node === node);
  }
}

function generateNeuralNetwork(formationIndex, densityFactor = 1.0) {
  let nodes = [],
    rootNode;

  function generateCrystallineSphere() {
    rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0);
    rootNode.size = 2.0;
    nodes.push(rootNode);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let layer = 1; layer <= 5; layer++) {
      const radius = layer * 4;
      const numPoints = Math.floor(layer * 12 * densityFactor);
      for (let i = 0; i < numPoints; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
        const theta = (2 * Math.PI * i) / goldenRatio;
        const pos = new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        );
        const node = new Node(
          pos,
          layer,
          layer === 5 || Math.random() < 0.3 ? 1 : 0,
        );
        node.distanceFromRoot = radius;
        nodes.push(node);
        if (layer > 1) {
          const prev = nodes
            .filter((n) => n.level === layer - 1 && n !== rootNode)
            .sort(
              (a, b) => pos.distanceTo(a.position) - pos.distanceTo(b.position),
            );
          for (let j = 0; j < Math.min(3, prev.length); j++)
            node.addConnection(
              prev[j],
              Math.max(
                0.3,
                1 - pos.distanceTo(prev[j].position) / (radius * 2),
              ),
            );
        } else {
          rootNode.addConnection(node, 0.9);
        }
      }
      const layerNodes = nodes.filter(
        (n) => n.level === layer && n !== rootNode,
      );
      for (const node of layerNodes) {
        const nearby = layerNodes
          .filter((n) => n !== node)
          .sort(
            (a, b) =>
              node.position.distanceTo(a.position) -
              node.position.distanceTo(b.position),
          )
          .slice(0, 5);
        for (const n of nearby) {
          if (
            node.position.distanceTo(n.position) < radius * 0.8 &&
            !node.isConnectedTo(n)
          )
            node.addConnection(n, 0.6);
        }
      }
    }
    const outer = nodes.filter((n) => n.level >= 3);
    for (let i = 0; i < Math.min(20, outer.length); i++) {
      const n1 = outer[Math.floor(Math.random() * outer.length)],
        n2 = outer[Math.floor(Math.random() * outer.length)];
      if (
        n1 !== n2 &&
        !n1.isConnectedTo(n2) &&
        Math.abs(n1.level - n2.level) > 1
      )
        n1.addConnection(n2, 0.4);
    }
  }

  function generateHelixLattice() {
    rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0);
    rootNode.size = 1.8;
    nodes.push(rootNode);
    const helixArrays = [];
    for (let h = 0; h < 4; h++) {
      const phase = (h / 4) * Math.PI * 2,
        helixNodes = [];
      const n = Math.floor(50 * densityFactor);
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1),
          y = (t - 0.5) * 30;
        const radius = Math.max(3, 12 * Math.sin(t * Math.PI) * 0.7 + 0.3);
        const angle = phase + t * Math.PI * 6;
        const node = new Node(
          new THREE.Vector3(
            radius * Math.cos(angle),
            y,
            radius * Math.sin(angle),
          ),
          Math.ceil(t * 5),
          i > n - 5 || Math.random() < 0.25 ? 1 : 0,
        );
        node.distanceFromRoot = Math.hypot(radius, y);
        node.helixT = t;
        nodes.push(node);
        helixNodes.push(node);
      }
      helixArrays.push(helixNodes);
      rootNode.addConnection(helixNodes[0], 1.0);
      for (let i = 0; i < helixNodes.length - 1; i++)
        helixNodes[i].addConnection(helixNodes[i + 1], 0.85);
    }
    for (let h = 0; h < 4; h++) {
      const cur = helixArrays[h],
        nxt = helixArrays[(h + 1) % 4];
      for (let i = 0; i < cur.length; i += 5) {
        const idx = Math.round(cur[i].helixT * (nxt.length - 1));
        if (idx < nxt.length) cur[i].addConnection(nxt[idx], 0.7);
      }
    }
  }

  function generateFractalWeb() {
    rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0);
    rootNode.size = 1.6;
    nodes.push(rootNode);
    function branch(start, dir, depth, strength, scale) {
      if (depth > 4) return;
      const endPos = start.position
        .clone()
        .add(dir.clone().multiplyScalar(5 * scale));
      const node = new Node(
        endPos,
        depth,
        depth === 4 || Math.random() < 0.3 ? 1 : 0,
      );
      node.distanceFromRoot = rootNode.position.distanceTo(endPos);
      nodes.push(node);
      start.addConnection(node, strength);
      if (depth < 4) {
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2;
          const p1 = new THREE.Vector3(-dir.y, dir.x, 0).normalize();
          const p2 = dir.clone().cross(p1).normalize();
          branch(
            node,
            dir
              .clone()
              .add(p1.clone().multiplyScalar(Math.cos(angle) * 0.7))
              .add(p2.clone().multiplyScalar(Math.sin(angle) * 0.7))
              .normalize(),
            depth + 1,
            strength * 0.7,
            scale * 0.75,
          );
        }
      }
    }
    for (let i = 0; i < 6; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 6),
        theta = Math.PI * (1 + Math.sqrt(5)) * i;
      branch(
        rootNode,
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi),
        ).normalize(),
        1,
        0.9,
        1.0,
      );
    }
    const leaves = nodes.filter((n) => n.level >= 2);
    for (const node of leaves) {
      const nearby = leaves
        .filter(
          (n) =>
            n !== node &&
            node.position.distanceTo(n.position) < 10 &&
            !node.isConnectedTo(n),
        )
        .sort(
          (a, b) =>
            node.position.distanceTo(a.position) -
            node.position.distanceTo(b.position),
        )
        .slice(0, 3);
      for (const n of nearby)
        if (Math.random() < 0.5 * densityFactor) node.addConnection(n, 0.5);
    }
  }

  switch (formationIndex % 3) {
    case 0:
      generateCrystallineSphere();
      break;
    case 1:
      generateHelixLattice();
      break;
    case 2:
      generateFractalWeb();
      break;
  }

  return { nodes, rootNode };
}

let neuralNetwork = null,
  nodesMesh = null,
  connectionsMesh = null;

function createNetworkVisualization(formationIndex, densityFactor = 1.0) {
  if (nodesMesh) {
    scene.remove(nodesMesh);
    nodesMesh.geometry.dispose();
    nodesMesh.material.dispose();
  }
  if (connectionsMesh) {
    scene.remove(connectionsMesh);
    connectionsMesh.geometry.dispose();
    connectionsMesh.material.dispose();
  }

  neuralNetwork = generateNeuralNetwork(formationIndex, densityFactor);
  const palette = colorPalettes[config.activePaletteIndex];

  const nodesGeo = new THREE.BufferGeometry();
  const nPos = [],
    nTypes = [],
    nSizes = [],
    nColors = [],
    nDist = [];
  neuralNetwork.nodes.forEach((node) => {
    nPos.push(node.position.x, node.position.y, node.position.z);
    nTypes.push(node.type);
    nSizes.push(node.size);
    nDist.push(node.distanceFromRoot);
    const c = palette[Math.min(node.level, palette.length - 1)].clone();
    c.offsetHSL(
      THREE.MathUtils.randFloatSpread(0.03),
      THREE.MathUtils.randFloatSpread(0.08),
      THREE.MathUtils.randFloatSpread(0.08),
    );
    nColors.push(c.r, c.g, c.b);
  });
  nodesGeo.setAttribute("position", new THREE.Float32BufferAttribute(nPos, 3));
  nodesGeo.setAttribute(
    "nodeType",
    new THREE.Float32BufferAttribute(nTypes, 1),
  );
  nodesGeo.setAttribute(
    "nodeSize",
    new THREE.Float32BufferAttribute(nSizes, 1),
  );
  nodesGeo.setAttribute(
    "nodeColor",
    new THREE.Float32BufferAttribute(nColors, 3),
  );
  nodesGeo.setAttribute(
    "distanceFromRoot",
    new THREE.Float32BufferAttribute(nDist, 1),
  );

  const nodesMat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(pulseUniforms),
    vertexShader: nodeShader.vertexShader,
    fragmentShader: nodeShader.fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  nodesMesh = new THREE.Points(nodesGeo, nodesMat);
  scene.add(nodesMesh);

  const connGeo = new THREE.BufferGeometry();
  const cPos = [],
    cStart = [],
    cEnd = [],
    cStrength = [],
    cColors = [],
    cIndex = [];
  const seen = new Set();
  let pi = 0;
  neuralNetwork.nodes.forEach((node, ni) => {
    node.connections.forEach((conn) => {
      const ci = neuralNetwork.nodes.indexOf(conn.node);
      if (ci === -1) return;
      const key = `${Math.min(ni, ci)}-${Math.max(ni, ci)}`;
      if (!seen.has(key)) {
        seen.add(key);
        for (let i = 0; i < 20; i++) {
          const t = i / 19;
          cPos.push(t, 0, 0);
          cStart.push(node.position.x, node.position.y, node.position.z);
          cEnd.push(
            conn.node.position.x,
            conn.node.position.y,
            conn.node.position.z,
          );
          cIndex.push(pi);
          cStrength.push(conn.strength);
          const avgLevel = Math.min(
            Math.floor((node.level + conn.node.level) / 2),
            palette.length - 1,
          );
          const c = palette[avgLevel % palette.length].clone();
          c.offsetHSL(
            THREE.MathUtils.randFloatSpread(0.03),
            THREE.MathUtils.randFloatSpread(0.08),
            THREE.MathUtils.randFloatSpread(0.08),
          );
          cColors.push(c.r, c.g, c.b);
        }
        pi++;
      }
    });
  });
  connGeo.setAttribute("position", new THREE.Float32BufferAttribute(cPos, 3));
  connGeo.setAttribute(
    "startPoint",
    new THREE.Float32BufferAttribute(cStart, 3),
  );
  connGeo.setAttribute("endPoint", new THREE.Float32BufferAttribute(cEnd, 3));
  connGeo.setAttribute(
    "connectionStrength",
    new THREE.Float32BufferAttribute(cStrength, 1),
  );
  connGeo.setAttribute(
    "connectionColor",
    new THREE.Float32BufferAttribute(cColors, 3),
  );
  connGeo.setAttribute(
    "pathIndex",
    new THREE.Float32BufferAttribute(cIndex, 1),
  );

  const connMat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(pulseUniforms),
    vertexShader: connectionShader.vertexShader,
    fragmentShader: connectionShader.fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  connectionsMesh = new THREE.LineSegments(connGeo, connMat);
  scene.add(connectionsMesh);

  palette.forEach((color, i) => {
    if (i < 3) {
      nodesMat.uniforms.uPulseColors.value[i].copy(color);
      connMat.uniforms.uPulseColors.value[i].copy(color);
    }
  });
}

// Pulse on click (document-level so portfolio interactions are unaffected)
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const interactionPoint = new THREE.Vector3();
let lastPulseIndex = 0;

function triggerPulse(clientX, clientY) {
  pointer.x = (clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  interactionPlane.normal.copy(camera.position).normalize();
  interactionPlane.constant =
    -interactionPlane.normal.dot(camera.position) +
    camera.position.length() * 0.5;
  if (
    raycaster.ray.intersectPlane(interactionPlane, interactionPoint) &&
    nodesMesh &&
    connectionsMesh
  ) {
    const t = clock.getElapsedTime();
    lastPulseIndex = (lastPulseIndex + 1) % 3;
    nodesMesh.material.uniforms.uPulsePositions.value[lastPulseIndex].copy(
      interactionPoint,
    );
    nodesMesh.material.uniforms.uPulseTimes.value[lastPulseIndex] = t;
    connectionsMesh.material.uniforms.uPulsePositions.value[
      lastPulseIndex
    ].copy(interactionPoint);
    connectionsMesh.material.uniforms.uPulseTimes.value[lastPulseIndex] = t;
    const palette = colorPalettes[config.activePaletteIndex];
    const randomColor = palette[Math.floor(Math.random() * palette.length)];
    nodesMesh.material.uniforms.uPulseColors.value[lastPulseIndex].copy(
      randomColor,
    );
    connectionsMesh.material.uniforms.uPulseColors.value[lastPulseIndex].copy(
      randomColor,
    );
  }
}

document.addEventListener("click", (e) => {
  if (!config.paused) triggerPulse(e.clientX, e.clientY);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  if (config.paused) return;
  const elapsed = clock.getElapsedTime();
  if (nodesMesh) nodesMesh.material.uniforms.uTime.value = elapsed;
  if (connectionsMesh) connectionsMesh.material.uniforms.uTime.value = elapsed;
  starField.material.uniforms.uTime.value = elapsed;
  controls.update();
  composer.render();
}

document.addEventListener("visibilitychange", () => {
  config.paused = document.hidden;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  bloomPass.resolution.set(window.innerWidth, window.innerHeight);
});

createNetworkVisualization(config.currentFormation, config.densityFactor);
animate();
