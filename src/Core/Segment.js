import * as Three from 'three';
import Algo from './DSA/GeometryAlgo';
import ObjectManager from './Gl/ObjectManager'

var lineMaterial = new Three.LineBasicMaterial({ color: 0x000, linewidth: 3 });

function fillBuffer(buffer, p1, p2) {
    buffer[0] = p1.x;
    buffer[1] = p1.y;
    buffer[2] = p1.z;
    buffer[3] = p2.x;
    buffer[4] = p2.y;
    buffer[5] = p2.z;
}

class Segment {
    constructor(renderer) {
        this.renderer = renderer;
        this.scene = renderer.scene;
        this.camera = renderer.camera;
        this.click1Pos = null;
        this.click2Pos = null;
        this.drawingGeo = new Three.BufferGeometry();
        this.drawingBuf = new Float32Array(6);
        this.drawingGeo.addAttribute('position', new Three.BufferAttribute(this.drawingBuf, 3));
        this.drawing = new Three.LineSegments(this.drawingGeo, lineMaterial);
        this.lines = new ObjectManager(this.scene, Three.LineSegments, lineMaterial, 0, 'position', 3);
    }

    click1(x, y) {
        var raycaster = this.renderer.raycast(x, y);
        var crossPoint = Algo.rayCrossGround(raycaster.ray);
        if (crossPoint == null)
            return false;
        this.click1Pos = crossPoint;
        fillBuffer(this.drawingBuf, this.click1Pos, this.click1Pos);
        this.drawingGeo.attributes.position.needsUpdate = true;
        this.scene.add(this.drawing);
        return true;
    }

    move(x, y) {
        var raycaster = this.renderer.raycast(x, y);
        var crossPoint = Algo.rayCrossGround(raycaster.ray);
        if (crossPoint != null) {
            this.click2Pos = crossPoint;
            fillBuffer(this.drawingBuf, this.click1Pos, this.click2Pos);
            this.drawingGeo.attributes.position.needsUpdate = true;
        }
        return true;
    }

    click2() {
        this.lines.push(2, 'position', this.drawingBuf);
        this.scene.remove(this.drawing);
        return true;
    }
}

export default Segment
