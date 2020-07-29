<template>
    <form class="ui form">
        <h3 class="ui dividing header text-left">Teammate Data</h3>
        <div class="field">
            <label class="text-left">Personal Data</label>
            <div class="three fields">
                <div class="field" v-bind:class="teammate.name.error ? 'error' : ''">
                    <label for="name"></label>
                    <input type="text" name="name" id="name"
                           placeholder="Name" v-model="teammate.name.value">
                </div>
                <div class="field" v-bind:class="teammate.email.error ? 'error' : ''">
                    <label for="email"></label>
                    <input type="text" name="email" id="email"
                           placeholder="E-mail" v-model="teammate.email.value">
                </div>
                <div class="field">
                    <label for="gender-dropdown"></label>
                    <select class="ui selection dropdown gender-dropdown"
                            id="gender-dropdown" v-model="teammate.gender.value">
                        <option value="" disabled selected>Gender</option>
                        <option v-for="g in genders" v-bind:key="g.id" v-bind:value="g.id">
                            {{ g.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="two fields">
                <div class="field" v-bind:class="teammate.city.error ? 'error' : ''">
                    <label for="city"></label>
                    <input type="text" name="city" id="city"
                           placeholder="City" v-model="teammate.city.value">
                </div>
                <div class="field">
                    <label for="role-dropdown"></label>
                    <select class="ui selection dropdown role-dropdown"
                            id="role-dropdown" v-model="teammate.role.value">
                        <option value="" disabled selected>Role</option>
                        <option v-for="r in roles" v-bind:key="r.id" v-bind:value="r.id">
                            {{ r.name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
    export default {
        name: "PersonalDataForm",
        props: {
            teammate: Object,
            genders: Array,
            roles: Array
        }
    }
</script>
