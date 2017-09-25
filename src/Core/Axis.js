'use strict';

import * as Three from 'three';

class Axis {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.material = new Three.LineBasicMaterial({
            color: 0xaaaaaa
        });
        this.geometry = new Three.Geometry();
        this.issues = [];
        for (let i = -100; i < 100; ++i)
        {
            this.geometry.vertices.push(
                new Three.Vector3(i * 10.0, -1000.0, 0.0),
                new Three.Vector3(i * 10.0, 1000.0, 0.0));
            this.geometry.vertices.push(
                new Three.Vector3(-1000.0, i * 10.0, 0.0),
                new Three.Vector3(1000.0, i * 10.0, 0.0));
        }
        this.renderTarget = new Three.LineSegments(this.geometry, this.material);
        scene.add(this.renderTarget);
    }
}

export default Axis
