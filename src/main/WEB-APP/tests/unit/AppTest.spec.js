import { shallowMount } from '@vue/test-utils';
import flushPromises from "flush-promises";

import App from "../../src/App";
import ApiService from "../../src/services/ApiService";
import Card from "../../src/components/Card";
import PersonalDataForm from "../../src/components/PersonalDataForm";
import TagMultiselect from "../../src/components/TagMultiselect";
import { avatarBaseUrl, roles } from "../../src/variables";

import jQuery from 'jquery'
import $ from 'jquery'
global.jQuery = jQuery
global.$ = $
require('fomantic-ui/dist/semantic.min.js')

let wrapper = null;
let newTeammate = null;
let teammates = null;
let respGetSkills = null;

jest.mock('../../src/services/ApiService');

beforeEach(() => {
    teammates = [
        {
            id: 1,
            personalData: {
                photoUrl: "https://semantic-ui.com/images/avatar/large/steve.jpg",
                name: "Stefano Vannucchi",
                role: "Frontend developer",
                email: "stefano.vannucchi@stud.unifi.it",
                city: "Prato",
                gender: "M"
            },
            skills: [
                { id: 1, name: "Java" },
                { id: 2, name: "Vue js" }
            ],
        },
        {
            id: 2,
            personalData: {
                photoUrl: "https://semantic-ui.com/images/avatar/large/matthew.jpg",
                name: "Paolo Innocenti",
                role: "Frontend developer",
                email: "paolo.innocenti@stud.unifi.it",
                city: "Pistoia",
                gender: "M"
            },
            skills: [
                { id: 1, name: "Java" },
                { id: 2, name: "Vue js" }
            ],
        }
    ]

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
            value: "R2"
        },
        photoUrl: {
            value: "https://semantic-ui.com/images/avatar/large/steve.jpg"
        },
        skills: [
            { id: 1, name: "Java" },
            { id: 2, name: "Vue js" }
        ],
        errors: []
    }

    const respInsertTeammate = {data: {
            id:1
        }}
    ApiService.insertTeammate.mockResolvedValue(respInsertTeammate);

    ApiService.updateTeammate.mockResolvedValue(null);

    respGetSkills = [
        { id: 1, name: 'Java' },
        { id: 2, name: 'Vue js' }
    ]
    ApiService.getSkills.mockResolvedValue({data: respGetSkills});

    const resp = { data: teammates };
    ApiService.getAllTeammates.mockResolvedValue(resp);

    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0.9;
    global.Math = mockMath;
});

