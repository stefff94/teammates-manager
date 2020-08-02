<template>
    <div>
        <multiselect v-model="teammate.skills"
                     tag-placeholder="Add this as a new skill"
                     placeholder="Search or add a new skill"
                     label="name"
                     track-by="id"
                     :options="options"
                     :multiple="true"
                     :taggable="true"
                     @tag="addSkill">
        </multiselect>
    </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    export default {
        components: {
            Multiselect
        },
        props: {
            options: Array,
            teammate: Object
        },
        methods: {
            addSkill(newSkill){
                let maxOptionIndex = 0;
                if(this.options.length > 0)
                    maxOptionIndex = Math.max
                        .apply(Math, this.options.map(o => o.id));

                const skill = {
                    id: maxOptionIndex + 1,
                    name: newSkill
                }
                this.options.push(skill);
                this.teammate.skills.push(skill);
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
