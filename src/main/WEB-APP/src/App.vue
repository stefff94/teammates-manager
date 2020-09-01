<template>
    <div id="app" class="m20">
        <div class="mt35">
            <personal-data-form :teammate="newTeammate"
                                :genders="genders"
                                :roles="roles"></personal-data-form>
        </div>

        <div class="mt35 mb35">
            <tag-multiselect id="skill-multiselect"
                             :options="skills"
                             :teammate="newTeammate"></tag-multiselect>
        </div>

        <button class="ui button"
                @click="handleTeammate"
                :disabled="submitDisabled">Submit</button>
        <button class="ui button"
                @click="clearNewTeammate">Reset</button>

        <div class="ui error message mt30"
             v-if="newTeammate.errors.length > 0
                || errorInsertingTeammate
                || errorUpdatingTeammate">
            <div class="header">
                <span>Issues</span>
            </div>
            <ul class="list">
                <li v-for="e in newTeammate.errors" v-bind:key="e">{{ e }}</li>
                <li v-if="errorInsertingTeammate">Error while inserting the teammate</li>
                <li v-if="errorUpdatingTeammate">Error while updating the teammate</li>
            </ul>
        </div>

        <div class="ui divider"></div>

        <h2 class="ui center aligned icon header">
            <i class="circular users icon"></i>
            Teammates
        </h2>

        <div class="ui three column stackable grid mt35" v-if="!errorLoadingTeammates">
            <card class="column"
                  v-for="teammate in teammates"
                  :person="teammate"
                  v-bind:key="teammate.id"
                  @delete="deleteTeammate"
                  @update="populateNewTeammateForUpdate"
                  style="margin-bottom: 20px!important;"></card>
        </div>

        <div class="ui error floating message mt35" v-if="errorLoadingTeammates">
            <div class="header">Error loading teammates</div>
            <p>Unable to load the teammates</p>
        </div>

        <div class="ui error floating message mt35" v-if="errorDeletingTeammate">
            <div class="header">Error deleting teammate</div>
            <p>Unable to delete the teammate</p>
        </div>

    </div>
</template>

