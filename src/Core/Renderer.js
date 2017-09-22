'use strict';

import * as Three from 'three';
import renderTarget from './RenderTargets';

class Renderer {
    constructor(canvas, width, height) {
        this.renderer = new Three.WebGLRenderer({canvas: canvas});
        this.renderer.setSize(width, height);
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

    onSizeChanged(width, height) {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
    }

    render() {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
    }
}

export default Renderer
