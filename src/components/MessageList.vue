<template>
    <div>
        <transition-group
            name="list"
            tag="ul"
            class="messages pd-x-xs"
        >
            <li
                v-for="(message, index) in conversation"
                :key="message.id"
                :class="[
                    conversation[index - 1] &&
                    conversation[index - 1].sender == message.sender
                        ? 'mg-t-min'
                        : 'mg-t-xs',
                ]"
            >
                <MessageItem
                    :message="message"
                    @replays="onReplay"
                />
            </li>
        </transition-group>
    </div>
</template>

<script>
import MessageItem from '@/components/MessageItem.vue'

export default {
    components: {
        MessageItem,
    },

    props: {
        conversation: {
            type: Array,
            required: false,
            default: () => [],
        },
    },

    methods: {
        onReplay(attachment) {
            this.$emit('replay', attachment)
        },
    },
}
</script>