<script>
    import PersonalDataForm from "./components/PersonalDataForm";
    import TagMultiselect from "./components/TagMultiselect";
    import ApiService from "./services/ApiService";
    import $ from 'jquery';
    import { avatarBaseUrl, avatars, genders, roles, rules } from "./variables";
    import Card from "./components/Card";

    export default {
        components: {
            Card,
            PersonalDataForm,
            TagMultiselect
        },
        mounted() {
            this.resetSelects();
            this.getSkillsAndUpdateView();
            this.getAllTeammatesAndUpdateView();
        },
        computed: {
            submitDisabled() {
                let t = this.newTeammate;
                return !t.name.value
                    || !t.gender.value
                    || !t.email.value
                    || !t.role.value
                    || !t.city.value;
            }
        },
        data: function() {
            return{
                skills: [],
                newTeammate: {
                    id: null,
                    name: {},
                    gender: {},
                    email: {},
                    city: {},
                    role: {},
                    photoUrl: {},
                    skills: [],
                    errors: []
                },
                roles: roles,
                genders: genders,
                avatars: avatars,
                teammates: [],
                rules: rules,
                errorLoadingTeammates: null,
                errorDeletingTeammate: false,
                errorInsertingTeammate: false,
                errorUpdatingTeammate: false
            }
        },
        methods: {
            getAllTeammatesAndUpdateView() {
                let self = this;

                ApiService.getAllTeammates()
                    .then(response => {
                        response.data.forEach(teammate =>
                            self.teammates.push(teammate));
                        self.errorLoadingTeammates = false;
                    }).catch(() => self.errorLoadingTeammates = true);
            },
            deleteTeammate(id) {
                let self = this;

                ApiService.deleteTeammate(id)
                    .then(() => {
                        self.updateViewAfterDelete(id);
                        self.errorDeletingTeammate = false;
                    }).catch(() => self.errorDeletingTeammate = true);
            },
            updateViewAfterDelete(id) {
                this.teammates.splice(
                    this.teammates.findIndex(t => t.id === id), 1);
            },
            populateNewTeammateForUpdate(id) {
                let self = this;
                this.teammates.find(teammate => {
                    if (teammate.id === id) {
                        self.newTeammate = {
                            id: teammate.id,
                            name: {
                                value: teammate.personalData.name
                            },
                            gender: {
                                value: teammate.personalData.gender
                            },
                            email: {
                                value: teammate.personalData.email
                            },
                            city: {
                                value: teammate.personalData.city
                            },
                            role: {
                                value: this.roles.find(
                                    r => r.name === teammate.personalData.role
                                ).id
                            },
                            photoUrl: {
                                value: teammate.personalData.photoUrl
                            },
                            skills: teammate.skills,
                            errors: []
                        }
                        self.populateSelects(self.newTeammate.gender.value,
                            self.newTeammate.role.value);
                    }
                });
            },
            handleTeammate() {
                this.errorInsertingTeammate = false;
                this.errorUpdatingTeammate = false;
                if (this.teammateIsValid()) {
                    if (this.newTeammate.id == null) {

                        this.insertTeammate();
                    } else {
                        this.updateTeammate();
                    }
                }
            },
            insertTeammate() {
                const avatarUrl = avatarBaseUrl +
                    this.avatars[this.newTeammate.gender.value][Math.floor(Math.random() * 3)];

                const newTeammate = {
                    personalData: {
                        name: this.newTeammate.name.value,
                        role: this.roles.find(r =>
                            r.id === this.newTeammate.role.value)
                            .name,
                        gender: this.newTeammate.gender.value,
                        photoUrl: avatarUrl,
                        email: this.newTeammate.email.value,
                        city: this.newTeammate.city.value
                    },
                    skills: this.newTeammate.skills
                }
                ApiService.insertTeammate(newTeammate)
                    .then((response) => {
                        newTeammate.id = response.data.id;
                        this.updateViewAfterInsert(newTeammate);
                    }).catch(() => this.errorInsertingTeammate = true);
            },
            teammateIsValid() {
                this.newTeammate.errors = [];
                let isValid = true;
                this.rules.forEach(r => {
                    this.newTeammate[r.property].error = false;
                    if (!r.reg.test(this.newTeammate[r.property].value)) {
                        this.newTeammate.errors
                            .push("Please enter a correct value for field " + r.property);
                        this.newTeammate[r.property].error = true;
                        isValid = false;
                    }
                });
                return isValid;
            },
            updateViewAfterInsert(newTeammate) {
                this.teammates.push(newTeammate);
                this.clearNewTeammate();
                this.getSkillsAndUpdateView();
            },
            getSkillsAndUpdateView() {
                let self = this;
                ApiService.getSkills()
                    .then((response) => {
                        response.data.forEach( skill => {
                            if( self.skills.find(s => s.id === skill.id) === undefined )
                                self.skills.push(skill);
                        })
                    })
            },
            updateTeammate() {
                const newTeammate = {
                    id: this.newTeammate.id,
                    personalData: {
                        name: this.newTeammate.name.value,
                        role: this.roles.find(r => {
                            return r.id === this.newTeammate.role.value
                        }).name,
                        gender: this.newTeammate.gender.value,
                        photoUrl: this.newTeammate.photoUrl.value,
                        email: this.newTeammate.email.value,
                        city: this.newTeammate.city.value
                    },
                    skills: this.newTeammate.skills
                }
                const oldTeammate = this.teammates.find(t => t.id === newTeammate.id);
                if (oldTeammate.personalData.gender !== newTeammate.personalData.gender) {
                    newTeammate.personalData.photoUrl = avatarBaseUrl + this.avatars[
                        newTeammate.personalData.gender][
                        Math.floor(Math.random() * 3)];
                }

                ApiService.updateTeammate(newTeammate.id, newTeammate)
                    .then(() => this.updateViewAfterUpdate(newTeammate))
                    .catch(() => this.errorUpdatingTeammate = true);
            },
            updateViewAfterUpdate(newTeammate) {
                let teammateIndex = this.teammates.indexOf(
                    this.teammates.find(t => t.id === newTeammate.id));
                this.teammates[teammateIndex] = newTeammate;
                this.clearNewTeammate();
                this.getSkillsAndUpdateView();
            },
            clearNewTeammate() {
                this.newTeammate.id = null;
                this.newTeammate.name = {};
                this.newTeammate.gender = {};
                this.newTeammate.email = {};
                this.newTeammate.role = {};
                this.newTeammate.city = {};
                this.newTeammate.photoUrl = {};
                this.newTeammate.skills = [];
                this.newTeammate.errors = [];
                this.resetSelects();
            },
            resetSelects() {
                $('.ui.dropdown').dropdown('clear');
            },
            populateSelects(gender, role) {
                $('#gender-dropdown').dropdown('set selected', gender);
                $('#role-dropdown').dropdown('set selected', role);
            }
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        width: 70%;
        margin: auto!important;
    }
</style>
