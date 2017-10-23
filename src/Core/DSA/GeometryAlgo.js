import * as Three from 'three'
import Constants from './Constants'

export default class{
    static copyVec3(v) {
        return new Three.Vector3(v.x, v.y, v.z);
    }

    // Get the intersection point of the ray ant the xy plane.
    static rayCrossGround(ray) {
        if (ray.direction.z == 0) {
            if (ray.origin.z == 0)
                return ray.origin;
            else
                return null;
        } else {
            var k = -ray.origin.z / ray.direction.z;
            if (k >= 0 && k < Constants.maxCanvasSize)
                return this.copyVec3(ray.origin).addScaledVector(ray.direction, k).
                    clampScalar(-Constants.maxCanvasSize, Constants.maxCanvasSize);
            else
                return null;
        }
    }

    // Given a pair of skew lines, get the point on line 1 that is nearest to line 2.
    // two line is given by:
    // line1: p1 + t1 * d1
    // line2: p2 + t2 * d2
    // return t1 of the correspondent point.
    static linePairNearestPoint(p1, d1, p2, d2) {
        var n = new Three.Vector3().crossVectors(d1, d2);
        if (n.length < Constants.eps)
            return p1;
        n.crossVectors(d2, n);
        var interm = new Three.Vector3().subVectors(p2, p1);
        return interm.dot(n) / d1.dot(n);
    }
}
