/*
 * ObjectManager.js
 * This class is for managing geometry buffer for dynamically changing 3d objects.
 * We maintain several geometry buffers, so that editing one element will not lead to
 * too much expensive data transfer.
 *
 * When deleting one element, we don't straightly remove it from buffer. Instead, we just
 * jump over the element using BufferGeometry.groups to avoiding data transfer. We only
 * rearrange the buffer when too many elements are deleted.
 */

import * as Three from 'three';

class BufferManager {
    constructor(geometry, obj, objManager) {
        this.geometry = geometry;
        geometry.setDrawRange(0, 0);
        this.obj = obj;
        this.objManager = objManager;
        this.drawRange = 0;
        this.drawNum = 0;
        this.geometry.groups.push({
            start: 0,
            count: 0,
            materialIndex: 0
        })
    }

    init(geometry, obj) {
        this.geometry = geometry;
        geometry.setDrawRange(0, 0);
        this.obj = obj;
        this.blockSize = blockSize;
        this.drawRange = 0;
        this.drawNum = 0;
        this.geometry.groups.clear();
        this.geometry.groups.push({
            start: 0,
            count: 0,
            materialIndex: 0
        })
    }

    push(itemNum, attr) {
        if (this.objManager.blockSize - this.drawNum < itemNum)
            return false;
        let groups = this.geometry.groups;
        if (this.drawRange - this.drawNum < itemNum) {
            // Find an intermediate place to insert.
            // And we want two groups can be merged into one if possible.
            let pos = -1;
            for (let i = 0; i < groups.length; ++i) {
                let tmp = (i == 0 ? 0 : groups[i - 1].start + groups[i - 1].count) + itemNum;
                if (tmp <= groups[i].start) {
                    pos = i;
                    if (tmp == groups[i].start && i > 0) {
                        // Merge two groups.
                        this.__copyBuffer(groups[i].start, itemNum, attr);
                        groups[i - 1].count = groups[i].count + itemNum;
                        groups.splice(i, 1);
                        this.drawNum += itemNum;
                        return true;
                    }
                }
            }
            if (pos != -1) {
                groups[i].start -= itemNum;
                groups[i].count += itemNum;
                this.__copyBuffer(groups[i].start, itemNum, attr);
                this.drawNum += itemNum;
                return true;
            }
        }

        if (this.objManager.blockSize - this.drawRange < itemNum)
            return false;
        // Append to the last.
        groups[groups.length - 1].count += itemNum;
        this.__copyBuffer(this.drawRange, itemNum, attr);
        this.drawRange += itemNum;
        this.drawNum += itemNum;
        this.geometry.setDrawRange(0, this.drawRange);
        return true;
    }

    __copyBuffer(pos, itemNum, attr) {
        for (let i = 0; i < attr.length; i += 2) {
            let name = attr[i], buf = attr[i + 1];
            let curAttr = this.geometry.attributes[name];
            curAttr.needsUpdate = true;
            let itemSize = this.objManager.attr.get(name);
            let copySize = itemSize * itemNum;
            for (let j = 0; j < copySize; ++j)
                curAttr.array[pos * itemSize + j] = buf[j];
        }
    }
}

class ObjectManager {
    /*
     * constructor.
     * Parameters:
     * scene: main scene.
     * geoType: type of geometry to draw.
     * material: material for rendering.
     * blockSize: size of one geometry buffer block. Sets to default block size if passing 0.
     * attr: attributes for BufferGeometry. Format: name1, itemSize1, name2, itemSize2...
     */
    constructor(scene, geoType, material, blockSize, ...attr) {
        this.scene = scene;
        this.geoType = geoType;
        this.material = material;
        this.blockSize = blockSize == 0 ? 1000: blockSize;
        this.attr = new Map();
        for (let i = 0; i < attr.length; i += 2)
            this.attr.set(attr[i], attr[i + 1]);

        this.blockNum = 0;
        this.bufs = [];
        this.__addBlock();
    }

    __addBlock() {
        let geometry = new Three.BufferGeometry();
        for (let [name, itemSize] of this.attr)
            geometry.addAttribute(name,
                new Three.BufferAttribute(new Float32Array(this.blockSize * itemSize), itemSize));
        let obj = new this.geoType(geometry, [this.material]);
        obj.frustumCulled = false;
        this.scene.add(obj);
        if (this.blockNum == this.bufs.length)
            this.bufs.push(new BufferManager(geometry, obj, this));
        else
            this.bufs[this.blockNum].init(geometry, obj);
        this.blockNum++;
    }

    /*
     * Push an object needs render.
     * Parameters:
     * itemNum: how many items this object contains.
     * attr: attributes to push. Format: name1, buffer1, name2, buffer2...
     * bufferi has the size itemNum * attr[namei].itemSize
     */
    push(itemNum, ...attr) {
        for (let i = 0; i < this.blockNum; ++i)
            if (this.bufs[i].push(itemNum, attr))
                return;
        this.__addBlock();
        this.bufs[this.blockNum - 1].push(itemNum, attr);
    }
}

export default ObjectManager
