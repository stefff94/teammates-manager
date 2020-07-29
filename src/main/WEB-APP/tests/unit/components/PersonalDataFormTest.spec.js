import { shallowMount } from '@vue/test-utils'
import PersonalDataForm from '../../../src/components/PersonalDataForm';
import {genders, roles} from '../../../src/variables';

let wrapper = null;

beforeEach(() => {
    wrapper = shallowMount(PersonalDataForm, {
        propsData:{
            teammate: {
                name: {
                    value: 'Name',
                    error: false
                },
                gender: {},
                email: {
                    value: 'Email',
                    error: false
                },
                city: {
                    value: 'City',
                    error: false
                },
                role: {}
            },
            genders: genders,
            roles: roles
        }
    });
})

afterEach(() => {
    wrapper.destroy();
})

describe('PersonalDataForm.vue', () => {

    it('renders the form', () => {
        expect(wrapper
            .find('form.ui.form')
            .exists())
            .toBeTruthy();
    })

    it('renders the header', () => {
        const header = wrapper.find('form .ui.dividing.header');

        expect(header
            .exists())
            .toBeTruthy();
        expect(header
            .text())
            .toMatch('Teammate Data');

    })

    it('renders the fields wrapper',  () => {
        expect(wrapper
            .find('.form .field')
            .exists())
            .toBeTruthy();
    })

    it('renders the label', () => {
        const label = wrapper.find('.form .field label')

        expect(label
            .exists())
            .toBeTruthy();
        expect(label
            .text())
            .toMatch('Personal Data');
    })

    it('renders the name input field', () => {
        const nameInputField = wrapper.find('.three.fields .field:nth-of-type(1) input');

        expect(nameInputField
            .exists())
            .toBeTruthy();
        expect(nameInputField
            .attributes('type'))
            .toBe('text');
        expect(nameInputField
            .attributes('name'))
            .toBe('name');
        expect(nameInputField
            .attributes('placeholder'))
            .toBe('Name');
        expect(wrapper
            .find('.three.fields .field:nth-of-type(1)')
            .attributes('class'))
            .toMatch('field');
    })

    it('renders the error for the name input field', async () => {
        await wrapper.setProps({
            teammate: {
                name: {
                    value: 'Name',
                    error: true
                },
                gender: {},
                email: {
                    value: 'Email',
                    error: false
                },
                city: {
                    value: 'City',
                    error: false
                },
                role: {}
            }
        })
        const nameInputFieldWrapper = wrapper.find('.three.fields .field:nth-of-type(1)');

        expect(nameInputFieldWrapper
            .attributes('class'))
            .toMatch('field error');
    })

    it('updates the teammate.name prop', () => {
        const nameInputField = wrapper.find('.three.fields .field:nth-of-type(1) input');

        nameInputField.element.value = 'Teammate name';
        nameInputField.trigger('input');

        expect(wrapper.vm.teammate.name.value)
            .toMatch('Teammate name');
    })

    it('renders the email input field', () => {
        const emailInputField = wrapper.find('.three.fields .field:nth-of-type(2) input');

        expect(emailInputField
            .exists())
            .toBeTruthy();
        expect(emailInputField
            .attributes('type'))
            .toBe('text');
        expect(emailInputField
            .attributes('name'))
            .toBe('email');
        expect(emailInputField
            .attributes('placeholder'))
            .toBe('E-mail');
        expect(wrapper
            .find('.three.fields .field:nth-of-type(2)')
            .attributes('class'))
            .toMatch('field');
    })

    it('updates the teammate.email prop', () => {
        const emailInputField = wrapper.find('.three.fields .field:nth-of-type(2) input');

        emailInputField.element.value = 'mail@mail.it';
        emailInputField.trigger('input');

        expect(wrapper.vm.teammate.email.value)
            .toMatch('mail@mail.it');
    })

    it('renders the error for the email input field', async () => {
        await wrapper.setProps({
            teammate: {
                name: {
                    value: 'Name',
                    error: false
                },
                gender: {},
                email: {
                    value: 'Email',
                    error: true
                },
                city: {
                    value: 'City',
                    error: false
                },
                role: {}
            }
        })

        const emailInputFieldWrapper = wrapper.find('.three.fields .field:nth-of-type(2)');

        expect(emailInputFieldWrapper
            .attributes('class'))
            .toMatch('field error');
    })

    it('renders the gender dropdown select when teammate has no gender selected', () => {
        const genderSelectField = wrapper.find('.three.fields .field:nth-of-type(3) select');
        const genderOptions = genderSelectField.findAll('option');

        expect(genderSelectField
            .exists())
            .toBeTruthy();
        expect(genderSelectField
            .attributes('class'))
            .toBe('ui selection dropdown gender-dropdown');
        expect(genderSelectField
            .attributes('id'))
            .toBe('gender-dropdown');
        expect(genderSelectField
            .element
            .value)
            .toMatch('');
        expect(wrapper.vm.teammate.gender.value)
            .toBeUndefined();
        expect(genderOptions.length)
            .toBe(3);
        expect(genderOptions.at(1)
            .element
            .getAttribute('value'))
            .toMatch('M');
        expect(genderOptions.at(1)
            .text())
            .toMatch('Male');
        expect(genderOptions.at(2)
            .element
            .getAttribute('value'))
            .toMatch('F');
        expect(genderOptions.at(2)
            .text())
            .toMatch('Female');
    })

    it('updates the teammate.gender prop', () => {
        const genderSelectField = wrapper.find('.three.fields .field:nth-of-type(3) select');
        genderSelectField.findAll('option')
            .at(2)
            .element
            .selected = true;
        genderSelectField.trigger('change');

        expect(wrapper.vm.teammate.gender.value)
            .toMatch('F');
    })

    it('renders the city input field', () => {
        const cityInputField = wrapper.find('.two.fields .field:nth-of-type(1) input');

        expect(cityInputField
            .exists())
            .toBeTruthy();
        expect(cityInputField
            .attributes('type'))
            .toBe('text');
        expect(cityInputField
            .attributes('name'))
            .toMatch('city');
        expect(cityInputField
            .attributes('placeholder'))
            .toMatch('City');
        expect(wrapper
            .find('.two.fields .field:nth-of-type(1)')
            .attributes('class'))
            .toMatch('field');
    })

    it('renders the error for the city input field', async () => {
        await wrapper.setProps({
            teammate: {
                name: {
                    value: 'Name',
                    error: false
                },
                gender: {},
                email: {
                    value: 'Email',
                    error: false
                },
                city: {
                    value: 'City',
                    error: true
                },
                role: {}
            }
        })

        const cityInputFieldWrapper = wrapper.find('.two.fields .field:nth-of-type(1)');

        expect(cityInputFieldWrapper
            .attributes('class'))
            .toMatch('field error');
    })

    it('updates the teammate.city prop', () => {
        const cityInputField = wrapper.find('.two.fields .field:nth-of-type(1) input');
        cityInputField.element.value = 'Florence';
        cityInputField.trigger('input');
        expect(wrapper.vm.teammate.city.value).toBe('Florence')
    })

    it('renders the role dropdown select when teammate has no role selected', () => {
        const roleSelectField = wrapper.find('.two.fields .field:nth-of-type(2) select');
        const roleOptions = roleSelectField.findAll('option');

        expect(roleSelectField
            .exists())
            .toBeTruthy();
        expect(roleSelectField
            .attributes('class'))
            .toBe('ui selection dropdown role-dropdown');
        expect(roleSelectField
            .attributes('id'))
            .toBe('role-dropdown');
        expect(roleSelectField
            .element
            .value)
            .toBe('');
        expect(wrapper.vm.teammate.role.value)
            .toBeUndefined();
        expect(roleOptions.length)
            .toBe(6);
        expect(roleOptions.at(1)
            .element
            .getAttribute('value'))
            .toMatch('R1');
        expect(roleOptions.at(1)
            .text())
            .toMatch('Student');
        expect(roleOptions.at(2)
            .element
            .getAttribute('value'))
            .toMatch('R2');
        expect(roleOptions.at(2)
            .text())
            .toMatch('Frontend developer');
        expect(roleOptions.at(3)
            .element
            .getAttribute('value'))
            .toMatch('R3');
        expect(roleOptions.at(3)
            .text())
            .toMatch('Backend developer');
        expect(roleOptions.at(4)
            .element
            .getAttribute('value'))
            .toMatch('R4');
        expect(roleOptions.at(4)
            .text())
            .toMatch('Full Stack developer');
        expect(roleOptions.at(5)
            .element
            .getAttribute('value'))
            .toMatch('R5');
        expect(roleOptions.at(5)
            .text())
            .toMatch('Analyst Programmer');
    })

    it('updates the teammate.role prop', () => {
        const roleSelectField = wrapper.find('.two.fields .field:nth-of-type(2) select');
        roleSelectField.findAll('option')
            .at(2)
            .element
            .selected = true;
        roleSelectField.trigger('change');

        expect(wrapper.vm.teammate.role.value)
            .toMatch('R2');
    })
})
