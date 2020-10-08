<template>
    <div id="top" class="bg-frost">
        <div class="x-top x-left x-right">
            <div class="flex valign">
                <slot name="left"></slot>

                <div class="grow text-center">
                    <g-image
                        src="~/assets/images/profile.jpg"
                        alt="Vincent Lejtzén"
                        style="display: block; margin: 0 auto; width: auto; height: 38px; border-radius: 1000px;"
                    />
                </div>

                <slot name="right"></slot>
            </div>
            <div class="text-xs text-center">{{ name }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                required: false,
                default: 'Mr. Bot',
            }
        },
    }
</script>
