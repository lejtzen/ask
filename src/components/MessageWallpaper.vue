<template>
    <div id="wallpaper" :style="styles"></div>
</template>

<script>
export default {
    props: {
        wallpaper: {
            type: String,
            required: true,
        },
    },

    computed: {
        styles() {
            return {
                'background-image': `url(${this.wallpaper})`,
            }
        },
    },
}
</script>
