<template>
    <div
        class="br-radius-md"
        :class="[
            message.type,
            message.sender == 'bot'
                ? 'received bg-grey'
                : 'sent bg-blue text-light-primary',
        ]"
    >
        <div v-if="isAttachment">
            <div class="replay">
                <button
                    class="text-blue"
                    @click="replay(message.body)"
                    name="Replay message"
                    title="Replay message"
                >
                    <g-image
                        src="~/assets/images/refresh.svg"
                        width="14"
                        height="14"
                        alt="Replay"
                    />
                    Replay
                </button>
            </div>
            <g-image
                class="br-radius-md"
                v-freeze="message.body"
                :src="message.body"
            />
        </div>
        <span v-else>
            {{ message.body }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        message: {
            type: Object,
            required: true,
        },
    },

    computed: {
        isAttachment() {
            return this.message.type == 'attachment'
        },
    },

    methods: {
        replay(attachment) {
            this.$emit('replay', attachment)
        },
    },
}
</script>
