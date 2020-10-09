<template>
    <div id="bottom" class="flex valign bg-frost">
        <div class="x-right x-bottom x-left">
            <form class="form" v-on:submit.prevent="handleSubmit">
                <textarea
                    class="textarea br-radius-md"
                    name="message"
                    rows="1"
                    placeholder="Whats up?"
                    v-model="message"
                    v-on:keyup.enter.prevent.stop="handleSubmit"
                    ref="textarea"
                ></textarea>
                <button class="button" type="submit" :disabled="!valid">
                    <g-image
                        style="display: block; width: auto; height: 28px;"
                        src="~/assets/images/angle-up.svg"
                        width="28"
                        height="28"
                        alt="Send"
                    />
                </button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            message: '',
        }
    },

    computed: {
        valid: function() {
            return this.message.trim().length > 0
        },
    },

    watch: {
        message: function() {
            this.message = this.message.replace(/(\r\n|\n|\r)/gm, '')
        },
    },

    methods: {
        handleSubmit() {
            if (!this.valid) {
                return
            }

            this.$emit('newMessage', this.message)

            this.message = ''

            this.$refs.textarea.blur()
        },
    },
}
</script>
