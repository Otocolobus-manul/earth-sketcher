import * as Three from 'three';
import Algo from './DSA/GeometryAlgo';
import ObjectManager from './Gl/ObjectManager'
import {globalKeyPoints} from './DSA/KeyPoints'

const lineMaterial = new Three.LineBasicMaterial({ color: 0x000, linewidth: 3 });

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
        this.drawing.visible = false;
        this.scene.add(this.drawing);
        this.lines = new ObjectManager(this.scene, Three.LineSegments, lineMaterial, 0, 'position', 3);
    }

    getPoint(x, y) {
        this.renderer.issue.AuxObjects.clearKeyPoint();
        var ray = this.renderer.raycast(x, y).ray;
        var [minDist, point] = globalKeyPoints.findNearest(ray);
        if (minDist < 0.1) {
            this.renderer.issue.AuxObjects.addKeyPoint(point);
            return point;
        }
        return Algo.rayCrossGround(ray);
    }

    move0(x, y) {
        this.getPoint(x, y);
    }

    click1(x, y) {
        var crossPoint = this.getPoint(x, y);
        if (crossPoint == null)
            return false;
        this.click1Pos = crossPoint;
        fillBuffer(this.drawingBuf, this.click1Pos, this.click1Pos);
        this.drawingGeo.attributes.position.needsUpdate = true;
        this.drawing.visible = true;
        return true;
    }

    move(x, y) {
        var crossPoint = this.getPoint(x, y);
        if (crossPoint != null) {
            this.click2Pos = crossPoint;
            fillBuffer(this.drawingBuf, this.click1Pos, this.click2Pos);
            this.drawingGeo.attributes.position.needsUpdate = true;
        }
        return true;
    }

    click2() {
        this.renderer.issue.AuxObjects.clearKeyPoint();
        globalKeyPoints.add(this.click1Pos);
        globalKeyPoints.add(this.click2Pos);
        this.lines.push(2, 'position', this.drawingBuf);
        this.drawing.visible = false;
        return true;
    }
}

export default Segment