describe("App.vue", () => {

    beforeEach(() => {
        wrapper = shallowMount(App, {
            data() {
                return{
                    newTeammate: newTeammate
                }
            }
        });
    });

    it('renders the app wrapper', () => {
        const appWrapper = wrapper.find('#app.m20');

        expect(appWrapper
            .exists())
            .toBeTruthy();
    })

    it('renders the PersonalDataForm', () => {
        const personalDataForm = wrapper.findComponent(PersonalDataForm);

        expect(wrapper
            .find('.mt35')
            .exists())
            .toBeTruthy();
        expect(personalDataForm
            .exists())
            .toBeTruthy();
        expect(personalDataForm.props('teammate'))
            .toBe(wrapper.vm.$data.newTeammate);
        expect(personalDataForm.props('genders'))
            .toBe(wrapper.vm.$data.genders);
        expect(personalDataForm.props('roles'))
            .toBe(wrapper.vm.$data.roles);
    })

    it('renders the TagMultiselect component', () => {
        const tagMultiselect = wrapper.findComponent(TagMultiselect);

        expect(wrapper
            .find('.mt35.mb35')
            .exists())
            .toBeTruthy();
        expect(tagMultiselect
            .exists())
            .toBeTruthy();
        expect(tagMultiselect.props('teammate'))
            .toBe(wrapper.vm.newTeammate);
        expect(tagMultiselect.props('options'))
            .toBe(wrapper.vm.skills);
    })

    it('renders the submit button', () => {
        const submitButton = wrapper.find('button.ui.button:nth-of-type(1)');

        expect(submitButton
            .exists())
            .toBeTruthy();
        expect(submitButton
            .text())
            .toMatch('Submit');
    })

    it('renders the reset button', () => {
        const resetButton = wrapper.find('button.ui.button:nth-of-type(2)')

        expect(resetButton
            .exists())
            .toBeTruthy();
        expect(resetButton
            .text())
            .toMatch('Reset');
    })

    it('renders the errors list when teammate has errors', async () => {
        newTeammate.errors.push('error1');
        newTeammate.errors.push('error2');
        await wrapper.setData({newTeammate: newTeammate});
        const errorListWrapper = wrapper.find('.ui.error.message.mt30 .header span');

        expect(errorListWrapper
            .exists())
            .toBeTruthy();
        expect(errorListWrapper
            .text())
            .toMatch('Issues');
        expect(wrapper.findAll('.ui.error.message.mt30 .list li').length)
            .toBe(2);
    })

    it('does not render the error list when teammate has no errors', async () => {
        const errorListWrapper = wrapper.find('.ui.error.message.mt30 .header span');
        expect(errorListWrapper
            .exists())
            .toBeFalsy();
    })

    it("renders the divider", () => {
        expect(wrapper.find(".ui.divider"));
    });

    it("renders the teammates list title", () => {
        const element = wrapper.find(".ui.center.aligned.icon.header");

        expect(element
            .find(".circular.users.icon")
            .exists())
            .toBeTruthy();

        expect(element.text())
            .toMatch("Teammates");

    });

    it("renders the card's grid", () => {
        expect(wrapper
            .find(".ui.three.column.stackable.grid.mt35")
            .exists())
            .toBeTruthy();
    });

    it("renders the cards", () => {
        const cards = wrapper.findAllComponents(Card);

        expect(cards.length)
            .toBe(wrapper.vm.teammates.length);

        cards.wrappers.forEach(card => {
            expect(card.classes("column"))
                .toBeTruthy();

            expect(card.attributes("style"))
                .toMatch("margin-bottom: 20px");
            expect(wrapper.vm.teammates)
                .toContain(card.props("person"));
        });
    });


});

describe("The App component is initialized properly", () => {

    beforeEach(() => {
        wrapper = shallowMount(App);

    });

    it("initializes the skills properly", async () => {
        expect(wrapper.vm.skills.length)
            .toBe(2);
    })

    it("initializes the errors", async () => {
        expect(wrapper.vm.newTeammate.errors.length)
            .toBe(0);
        expect(wrapper.vm.errorLoadingTeammates)
            .toBeFalsy();
        expect(wrapper.vm.errorDeletingTeammate)
            .toBeFalsy();
    })

})

describe("The teammates are loaded and the view is updated correctly", () => {

    let spyGetAllTeammatesAndUpdateView = null;

    beforeEach(() => {
        const respGetAllTeammates = { data: teammates };
        ApiService.getAllTeammates.mockResolvedValue(respGetAllTeammates);

        spyGetAllTeammatesAndUpdateView = jest.spyOn(App.methods, "getAllTeammatesAndUpdateView");

        wrapper = shallowMount(App);
    });

    it("renders the teammates on mounted hook", () => {
        expect(spyGetAllTeammatesAndUpdateView).toHaveBeenCalledTimes(1);

        expect(wrapper.vm.teammates)
            .toEqual(teammates);
    });

});

describe("The teammates are not loaded", () => {

    beforeEach(() => {
        const error = { message: "generic error message" };
        ApiService.getAllTeammates.mockRejectedValue(error);

        wrapper = shallowMount(App);
    });

    it("shows an error message", () => {
        const errorMessage = wrapper.find(".ui.error.floating.message.mt35");

        expect(errorMessage
            .find(".header").text())
            .toMatch("Error loading teammates");

        expect(errorMessage
            .find("p").text())
            .toMatch("Unable to load the teammates");

    });

});

