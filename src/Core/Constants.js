import * as Three from 'three';

export default {
    maxCanvasSize: 1e+6,
    eps: 1e-6,
    get vecX() { new Vector3(1, 0, 0); },
    get vecY() { new Vector3(0, 1, 0); },
    get vecZ() { new Vector3(0, 0, 1); }
}
