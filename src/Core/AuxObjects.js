import * as Three from 'three';

var keyPointVert = `
uniform sampler2D posAndVelocity;
void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 10.0;
}`;

var keyPointFrag = `
void main()
{
    vec2 uv = (gl_PointCoord - vec2(0.5, 0.5)) * 2.0;
    float strenth = 1.0 - min(abs(length(uv) - 0.8), 0.2) * 5.0;
    gl_FragColor = vec4(1.0, 0.0, 0.0, strenth);
}`;

class AuxObjects {
    constructor(renderer) {
        this.renderer = renderer;
        this.scene = renderer.scene;
        this.camera = renderer.camera;

        this.keyPointGeo = new Three.Geometry();
        this.keyPointGeo.vertices.push(new Three.Vector3());
        this.keyPointMat = new Three.ShaderMaterial({
            vertexShader: keyPointVert,
            fragmentShader: keyPointFrag,
            blending: Three.NormalBlending,
            depthTest: false,
            transparent: true
        });
        this.keyPointObject = new Three.Points(this.keyPointGeo, this.keyPointMat);
        this.keyPointObject.visible = false;
        this.scene.add(this.keyPointObject);
    }

    addKeyPoint(p) {
        this.keyPointObject.visible = true;
        Object.assign(this.keyPointGeo.vertices[0], p);
        this.keyPointGeo.verticesNeedUpdate = true;
    }

    clearKeyPoint() {
        this.keyPointObject.visible = false;
    }
}

export default AuxObjects