describe("The teammate is deleted correctly", () => {

    let spyDeleteMethod = null;
    let spyUpdateViewMethod = null;

    beforeEach(() => {
        ApiService.deleteTeammate.mockResolvedValue(null);

        spyDeleteMethod = jest.spyOn(App.methods,
            "deleteTeammate");
        spyUpdateViewMethod = jest.spyOn(App.methods,
            "updateViewAfterDelete");

        wrapper = shallowMount(App);
    });

    it("delete the teammate", async () => {
        const teammateToDelete = wrapper.vm.teammates[1].id;

        wrapper.findAllComponents(Card).wrappers[0]
            .vm.$emit("delete", teammateToDelete);

        await flushPromises();

        expect(spyDeleteMethod)
            .toHaveBeenCalledTimes(1);

        expect(spyUpdateViewMethod)
            .toHaveBeenCalledTimes(1);

        expect(wrapper.vm.teammates
            .find(t => t.id === teammateToDelete))
            .toBeUndefined();
        expect(wrapper.vm.errorDeletingTeammate)
            .toBeFalsy();
    });

});

describe("The teammate is not deleted after performing delete operation", () => {

    beforeEach(() => {
        const error = { message: "generic error message" };
        ApiService.deleteTeammate.mockRejectedValue(error);

        wrapper = shallowMount(App);
    });

    it("shows an error message", async () => {
        const teammateToDelete = 100;

        wrapper.vm.deleteTeammate(teammateToDelete);

        await flushPromises();

        const errorMessage = wrapper.find(".ui.error.floating.message.mt35");

        expect(errorMessage
            .find(".header").text())
            .toMatch("Error deleting teammate");
        expect(errorMessage
            .find("p").text())
            .toMatch("Unable to delete the teammate");
    });

});

describe("The teammate is being updated after performing the edit operation", () => {

    let spyUpdateMethod = null;
    let spyPopulateSelects = null;
    let spyJQuery = null;

    beforeEach(() => {
        spyUpdateMethod = jest.spyOn(App.methods,
            "populateNewTeammateForUpdate");
        spyPopulateSelects = jest.spyOn(App.methods,
            "populateSelects");
        spyJQuery = jest.spyOn($.fn,
            "dropdown");

        wrapper = shallowMount(App);
        spyJQuery.mockClear();
    });

    it("it populates the corresponding object", () => {
        const teammateToUpdate = wrapper.vm.teammates[0].id;

        wrapper.findAllComponents(Card).wrappers[0]
            .vm.$emit("update", teammateToUpdate);
        newTeammate.id = wrapper.vm.teammates[0].id;

        expect(spyUpdateMethod)
            .toHaveBeenCalledTimes(1);
        expect(wrapper.vm.newTeammate)
            .toEqual(newTeammate);
        expect(spyPopulateSelects)
            .toHaveBeenCalledTimes(1);
        expect(spyJQuery)
            .toHaveBeenCalledTimes(2);
        expect(spyJQuery)
            .toHaveBeenCalledWith('set selected', newTeammate.gender.value);
        expect(spyJQuery)
            .toHaveBeenCalledWith('set selected', newTeammate.role.value);
    });

});

