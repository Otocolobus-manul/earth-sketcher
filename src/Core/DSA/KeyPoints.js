/*
 * KeyPoints.js
 * Find the nearest key point of the given ray.
 * If multiple exists, choose the nearest to camera surface one.
 * May be implemented by kd-tree in the future.
 */

import * as Three from 'three';

class KeyPoints {
    constructor() {
        this.points = []
    }

    add(p) {
        this.points.push(p);
    }

    findNearest(ray) {
        var point, minDist = 1e+6, minRayDist = 1e+6;
        for (let x of this.points) {
            var closest = ray.closestPointToPoint(x);
            var distToX = closest.distanceToSquared(x),
                distToRay = closest.distanceToSquared(ray.origin);
            if ((Math.abs(distToX - minDist) < 1e-2 && distToRay < minRayDist) ||
                distToX <= minDist - 1e-2) {
                minDist = distToX;
                minRayDist = distToRay;
                point = x;
            }
        }
        return [minDist, point];
    }
}

var globalKeyPoints = new KeyPoints();
export {globalKeyPoints};
export default KeyPoints
