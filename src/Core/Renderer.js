'use strict';

import * as Three from 'three';
import renderTarget from './RenderTargets';

class Renderer {
    constructor(canvas, width, height) {
        this.width = width;
        this.height = height;
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
        this.raycaster = new Three.Raycaster();
        this.scene = new Three.Scene();
        this.issue = {};
        for (var x of renderTarget) {
            var current = require('./' + x);
            this.issue.x = new current.default(this);
        }
    }

    raycast(x, y) {
        var mouse = new Three.Vector2(x / this.width * 2 - 1, y / this.height * 2 - 1);
        this.raycaster.setFromCamera(mouse, camera);
        return this.raycaster;
    }

    applySizeChange(width, height) {
        this.width = width;
        this.height = height;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.render();
    }

    applyLookatMove(lastX, lastY, nowX, nowY) {
        var quaternion = new Three.Quaternion();
        quaternion.setFromEuler(new Three.Euler(0.0, 0.0, (nowX - lastX) * 0.002));
        this.camera.quaternion.multiplyQuaternions(quaternion, this.camera.quaternion);
        //this.camera.rotateOnAxis(new Three.Vector3(0, 1, 0), (nowX - lastX) * 0.002);
        this.camera.rotateOnAxis(new Three.Vector3(1, 0, 0), (nowY - lastY) * 0.002);
        this.camera.updateProjectionMatrix();
        this.render();
    }

    applyCameraMove(lastX, lastY, nowX, nowY) {
        var dx = nowX - lastX, dy = nowY - lastY;
        this.camera.translateX(-dx);
        this.camera.translateY(dy);
        this.camera.updateProjectionMatrix();
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export default Renderer
