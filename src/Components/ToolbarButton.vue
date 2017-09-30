<template>
<div class="toolbar-button" v-on:click="onClick">
{{buttonText}}
</div>
</template>

<script>

export default {
    name: 'toolbar-button',
    props: ['buttonText', 'event'],
    computed: {
        isChoosed: function() {
            return this.event == this.$store.state.leftToolbarSelected;
        }
    },
    methods: {
        onClick: function() {
            if (!this.$store.state.buttonBanned)
                this.$store.setLeftToolbarSelected(this.event);
        }
    }
}
</script>

<style scoped lang="less">
.toolbar-button {
    display: block;
    width: 100px;
    height: 40px;
    margin-top: 5px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #fff;
    color: #fff;
    border-radius: 3px;
    background: transparent;
    &:hover {
        cursor: pointer;
        border-color: rgba(110,255,248,1);
        box-shadow: 0px 0px 5px 0px rgba(110,255,248,0.5);
    }
}
</style>