describe('the form is reset', () => {
    let spyResetSelects = null;
    let spyJQuery = null;

    beforeEach( () => {
        spyResetSelects = jest.spyOn(App.methods, 'resetSelects');
        spyJQuery = jest.spyOn($.fn, 'dropdown');

        wrapper = shallowMount(App, {
            data() {
                return{
                    newTeammate: newTeammate
                }
            }
        });

        spyJQuery.mockClear();
    })

    it('resets the PersonalDataForm and the TagMultiselect on Reset button click', () => {
        const emptyTeammate = {
            id: null,
            name: {},
            gender: {},
            email: {},
            city: {},
            role: {},
            photoUrl: {},
            skills: [],
            errors: []
        }
        const resetButton = wrapper.find('button.ui.button:nth-of-type(2)');


        resetButton.trigger('click');

        expect(wrapper.vm.$data.newTeammate)
            .toStrictEqual(emptyTeammate);
        expect(spyResetSelects)
            .toHaveBeenCalled();
        expect(spyJQuery)
            .toHaveBeenCalledTimes(1);
        expect(spyJQuery)
            .toHaveBeenCalledWith('clear');
    })
})

describe('the teammate is inserted and the view is updated', () => {

    let spyHandleTeammate = null;
    let spyInsertTeammate = null;
    let spyApiInsertTeammate = null;
    let spyUpdateViewAfterInsert = null;
    let spyClearNewTeammate = null;
    let spyGetSkillsAndUpdateView = null;

    beforeEach(() => {
        spyHandleTeammate = jest.spyOn(App.methods, 'handleTeammate');
        spyInsertTeammate = jest.spyOn(App.methods, 'insertTeammate');
        spyUpdateViewAfterInsert = jest.spyOn(App.methods, 'updateViewAfterInsert');
        spyApiInsertTeammate = jest.spyOn(ApiService, "insertTeammate");
        spyClearNewTeammate = jest.spyOn(App.methods, 'clearNewTeammate');
        spyGetSkillsAndUpdateView = jest.spyOn(App.methods, 'getSkillsAndUpdateView');

        ApiService.getAllTeammates.mockResolvedValue({data: []});

        const updateTeammateMock = jest.fn();

        wrapper = shallowMount(App, {
            data() {
                return{
                    newTeammate: newTeammate
                }
            }
        });

        wrapper.vm.updateTeammate = updateTeammateMock;
        spyGetSkillsAndUpdateView.mockClear(); // Resets the spy so that it's not counting the mounted call
    })

    it('enables submit if teammate is valid', () => {
        expect(wrapper.vm.submitDisabled)
            .toBeFalsy();
        expect(wrapper
            .find('button.ui.button:nth-of-type(1)')
            .attributes('disabled'))
            .toBeUndefined();
    })

    it('does not trigger insertTeammate if the teammate has an id', async () => {
        newTeammate.id = 1;
        await wrapper.setData({
            newTeammate: newTeammate
        })

        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');

        expect(spyHandleTeammate)
            .toHaveBeenCalledTimes(1);
        expect(spyInsertTeammate)
            .toHaveBeenCalledTimes(0);
    })

    it('triggers the handleTeammate and insertTeammate methods if the teammate is valid and has no id', () => {
        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');

        expect(spyHandleTeammate)
            .toHaveBeenCalledTimes(1);
        expect(spyInsertTeammate)
            .toHaveBeenCalledTimes(1);
    })

    it('inserts the teammate if the teammate is valid and has no id', async () => {
        wrapper.vm.handleTeammate();
        await flushPromises();

        expect(spyInsertTeammate)
            .toHaveBeenCalledTimes(1);
        expect(spyApiInsertTeammate)
            .toHaveBeenCalledTimes(1);
        expect(spyUpdateViewAfterInsert)
            .toHaveBeenCalledTimes(1);
    })

    it('updates the view after adding the new teammate', async () => {
        const expectedTeammate = {
            id: 1,
            personalData: {
                name: newTeammate.name.value,
                role: wrapper.vm.roles.find(r => {
                    return r.id === newTeammate.role.value
                }).name,
                gender: newTeammate.gender.value,
                photoUrl: avatarBaseUrl + wrapper.vm.avatars[newTeammate.gender.value][2]
                ,
                email: newTeammate.email.value,
                city: newTeammate.city.value
            },
            skills: newTeammate.skills
        }

        wrapper.vm.insertTeammate();
        await flushPromises();

        expect(wrapper.vm.$data.teammates)
            .toContainEqual(expectedTeammate);
        expect(spyClearNewTeammate)
            .toHaveBeenCalledTimes(1);
        expect(spyGetSkillsAndUpdateView)
            .toHaveBeenCalledTimes(1);
    })

    it('recovers the skills from the database', async () => {
        wrapper.vm.insertTeammate();
        await flushPromises();

        expect(wrapper.vm.skills)
            .toEqual(respGetSkills);
    })

    it('shows an error message if unable to insert the teammate', async () => {
        ApiService.insertTeammate.mockRejectedValue(null);
        await wrapper.vm.$forceUpdate();

        wrapper.vm.handleTeammate();
        await flushPromises();

        const errorList = wrapper.findAll('.ui.error.message.mt30 .list li');

        expect(errorList.length)
            .toBe(1);
        expect(errorList.at(0)
            .text())
            .toMatch("Error while inserting the teammate");
    })

    it('resets the insertTeammate error message on submit', async () => {
        await wrapper.setData({
            errorInsertingTeammate: true
        })

        wrapper.vm.handleTeammate();
        await flushPromises();

        const errorList = wrapper.findAll('.ui.error.message.mt30 .list li');

        expect(errorList.length)
            .toBe(0);
    })
})

