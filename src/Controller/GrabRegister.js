import LeftToolbarConf from 'Conf/LeftToolbar';

var CAMERA_MOVE = 0, LOOKAT_MOVE = 1;
export default function(register, renderer) {
    register({
        signal: LeftToolbarConf.Grab,
        initialStatus: CAMERA_MOVE,
        data: {
            originX: 0, originY: 0, lastX: 0, lastY: 0, nowX: 0, nowY: 0, mouseDown: false,
            operations: [
                function() {
                    renderer.applyLookatMove(this.lastX, this.lastY, this.nowX, this.nowY);
                },
                function() {
                    renderer.applyCameraMove(this.lastX, this.lastY, this.nowX, this.nowY);
                }
            ]
        },
        init: function() {
            var that = this;
            this.$bindKey('space', function() {
                that.status = LOOKAT_MOVE;
            }, 'keydown');
            this.$bindKey('space', function() {
                that.status = CAMERA_MOVE;
            }, 'keyup');
        },
        handler: [
            {
                mouseDown: function(e) {
                    this.$store.commit('banButton', true);
                    this.originX = this.lastX = this.nowX = e.clientX;
                    this.originY = this.lastY = this.nowY = e.clientY;
                    this.mouseDown = true;
                },
                mouseUp: function(e) {
                    this.mouseDown = false;
                    this.$store.commit('banButton', false);
                },
                mouseMove: function(e) {
                    if (this.mouseDown) {
                        this.lastX = this.nowX;
                        this.lastY = this.nowY;
                        this.nowX = e.clientX;
                        this.nowY = e.clientY;
                        this.operations[this.status].call(this);
                    }
                }
            }
        ]
    });
}
