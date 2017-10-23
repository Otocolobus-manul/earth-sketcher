import LeftToolbarConf from 'Conf/LeftToolbar';

const CLICK0 = 0, CLICK1 = 1;
export default function(register, renderer) {
    register({
        signal: LeftToolbarConf.segment,
        initialStatus: CLICK0,
        data: {
            click1HasMouseDown: false
        },
        handler: [
            {
                status: CLICK0,
                mouseDown: function(e) {
                    this.$store.commit('banButton', true);
                    if (renderer.issue.Segment.click1(e.clientX, renderer.height - e.clientY)) {
                        this.click1HasMouseDown = false;
                        this.status = CLICK1;
                        this.$store.commit('emitRefresh');
                    }
                }
            },
            {
                status: CLICK1,
                mouseMove: function(e) {
                    renderer.issue.Segment.move(e.clientX, renderer.height - e.clientY);
                    this.$store.commit('emitRefresh');
                },
                mouseDown: function(e) {
                    this.click1HasMouseDown = true;
                },
                mouseUp: function(e) {
                    if (this.click1HasMouseDown) {
                        renderer.issue.Segment.click2();
                        this.$store.commit('banButton', false);
                        this.status = CLICK0;
                        this.$store.commit('emitRefresh');
                    }
                }
            },
        ]
    })
}