describe('the teammate is updated and the view is updated accordingly', () => {

    let spyHandleTeammate = null;
    let spyUpdateTeammate = null;
    let spyApiUpdateTeammate = null;
    let spyUpdateViewAfterUpdate = null;
    let spyClearNewTeammate = null;
    let spyGetSkillsAndUpdateView = null;
    let savedTeammate1 = null;
    let savedTeammate2 = null;

    beforeEach(() => {
        newTeammate.id = 1;

        savedTeammate1 = {
            id: 1,
            personalData: {
                name: newTeammate.name.value,
                role: roles.find(r => {
                    return r.id === newTeammate.role.value
                }).name,
                gender: 'F',
                photoUrl: newTeammate.photoUrl.value,
                email: newTeammate.email.value,
                city: newTeammate.city.value
            },
            skills: newTeammate.skills
        }
        savedTeammate2 = {
            id: 2,
            personalData: {
                name: newTeammate.name.value,
                role: roles.find(r => {
                    return r.id === newTeammate.role.value
                }).name,
                gender: newTeammate.gender.value,
                photoUrl: newTeammate.photoUrl.value,
                email: 'mail@mail.it',
                city: newTeammate.city.value
            },
            skills: newTeammate.skills
        }
        teammates = [savedTeammate1, savedTeammate2];
        ApiService.getAllTeammates.mockResolvedValue({data: teammates});


        spyHandleTeammate = jest.spyOn(App.methods, 'handleTeammate');
        spyUpdateTeammate = jest.spyOn(App.methods, 'updateTeammate');
        spyApiUpdateTeammate = jest.spyOn(ApiService, 'updateTeammate');
        spyUpdateViewAfterUpdate = jest.spyOn(App.methods, 'updateViewAfterUpdate');
        spyClearNewTeammate = jest.spyOn(App.methods, 'clearNewTeammate');
        spyGetSkillsAndUpdateView = jest.spyOn(App.methods, 'getSkillsAndUpdateView');

        const mockMath = Object.create(global.Math)
        mockMath.random = () => 0.9;
        global.Math = mockMath;

        wrapper = shallowMount(App, {
            data() {
                return{
                    newTeammate: newTeammate
                }
            }
        });

        spyGetSkillsAndUpdateView.mockClear(); // Resets the spy so that it's not counting the mounted call
    })

    it('enables submit if teammate is valid', () => {
        expect(wrapper.vm.submitDisabled)
            .toBeFalsy();
        expect(wrapper
            .find('button.ui.button:nth-of-type(1)')
            .attributes('disabled'))
            .toBeUndefined();
    })

    it('does not trigger updateTeammate if the teammate has no id', async () => {
        newTeammate.id = undefined;
        await wrapper.setData({
            teammates: []
        })

        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');
        await wrapper.vm.$nextTick();

        expect(spyHandleTeammate)
            .toHaveBeenCalledTimes(1);
        expect(spyUpdateTeammate)
            .toHaveBeenCalledTimes(0);
    })

    it('triggers the handleTeammate and updateTeammate methods if the teammate is valid and has an id', () => {
        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');

        expect(spyHandleTeammate)
            .toHaveBeenCalledTimes(1);
        expect(spyUpdateTeammate)
            .toHaveBeenCalledTimes(1);
    })

    it('updates the teammate if the teammate is valid and has an id', async () => {
        wrapper.vm.handleTeammate();
        await flushPromises();

        expect(spyUpdateTeammate)
            .toHaveBeenCalledTimes(1);
        expect(spyApiUpdateTeammate)
            .toHaveBeenCalledTimes(1);
    })

    it('updates the view after updating the teammate', async () => {
        const teammatesLength = wrapper.vm.teammates.length;
        const updatedTeammate = {
            id: 2,
            name: {
                value: 'New name'
            },
            gender: {
                value: 'F'
            },
            email: {
                value: 'newemail@email.it'
            },
            city: {
                value: 'NewCity'
            },
            role: {
                value: 'R2'
            },
            skills: [
                {id: 1, name: 'skill1'}
            ],
            errors: [],
            photoUrl: {
                value: teammates[1].personalData.photoUrl
            }
        }
        await wrapper.setData({
            newTeammate: updatedTeammate
        })

        const expectedTeammate = {
            id: 2,
            personalData: {
                name: updatedTeammate.name.value,
                role: wrapper.vm.roles.find(r => {
                    return r.id === updatedTeammate.role.value
                }).name,
                gender: updatedTeammate.gender.value,
                photoUrl: avatarBaseUrl +
                    wrapper.vm.avatars[updatedTeammate.gender.value][2],
                email: updatedTeammate.email.value,
                city: updatedTeammate.city.value
            },
            skills: updatedTeammate.skills
        }

        wrapper.vm.updateTeammate()
        await flushPromises();

        expect(spyUpdateViewAfterUpdate)
            .toHaveBeenCalledTimes(1);
        expect(wrapper.vm.teammates.length)
            .toBe(teammatesLength);
        expect(wrapper.vm.teammates)
            .toContainEqual(expectedTeammate);
        expect(wrapper.vm.teammates)
            .toContainEqual(savedTeammate1);
        expect(spyClearNewTeammate)
            .toHaveBeenCalledTimes(1);
        expect(spyGetSkillsAndUpdateView)
            .toHaveBeenCalledTimes(1);
    })

    it('does not change the photoURL if the gender does not change', async () => {
        const updatedTeammate = {
            id: 2,
            name: {
                value: 'New name'
            },
            gender: {
                value: 'M'
            },
            email: {
                value: 'newemail@email.it'
            },
            city: {
                value: 'NewCity'
            },
            role: {
                value: 'R2'
            },
            skills: [
                {id: 1, name: 'skill1'}
            ],
            errors: [],
            photoUrl: {
                value: teammates[0].personalData.photoUrl
            }
        }

        await wrapper.setData({
            newTeammate: updatedTeammate
        })

        const expectedTeammate = {
            id: 2,
            personalData: {
                name: updatedTeammate.name.value,
                role: wrapper.vm.roles.find(r => {
                    return r.id === updatedTeammate.role.value
                }).name,
                gender: updatedTeammate.gender.value,
                photoUrl: teammates[0].personalData.photoUrl,
                email: updatedTeammate.email.value,
                city: updatedTeammate.city.value
            },
            skills: updatedTeammate.skills
        }

        wrapper.vm.updateTeammate()
        await flushPromises();

        expect(wrapper.vm.teammates)
            .toContainEqual(expectedTeammate);
    })

    it('shows an error message if unable to update the teammate', async () => {
        ApiService.updateTeammate.mockRejectedValue(null);
        await wrapper.vm.$forceUpdate();

        wrapper.vm.handleTeammate();
        await flushPromises();

        const errorList = wrapper.findAll('.ui.error.message.mt30 .list li');

        expect(errorList.length)
            .toBe(1);
        expect(errorList.at(0)
            .text())
            .toMatch("Error while updating the teammate");
    })

    it('resets the updateTeammate error message on submit', async () => {
        await wrapper.setData({
            errorUpdatingTeammate: true
        })

        wrapper.vm.handleTeammate();
        await flushPromises();

        const errorList = wrapper.findAll('.ui.error.message.mt30 .list li');

        expect(errorList.length)
            .toBe(0);
    })
})

