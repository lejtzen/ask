<template>
    <Layout>
        <transition name="slide-down">
            <Navigation :name="bot.name" v-if="visible.top">
                <template v-slot:left>
                    <button
                        class="pd-x-xs"
                        @click="clearConversation()"
                        :disabled="!conversation.length"
                    >
                        <g-image
                            style="display: block; width: auto; height: 28px;"
                            src="~/assets/images/trash.svg"
                            alt="Clear conversation"
                        />
                    </button>
                </template>

                <template v-slot:right>
                    <button class="pd-x-xs" @click="showInfo()">
                        <g-image
                            style="display: block; width: auto; height: 28px;"
                            src="~/assets/images/info.svg"
                            alt="Information"
                        />
                    </button>
                </template>
            </Navigation>
        </transition>

        <transition name="fade">
            <div
                id="view"
                v-if="visible.view"
                class="x-all"
                :class="{ fullscreen: visible.wallpaper }"
            >
                <MessageList :conversation="conversation" @replay="onReplay" />

                <transition name="fade">
                    <div class="mg-t-xs pd-x-xs" v-if="bot.writing">
                        <div class="br-radius-md message received bg-grey">
                            <span class="writing"></span>
                            <span
                                class="writing"
                                style="animation-delay: -.25s;"
                            ></span>
                            <span
                                class="writing"
                                style="animation-delay: -.5s;"
                            ></span>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>

        <transition name="slide-up">
            <MessageForm v-if="visible.bottom" @newMessage="onNewMessage" />
        </transition>

        <transition name="fade">
            <MessageWallpaper v-if="visible.wallpaper" :wallpaper="wallpaper" />
        </transition>
    </Layout>
</template>

<script>
import axios from 'axios'
import Navigation from '@/components/Navigation.vue'
import MessageForm from '@/components/MessageForm.vue'
import MessageList from '@/components/MessageList.vue'
import MessageWallpaper from '@/components/MessageWallpaper.vue'

export default {
    components: {
        Navigation,
        MessageForm,
        MessageList,
        MessageWallpaper,
    },

    metaInfo: {
        title: 'A funny mobile chat made by Vincent Lejtzén',
        meta: [
            {
                name: 'description',
                content:
                    "This project of mine will give you all the answers you're looking for.",
            },
        ],
    },

    data: function() {
        return {
            bot: {
                name: 'Vincent Lejtzén',
                writing: false,
            },
            user: {
                name: '',
            },
            conversation: [],
            wallpaper: '',
            visible: {
                top: false,
                view: false,
                bottom: false,
                wallpaper: false,
            },
        }
    },

    beforeMount: function() {
        this.retrieveConversation()
        this.retrieveUser()
    },

    mounted: function() {
        var self = this

        // TODO: Animera dessa när bilder är preloadade och konversation är hämtad från localStorage
        // med Promise istället för timeOut.
        setTimeout(function() {
            self.visible.top = true
            self.visible.view = true
            self.visible.bottom = true
        }, 1000)

        if (!this.conversation.length) {
            setTimeout(function() {
                self.bot.writing = true
            }, 2000)

            setTimeout(function() {
                self.bot.writing = false
                self.sendMessage(
                    self.createMessage(
                        'bot',
                        'message',
                        "Hi there! Ask me anything and I'll give you a yes or no. Lets go 👊",
                    ),
                )
            }, 3500)
        }
    },

    methods: {
        preload: function(attachment) {
            return new Promise(function(resolve, reject) {
                var image = new Image()

                image.onload = resolve
                image.onerror = resolve

                image.src = attachment
            })
        },

        onNewMessage: function(body) {
            this.sendMessage(this.createMessage('user', 'message', body))

            this.sendResponse()
        },

        createMessage: function(sender, type, message) {
            return {
                id:
                    Math.random()
                        .toString(36)
                        .substring(2) + new Date().getTime().toString(36),
                sender: sender,
                type: type,
                time: new Date(),
                body: message,
            }
        },

        sendMessage: function(message) {
            this.conversation.push(message)
            localStorage.setItem(
                'conversation',
                JSON.stringify(this.conversation),
            )
            this.scrollView()
        },

        transformResponse: function(answer) {
            var answers = {
                yes: [
                    "Yes, that's right.",
                    'Yes ...',
                    "That's a yes",
                    'Yep!',
                    'Always!',
                    'You know that. Of course.',
                ],
                no: [
                    'Simply ... no',
                    'Never',
                    "I don't think so",
                    "I'd say no actually.",
                    'No ...',
                    "No, but don't tell anyone 🤫",
                ],
                maybe: ['Maybe 😉'],
            }

            return answers[answer][
                Math.floor(Math.random() * answers[answer].length)
            ]
        },

        sendResponse: function() {
            var self = this

            setTimeout(function() {
                self.bot.writing = true
            }, 500)

            setTimeout(function() {
                axios
                    .get('https://yesno.wtf/api')
                    .then(function(response) {
                        self.bot.writing = false

                        self.preload(response.data.image).then(function() {
                            // Visa wallpaper
                            self.wallpaper = response.data.image
                            self.visible.top = false
                            self.visible.bottom = false
                            self.visible.wallpaper = true

                            // Skicka attachment
                            setTimeout(function() {
                                self.sendMessage(
                                    self.createMessage(
                                        'bot',
                                        'attachment',
                                        response.data.image,
                                    ),
                                )
                            }, 2000)

                            // Skicka message
                            setTimeout(function() {
                                self.sendMessage(
                                    self.createMessage(
                                        'bot',
                                        'message',
                                        self.transformResponse(
                                            response.data.answer,
                                        ),
                                    ),
                                )
                            }, 3000)

                            // Lägg tillbaka allt
                            setTimeout(function() {
                                self.visible.top = true
                                self.visible.bottom = true
                                self.visible.wallpaper = false
                            }, 5000)
                        })
                    })
                    .catch(function(error) {
                        console.log(error)
                        self.bot.writing = false
                        self.sendMessage(
                            self.createMessage(
                                'bot',
                                'message',
                                "Sorry, I can't answer any questions now. The yesno.wtf API seems to be down :(",
                            ),
                        )
                    })
            }, 1500)
        },

        onReplay(attachment) {
            this.preload(attachment).then(() => {
                // Visa wallpaper
                this.wallpaper = attachment
                this.visible.top = false
                this.visible.bottom = false
                this.visible.wallpaper = true

                // Lägg tillbaka allt
                setTimeout(() => {
                    this.visible.top = true
                    this.visible.bottom = true
                    this.visible.wallpaper = false
                }, 5000)
            })
        },

        scrollView: function() {
            window.scrollTo(0, document.getElementById('view').offsetHeight)
        },

        retrieveConversation: function() {
            var conversation = JSON.parse(localStorage.getItem('conversation'))

            if (conversation) {
                this.conversation = conversation
            }
        },

        clearConversation: function() {
            if (this.conversation.length) {
                var confirm = window.confirm(
                    'Are you sure you want to delete the conversation?',
                )

                if (confirm == true) {
                    this.conversation = []
                    localStorage.removeItem('conversation')
                }
            }
        },

        retrieveUser: function() {
            var username = JSON.parse(localStorage.getItem('username'))

            if (username) {
                this.user.name = username
            }
        },

        showInfo: function() {
            this.sendMessage(
                this.createMessage(
                    'bot',
                    'message',
                    "That button there. It should show some info about this project but i haven't made it that far yet. Come back soon.",
                ),
            )
        },
    },
}
</script>
