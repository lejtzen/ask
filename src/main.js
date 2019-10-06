// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'

export default function (Vue, { router, head, isClient }) {
    // Set default layout as a global component
    Vue.component('Layout', DefaultLayout)

    // Apply directive
    Vue.directive('freeze', function (element) {
        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')

        canvas.setAttribute('class', element.classList.value)

        element.onload = function () {
            canvas.width = element.width
            canvas.height = element.height
            element.parentNode.replaceChild(canvas, element)

            context.drawImage(element, 0, 0, element.width, element.height, 0, 0, canvas.width, canvas.height)
        }
    })

    // Charset
    head.meta.push({
        name: 'charset',
        content: 'UTF-8'
    })
}

// Import SASS
import '~/assets/sass/style.scss'