describe('the teammate is not valid', () => {
    let spyInsertTeammate = null;
    let spyUpdateTeammate = null;

    beforeEach(() => {
        spyInsertTeammate = jest.spyOn(App.methods, 'insertTeammate');
        spyUpdateTeammate = jest.spyOn(App.methods, 'updateTeammate');

        wrapper = shallowMount(App);
    })

    it('disables submit if teammate.name is not valid', async () => {
        newTeammate.name = {};
        await wrapper.setData({
            newTeammate: newTeammate
        })

        expect(wrapper.vm.submitDisabled)
            .toBeTruthy();
        expect(wrapper
            .find('button.ui.button:nth-of-type(1)')
            .attributes('disabled'))
            .toBeDefined();
    })

    it('disables submit if teammate.gender is not valid', async () => {
        newTeammate.gender = {};
        await wrapper.setData({
            newTeammate: newTeammate
        })

        expect(wrapper.vm.submitDisabled)
            .toBeTruthy();
        expect(wrapper
            .find('button.ui.button:nth-of-type(1)')
            .attributes('disabled'))
            .toBeDefined();
    })

    it('disables submit if teammate.email is not valid', async () => {
        newTeammate.email = {};
        await wrapper.setData({
            newTeammate: newTeammate
        })

        expect(wrapper.vm.submitDisabled)
            .toBeTruthy();
        expect(wrapper
            .find('button.ui.button:nth-of-type(1)')
            .attributes('disabled'))
            .toBeDefined();
    })

    it('disables submit if teammate.role is not valid', async () => {
        newTeammate.role = {};
        await wrapper.setData({
            newTeammate: newTeammate
        })

        expect(wrapper.vm.submitDisabled)
            .toBeTruthy();
        expect(wrapper
            .find('button.ui.button:nth-of-type(1)')
            .attributes('disabled'))
            .toBeDefined();
    })

    it('disables submit if teammate.city is not valid', async () => {
        newTeammate.city = {};
        await wrapper.setData({
            newTeammate: newTeammate
        })

        expect(wrapper.vm.submitDisabled)
            .toBeTruthy();
        expect(wrapper
            .find('button.ui.button:nth-of-type(1)')
            .attributes('disabled'))
            .toBeDefined();
    })

    it('does not insert the teammate if email is invalid', async () => {
        newTeammate.email.value = 'bad email';
        await wrapper.setData({
            newTeammate: newTeammate
        })

        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');

        expect(spyInsertTeammate)
            .toHaveBeenCalledTimes(0);
        expect(wrapper.vm.newTeammate.errors)
            .toContain("Please enter a correct value for field email")
        expect(wrapper.vm.newTeammate.email.error)
            .toBeTruthy();
        expect(wrapper.vm.newTeammate.name.error)
            .toBeFalsy();
        expect(wrapper.vm.newTeammate.city.error)
            .toBeFalsy();
    })

    it('does not update the teammate if email is invalid', async () => {
        newTeammate.id = 1;
        newTeammate.email.value = 'bad email'
        await wrapper.setData({
            newTeammate: newTeammate
        })

        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');

        expect(spyUpdateTeammate)
            .toHaveBeenCalledTimes(0);
        expect(wrapper.vm.newTeammate.errors)
            .toContain("Please enter a correct value for field email")
        expect(wrapper.vm.newTeammate.email.error)
            .toBeTruthy();
        expect(wrapper.vm.newTeammate.name.error)
            .toBeFalsy();
        expect(wrapper.vm.newTeammate.city.error)
            .toBeFalsy();
    })

    it('does not insert the teammate if name is invalid', async () => {
        newTeammate.name.value = '1bad name1'
        await wrapper.setData({
            newTeammate: newTeammate
        })

        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');

        expect(spyInsertTeammate)
            .toHaveBeenCalledTimes(0);
        expect(wrapper.vm.newTeammate.errors)
            .toContain("Please enter a correct value for field name")
        expect(wrapper.vm.newTeammate.name.error)
            .toBeTruthy();
        expect(wrapper.vm.newTeammate.email.error)
            .toBeFalsy();
        expect(wrapper.vm.newTeammate.city.error)
            .toBeFalsy();
    })

    it('does not update the teammate if name is invalid', async () => {
        newTeammate.id = 1;
        newTeammate.name.value = '1bad name1'
        await wrapper.setData({
            newTeammate: newTeammate
        })

        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');

        expect(spyUpdateTeammate)
            .toHaveBeenCalledTimes(0);
        expect(wrapper.vm.newTeammate.errors)
            .toContain("Please enter a correct value for field name")
        expect(wrapper.vm.newTeammate.name.error)
            .toBeTruthy();
        expect(wrapper.vm.newTeammate.email.error)
            .toBeFalsy();
        expect(wrapper.vm.newTeammate.city.error)
            .toBeFalsy();
    })

    it('does not insert the teammate if city is invalid', async () => {
        newTeammate.city.value = '1bad city1'
        await wrapper.setData({
            newTeammate: newTeammate
        })

        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');

        expect(spyInsertTeammate)
            .toHaveBeenCalledTimes(0);
        expect(wrapper.vm.newTeammate.errors)
            .toContain("Please enter a correct value for field city")
        expect(wrapper.vm.newTeammate.city.error)
            .toBeTruthy();
        expect(wrapper.vm.newTeammate.name.error)
            .toBeFalsy();
        expect(wrapper.vm.newTeammate.email.error)
            .toBeFalsy();
    })

    it('does not update the teammate if city is invalid', async () => {
        newTeammate.id = 1;
        newTeammate.city.value = '1bad city1'
        await wrapper.setData({
            newTeammate: newTeammate
        })

        wrapper.find('button.ui.button:nth-of-type(1)').trigger('click');

        expect(spyUpdateTeammate)
            .toHaveBeenCalledTimes(0);
        expect(wrapper.vm.newTeammate.errors)
            .toContain("Please enter a correct value for field city")
        expect(wrapper.vm.newTeammate.city.error)
            .toBeTruthy();
        expect(wrapper.vm.newTeammate.name.error)
            .toBeFalsy();
        expect(wrapper.vm.newTeammate.email.error)
            .toBeFalsy();
    })
})

describe('The skills are loaded', () => {
    let spyGetSkillAndUpdateView = null;

    beforeEach(() => {
        spyGetSkillAndUpdateView = jest.spyOn(App.methods, "getSkillsAndUpdateView");

        wrapper = shallowMount(App);
    })

    it('triggers the getSkillAndUpdateView method on mount', () => {
        expect(spyGetSkillAndUpdateView)
            .toHaveBeenCalledTimes(1);
    })
})

afterEach(() => {
    jest.clearAllMocks();
    wrapper.destroy();
})
