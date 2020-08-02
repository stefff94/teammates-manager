import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import jQuery from "jquery";
import $ from "jquery";
global.jQuery = jQuery
global.$ = $
require('fomantic-ui/dist/semantic.min.js')

import App from "../../src/App";
import ApiService from "../../src/services/ApiService";
import Card from "../../src/components/Card";
import Multiselect from "vue-multiselect";
import PersonalDataForm from "../../src/components/PersonalDataForm";
import TagMultiselect from "../../src/components/TagMultiselect";
import { avatarBaseUrl } from "../../src/variables";

let wrapper = null;
let teammates = null;
let newTeammate = null;
let respGetSkills = null;

jest.mock("../../src/services/ApiService");

beforeEach(() => {
    const skills = [
        { id: 1, name: "Java" },
        { id: 2, name: "Vue js" }
    ];

    teammates = [
        {
            id: 1,
            personalData: {
                photoUrl: "https://semantic-ui.com/images/avatar/large/steve.jpg",
                name: "Stefano Vannucchi",
                role: "Student",
                email: "stefano.vannucchi@stud.unifi.it",
                city: "Prato",
                gender: "M"
            },
            skills: skills
        },
        {
            id: 2,
            personalData: {
                photoUrl: "https://semantic-ui.com/images/avatar/large/matthew.jpg",
                name: "Paolo Innocenti",
                role: "Student",
                email: "paolo.innocenti@stud.unifi.it",
                city: "Pistoia",
                gender: "M"
            },
            skills: skills,
        }
    ];

    newTeammate = {
        name: {
            value: "Stefano Vannucchi"
        },
        gender: {
            value: "M"
        },
        email: {
            value: "stefano.vannucchi@stud.unifi.it"
        },
        city: {
            value: "Prato"
        },
        role: {
            value: "R1"
        },
        skills: [
            { id: 1, name: "Java" },
            { id: 2, name: "Vue js" }
        ],
        errors: []
    }

    const respInsertTeammate = {data: {
            id: 3
        }}
    ApiService.insertTeammate.mockResolvedValue(respInsertTeammate);

    ApiService.updateTeammate.mockResolvedValue(null);

    respGetSkills = [
        { id: 1, name: 'Java' },
        { id: 2, name: 'Vue js' }
    ]
    ApiService.getSkills.mockResolvedValue({data: respGetSkills});

    const respGetAllTeammates = { data: teammates };
    ApiService.getAllTeammates.mockResolvedValue(respGetAllTeammates);

    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0.9;
    global.Math = mockMath;
});

describe("App.vue", () => {

    beforeEach(() => {
        // mount method mounts automatically also child components
        wrapper = mount(App);
    });

    it("renders the Cards components correctly", () => {
        const cards = wrapper.findAllComponents(Card);

        cards.wrappers.forEach(card => {
            expect(teammates)
                .toContain(card.vm.person);
        });
    });

});

describe('The teammate is created', () => {

    beforeEach(() => {
        const respInsertTeammate = { data: {
                id: 1
            }};
        ApiService.insertTeammate.mockResolvedValue(respInsertTeammate);

        ApiService.getSkills.mockResolvedValue({data: []});

        ApiService.getAllTeammates.mockResolvedValue({data: []});

        wrapper = mount(App);
    });

    it('saves the teammate data from the forms', async () => {
        let personalDataForm = wrapper.findComponent(PersonalDataForm);

        const nameInputField = personalDataForm.findAll('.three.fields input').at(0)
        nameInputField.setValue(newTeammate.name.value)

        const emailInputField = personalDataForm.findAll('.three.fields input').at(1)
        emailInputField.setValue(newTeammate.email.value)

        const genderSelectField = personalDataForm.find(".three.fields .field:nth-of-type(3) select");
        genderSelectField.findAll('option')
            .at(1)
            .element
            .selected = true;
        genderSelectField.trigger('change');

        const cityInputField = personalDataForm.findAll('.two.fields input').at(0)
        cityInputField.setValue(newTeammate.city.value)

        const roleSelectField = personalDataForm.find(".two.fields select");
        roleSelectField.findAll('option')
            .at(1)
            .element
            .selected = true;
        roleSelectField.trigger('change');

        const tagMultiselect = wrapper.findComponent(TagMultiselect);
        const multiselect = tagMultiselect.findComponent(Multiselect);

        newTeammate.skills.forEach(s => {
            multiselect.vm.$emit('tag', s.name);
        })

        const expectedTeammate = {
            id: 1,
            personalData: {
                name: newTeammate.name.value,
                role: wrapper.vm.roles.find(r => {
                    return r.id === newTeammate.role.value
                }).name,
                gender: newTeammate.gender.value,
                photoUrl: avatarBaseUrl + wrapper.vm.$data.avatars[newTeammate.gender.value][2]
                ,
                email: newTeammate.email.value,
                city: newTeammate.city.value
            },
            skills: newTeammate.skills
        }

        await wrapper.vm.$nextTick();

        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.teammates)
            .toContainEqual(expectedTeammate);
    })

    it('creates a new card for the teammate', async () => {
        await wrapper.setData({ newTeammate: newTeammate })
        wrapper.vm.handleTeammate();

        await flushPromises();

        const resultData = wrapper.vm.teammates[0];
        const expectedTeammate = {
            id: 1,
            personalData: {
                name: newTeammate.name.value,
                role: wrapper.vm.roles.find(r => {
                    return r.id === newTeammate.role.value
                }).name,
                gender: newTeammate.gender.value,
                photoUrl: avatarBaseUrl +
                    wrapper.vm.$data.avatars[newTeammate.gender.value][2],
                email: newTeammate.email.value,
                city: newTeammate.city.value
            },
            skills: newTeammate.skills
        }

        expect(wrapper.vm.teammates.length)
            .toBe(1);
        expect(resultData)
            .toEqual(expectedTeammate);
    })
})

