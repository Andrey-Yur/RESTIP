import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
import axios from 'axios'

Vue.component('loader', {
    template: `
    <div style="display: flex;justify-content: center;align-items: center">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `
})


new Vue({
    el: '#app',
    data() {
        return {
            nameOfPage: 'CARD OF CONTACTS',
            loading: false,
            form: {
                name: '',
                value: ''
            },
            contacts: []


        }

    },
    computed: {
        canCreate() {
            return this.form.value.trim() && this.form.name.trim()
        }
    },
    methods: {
        async createContact() {
            const { ...contact } = this.form
            const newContact = await request('/api/contacts', 'POST', contact)
            //console.log(response)
            this.contacts.push(newContact)
        },
        async markContact(id) {
            const contact = this.contacts.find(c => c.id === id)
            const updated = await request(`/api/contacts/${id}`, 'PUT', {
                ...contact,
                marked: true
            })
            contact.marked = updated.marked
        },
        async removeContact(id) {
            await request(`/api/contacts/${id}`, 'DELETE')
            this.contacts = this.contacts.filter(c => c.id !== id)
        }
    },
    async mounted() {
        this.loading = true
        this.contacts = await request('/api/contacts')
        this.loading = false
    }

})

new Vue({
    el: '#geo',
    data: {
        location: null,
        gettingLocation: false,
        errorStr: null
    },
    mounted: function () {

        //do we support geolocation
        if (!('geolocation' in navigator)) {
            this.errorStr = 'Geolocation is not available.';
            return;
        }

        this.gettingLocation = true;
        // get position
        navigator.geolocation.getCurrentPosition(pos => {
            this.gettingLocation = false;
            this.location = pos;
        }, err => {
            this.gettingLocation = false;
            this.errorStr = err.message;
        })
    }

})

async function request(url, method = 'GET', data = null) {
    try {
        const headers = {}
        let body

        if (data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }
        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return await response.json()
    } catch (e) {
        console.log('Error:', e.message)
    }
}