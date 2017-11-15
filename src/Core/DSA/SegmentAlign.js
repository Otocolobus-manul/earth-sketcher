/*
 * SegmentAlign.js
 * Find possible alignments when drawing segments.
 * May be implemented by more efficient data structure when possible.
 */

import * as Three from 'three';
import Algo from './GeometryAlgo'

class SegmentAlign {
    const SegmentAlign.endpoint = 0;
    const SegmentAlign.midpoint = 1;
    const SegmentAlign.parallel = 2;
    const SegmentAlign.parallelEqualLength = 3;
    const SegmentAlign.SameStartEqualLength = 4;

    constructor(frustum) {
        this.frustum = frustum;
        this.segments = [];
        this.endpoints = [];
        this.midpoints = [];
    }

    add(a, b) {
        this.segments.push(new Three.Line3(a, b));
        this.endpoints.push(a);
        this.endpoints.push(b);
        this.midpoints.push(new Three.Vector3().lerpVectors(a, b, 0.5));
    }

    nearstPoint(ray, points) {
        let point, minDist = 1e+6, minRayDist = 1e+6;
        for (let x of points) {
            let closest = ray.closestPointToPoint(x);
            let distToX = closest.distanceToSquared(x),
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

    nearestParallel(startPoint, ray) {
        let point, minDist = 1e+6;
        let eqLenPoint, eqLenMinDist = 1e+6;
        for (let x of segments) {
            if (segmentInsideFrustum(x, this.frustum)) {
                let parrallelDirection = new Three.Vector3().subVectors(x.end, x.start);
                let nearestT = Algo.linePairNearestPoint(startPoint, parrallelDirection, ray.origin, ray.direction);
                let nearestPos = Algo.copyVec3(startPoint).addScaledVector(parrallelDirection, nearestT);
                let dist = ray.distanceSqToPoint(nearestPos);
                if (dist < minDist) {
                    minDist = dist;
                    point = nearestPos;
                }

                let eqLenPos = parrallelDirection.add(startPoint);
                let eqLenDist = ray.distanceSqToPoint(eqLenPos);
                if (eqLenDist < eqLenMinDist) {
                    eqLenMinDist = eqLenDist;
                    eqLenPoint = eqLenPos;
                }
            }
        }
        return [minDist, point, eqLenPoint, eqLenMinDist];
    }

    findNearest(ray) {
        let [endPointDist, endPoint] = nearestPoint(ray, this.endpoints);
        let [midPointDist, midPoint] = nearestPoint(ray, this.midpoints);

    }
}
