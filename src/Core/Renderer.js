'use strict';

import * as Three from 'three';
import renderTarget from './RenderTargets';

class Renderer {
    constructor(canvas, width, height) {
        this.renderer = new Three.WebGLRenderer({canvas: canvas, antialias: true});
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xffffff, 1);
        this.camera = new Three.PerspectiveCamera(45, width / height, 1.0, 1000.0);
        this.camera.position.x = -100.0;
        this.camera.position.y = -100.0;
        this.camera.position.z = 50.0;
        this.camera.up.x = 0.0;
        this.camera.up.y = 0.0;
        this.camera.up.z = 1.0;
        this.camera.lookAt(new Three.Vector3(0.0, 0.0, 0.0));
        this.scene = new Three.Scene();
        this.issue = [];
        for (var x of renderTarget) {
            var current = require('./' + x);
            this.issue.push(new current.default(this.scene, this.camera));
        }
    }

    applySizeChange(width, height) {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.render();
    }

    applyLookatMove(lastX, lastY, nowX, nowY) {
        var dx = nowX - lastX, dy = nowY - lastY;
        var t = new Three.Vector4(dx, dy, -1.0, 1.0).applyMatrix4(this.camera.matrixWorldInverse);
        this.camera.position.add(new Three.Vector3(t.x / t.w, t.y / t.w, t.z / t.w));
        this.camera.updateProjectionMatrix();
        this.render();
    }

    applyCameraMove(lastX, lastY, nowX, nowY) {

    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export default Renderer
