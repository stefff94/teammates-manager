import { shallowMount } from '@vue/test-utils'
import App from "../../src/App";
import Card from "../../src/components/Card";
import ApiService from "../../src/services/api.service";

let wrapper = null;
let teammates = [];

jest.mock("../../src/services/api.service");

beforeEach(() => {
    teammates = [
        {
            id: 1,
            personalData: {
                photoUrl: "/images/avatar/large/steve.jpg",
                name: "Stefano Vannucchi",
                role: "Student",
                email: "stefano.vannucchi@stud.unifi.it",
                city: "Prato"
            },
            skills: [
                { id: "1", name: "Java" },
                { id: "2", name: "Spring Boot" },
                { id: "3", name: "Javascript" },
                { id: "4", name: "Vue js" }
            ],
        },
        {
            id: 2,
            personalData: {
                photoUrl: "/images/avatar/large/matthew.jpg",
                name: "Paolo Innocenti",
                role: "Student",
                email: "paolo.innocenti@stud.unifi.it",
                city: "Pistoia"
            },
            skills: [
                { id: "1", name: "Java" },
                { id: "2", name: "Spring Boot" },
                { id: "3", name: "Javascript" },
                { id: "4", name: "Vue js" }
            ],
        }
    ]
});

describe("App.vue", () => {

    beforeEach(() => {
        wrapper = shallowMount(App, {
            data: () => {
                return {
                    teammates: teammates
                }
            }
        });
    });

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

describe("The teammates are loaded and the view is updated correctly", () => {

    let spy = null;

    beforeEach(() => {
        const resp = { data: teammates };
        ApiService.getAllTeammates.mockResolvedValue(resp);

        spy = jest.spyOn(App.methods, "getAllTeammatesAndUpdateView");

        wrapper = shallowMount(App, {
            data: () => {
                return {
                    teammates: []
                }
            }
        });
    });

    it("renders the teammates on mounted hook", async () => {

        await expect(spy).toHaveBeenCalledTimes(1);

        await expect(wrapper.vm.teammates)
            .toEqual(teammates);
    });

});

describe("The teammates are not loaded", () => {

    beforeEach(() => {
        const error = { message: "generic error message" };
        ApiService.getAllTeammates.mockRejectedValue(error);

        wrapper = shallowMount(App, {
            data: () => {
                return {
                    teammates: []
                }
            }
        });
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
        const resp = { data: teammates };

        ApiService.getAllTeammates.mockResolvedValue(resp);
        ApiService.deleteTeammate.mockResolvedValue(null);

        spyDeleteMethod = jest.spyOn(App.methods,
            "deleteTeammate");
        spyUpdateViewMethod = jest.spyOn(App.methods,
            "updateViewAfterDelete");

        wrapper = shallowMount(App, {
            data: () => {
                return {
                    teammates: []
                }
            }
        });
    });

    it("delete the teammate", async () => {
        const teammateToDelete = wrapper.vm.teammates[0].id;

        wrapper.findAllComponents(Card).wrappers[0]
            .vm.$emit("delete", teammateToDelete);

        await expect(spyDeleteMethod)
            .toHaveBeenCalledTimes(1);

        await expect(spyUpdateViewMethod)
            .toHaveBeenCalledTimes(1);

        await expect(wrapper.vm.teammates
            .find(t => t.id === teammateToDelete))
            .toBeUndefined();
    });

});