'use strict';

import * as Three from 'three';
import Constants from './DSA/Constants'
import Algo from './DSA/GeometryAlgo'

var lineMaterial = new Three.LineBasicMaterial({ color: 0x000, linewidth: 3, transparent: true });

function xyPlaneFillBuffer(buffer, p1, p2) {
    buffer[0]  = p1.x;
    buffer[1]  = p1.y;
    buffer[2]  = p1.z;
    buffer[3]  = p1.x;
    buffer[4]  = p2.y;
    buffer[5]  = p1.z;
    buffer[6]  = p2.x;
    buffer[7]  = p2.y;
    buffer[8]  = p2.z;
    buffer[9]  = p2.x;
    buffer[10] = p1.y;
    buffer[11] = p1.z;
}

class XYPlaneCreator {
    constructor(rectPlanes) {
        this.rectPlanes = rectPlanes;
        this.drawing = null;
        this.click1Pos = null;
        this.click2Pos = null;
        this.geometry = new Three.BufferGeometry();
        this.geometry.addAttribute('position', new Three.BufferAttribute(new Float32Array(12), 3));
        this.drawing = new Three.LineLoop(this.geometry, lineMaterial);
    }
    click1(x, y) {
        var raycaster = this.rectPlanes.raycast(x, y);
        var ray = raycaster.ray;
        var crossPoint = Algo.rayCrossGround(ray);
        if (crossPoint == null)
            return false;
        this.click1Pos = crossPoint;
        xyPlaneFillBuffer(this.geometry.attributes.position, this.click1Pos, this.click1Pos);
        this.rectPlanes.scene.add(this.drawing);
        return true;
    }
    move1(x, y) {
        var raycaster = this.rectPlanes.raycast(x, y);
        var ray = raycaster.ray;
        var crossPoint = Algo.rayCrossGround(ray);
        if (crossPoint != null) {
            this.click2Pos = crossPoint;
            xyPlaneFillBuffer(this.geometry.attributes.position, this.click1Pos, this.click2Pos);
        }
        return true;
    }
    click2(x, y) {
        return this.click2Pos != null;
    }
    move2(x, y) {
        var raycaster = this.rectPlanes.raycast(x, y);
        var ray = raycaster.ray;
        var vecZ = Constants.vecZ;
        var crossPoint = Algo.linePairNearestPoint(this.click2Pos, vecZ, ray.origin, ray.direction);
        vecZ.multiplyScalar(crossPoint);
        var p1 = new Three.Vector3(), p2 = new Three.Vector3();
        p1.addVectors(this.click1Pos, vecZ);
        p2.addVectors(this.click1Pos, vecZ);
        xyPlaneFillBuffer(this.geometry.attributes.position, p1, p2);
        return true;
    }
    click3(x, y) {
        this.rectPlanes.addPlane(this.geometry.attributes.position);
        this.rectPlanes.scene.remove(this.drawing);
        return true;
    }
}

class ZPlaneCreator {
    constructor(rectPlanes) {
        this.scene = rectPlanes.scene;
        this.rectPlanes = rectPlanes;
    }
    click1(x, y) {

    }
    move1(x, y) {

    }
    click2(x, y) {

    }
    move2(x, y) {

    }
    click3(x, y) {

    }
}

class RectPlanes {
    constructor(renderer) {
        this.scene = renderer.scene;
        this.camera = renderer.camera;
        this.planes = [];

        this.XYPlaneCreator = new XYPlaneCreator(this);
        this.ZPlaneCreator = new ZPlaneCreator(this);
    }
    addPlane(buffer) {

    }
}

export default RectPlanes
