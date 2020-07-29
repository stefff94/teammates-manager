import { shallowMount } from "@vue/test-utils";
import Card from "../../../src/components/Card";
import CardBack from "../../../src/components/CardBack";
import CardFront from "../../../src/components/CardFront";

let wrapper = null;

// shallowMount method auto stubs child components of mounted component
// in our case it automatically stubs CardBack and CardFront component
beforeEach(() => {
    wrapper = shallowMount(Card, {
        propsData: {
            person: {
                id: 1,
                personalData: {
                    photoUrl: "https://semantic-ui.com/images/avatar/large/steve.jpg",
                    name: "Stefano Vannucchi",
                    role: "Student",
                    email: "stefano.vannucchi@stud.unifi.it",
                    city: "Prato"
                },
                skills: [
                    { id: 1, name: "Java" },
                    { id: 2, name: "Spring Boot" },
                    { id: 3, name: "Javascript" },
                    { id: 4, name: "Vue js" }
                ]
            }
        }
    });
});

afterEach(() => {
    wrapper.destroy();
});

describe("Card.vue", () => {

    it("renders the flip card", () => {
        expect(wrapper
            .find(".flip-card .flip-card-inner.text-left")
            .exists())
            .toBeTruthy();
    });

    it("renders the card front", () => {
        const cardFrontComponent =
            wrapper.findComponent(CardFront);

        expect(cardFrontComponent.exists())
            .toBeTruthy();

        expect(cardFrontComponent.props("data"))
            .toBe(wrapper.vm.person.personalData);
    });

    it("renders the card back", () => {
        const cardBackComponent =
            wrapper.findComponent(CardBack);
        
        expect(cardBackComponent.exists())
            .toBeTruthy();

        expect(cardBackComponent.props("skills"))
            .toBe(wrapper.vm.person.skills);

        expect(cardBackComponent.props("id"))
            .toBe(wrapper.vm.person.id);
    });

});

describe("The delete event is emitted by stubbed CardBack component", () => {

    beforeEach(() => {
        const cardBackComponent =
            wrapper.findComponent(CardBack);

        cardBackComponent.vm.$emit("delete",
            wrapper.vm.person.id);
    });

    it("intercept it and emit another delete event", () => {

        expect(wrapper.emitted().delete[0])
            .toEqual([wrapper.vm.person.id]);

    });

});

describe("The update event is emitted by stubbed CardBack component", () => {

    beforeEach(() => {
        const cardBackComponent =
            wrapper.findComponent(CardBack);

        cardBackComponent.vm.$emit("update",
            wrapper.vm.person.id);
    });

    it("intercept it and emit another update event", () => {
        expect(wrapper.emitted().update[0])
            .toEqual([wrapper.vm.person.id]);
    });

});