describe('the skills are added to App.skills', () => {
    beforeEach(() => {

        ApiService.getSkills.mockResolvedValue({data: []});

        wrapper = mount(App);
    })

    it('adds the skill to the options', () => {
        const tagMultiselect = wrapper.findComponent(TagMultiselect);
        const newSkill = {id: 1, name:'skill'}

        tagMultiselect.vm.addSkill(newSkill.name);

        expect(wrapper.vm.skills.length)
            .toBe(1);
        expect(wrapper.vm.newTeammate.skills.length)
            .toBe(1);
        expect(wrapper.vm.skills)
            .toContainEqual(newSkill);
        expect(wrapper.vm.newTeammate.skills)
            .toContainEqual(newSkill);
    })
})

describe("The teammate is deleted", () => {

    beforeEach(() => {
        ApiService.deleteTeammate.mockResolvedValue(null);

        wrapper = mount(App);
    });

    it("delete the teammate", async () => {
        const teammateToDelete = teammates[0].id;

        wrapper.findAllComponents(Card).wrappers[0]
            .vm.deleteTeammate(teammateToDelete);

        await flushPromises();

        expect(wrapper.vm.teammates
            .find(t => t.id === teammateToDelete))
            .toBeUndefined();
    });

});

describe("The teammate is updated after performing the edit operation",  () => {

    beforeEach(() => {
        const respInsertTeammate = { data: {
                id: 1
            }};
        ApiService.insertTeammate.mockResolvedValue(respInsertTeammate);

        wrapper = mount(App);
    });

    it("it populates the newTeammate object", async () => {
        const expectedNewTeammate = {
            id: 1,
            name: {
                value: "Stefano Vannucchi"
            },
            gender: {
                value: "M"
            },
            email: {
                value: "stefano.vannucchi@stud.unifi.it"
            },
            city: {
                value: "Prato"
            },
            role: {
                value: "R1"
            },
            photoUrl: {
                value: "https://semantic-ui.com/images/avatar/large/steve.jpg"
            },
            skills: respGetSkills,
            errors: []
        }
        const teammateToUpdate = teammates[0].id;

        wrapper.findAllComponents(Card).wrappers[0]
            .vm.updateTeammate(teammateToUpdate);

        expect(wrapper.vm.newTeammate)
            .toEqual(expectedNewTeammate);
    });

    it("updates the teammate's card with the new data", async () => {
        const teammateToUpdate = teammates[0].id;

        wrapper.findAllComponents(Card).wrappers[0]
            .vm.updateTeammate(teammateToUpdate);

        await wrapper.vm.$nextTick();

        let personalDataForm = wrapper.findComponent(PersonalDataForm);

        const nameInputField = personalDataForm.findAll('.three.fields input').at(0)
        nameInputField.setValue('New name')

        const emailInputField = personalDataForm.findAll('.three.fields input').at(1)
        emailInputField.setValue('NewEmail@email.it')

        const genderSelectField = personalDataForm.find(".three.fields .field:nth-of-type(3) select");
        const selectedGender = genderSelectField.findAll('option')
            .at(2)
            .element;
        selectedGender.selected = true;
        genderSelectField.trigger('change');

        const cityInputField = personalDataForm.findAll('.two.fields input').at(0)
        cityInputField.setValue("new city")

        const roleSelectField = personalDataForm.find(".two.fields select");
        roleSelectField.findAll('option')
            .at(2)
            .element
            .selected = true;
        roleSelectField.trigger('change');

        const multiselect =  wrapper.findComponent(TagMultiselect)
            .findComponent(Multiselect);

        multiselect.vm.$emit('tag', "newSkill");

        const expectedSkills = respGetSkills;
        expectedSkills.push({id:3, name: "newSkill"})

        const expectedTeammate = {
            id: 1,
            personalData: {
                name: 'New name',
                role: wrapper.vm.roles.find(r => {
                    return r.id === 'R2'
                }).name,
                gender: 'F',
                photoUrl: avatarBaseUrl +
                    wrapper.vm.avatars[selectedGender.getAttribute('value')][2],
                email: 'NewEmail@email.it',
                city: 'new city'
            },
            skills: expectedSkills
        }

        await wrapper.vm.$nextTick();

        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.teammates)
            .toContainEqual(expectedTeammate);
    })
});

