import { shallowMount } from "@vue/test-utils";
import CardFront from "../../../src/components/CardFront";

let wrapper = null;

beforeEach(() => {
    wrapper = shallowMount(CardFront, {
        propsData: {
            data: {
                photoUrl: "https://semantic-ui.com/images/avatar/large/steve.jpg",
                name: "Stefano Vannucchi",
                role: "Student",
                email: "stefano.vannucchi@stud.unifi.it",
                city: "Prato"
            }
        }
    });
});

afterEach(() => {
    wrapper.destroy();
});

describe("CardFront.vue", () => {

    it("renders the card front", () => {
        expect(wrapper
            .find(".flip-card-front .ui.card .content")
            .exists())
            .toBeTruthy();
    });

    it("renders the profile photo", () => {
        const image =
            wrapper.find(".content .image.left.floated.mini.ui.rounded");

        expect(image.exists())
            .toBeTruthy();

        expect(image.attributes("src"))
            .toMatch(wrapper.vm.data.photoUrl);
        expect(image.attributes("alt"))
            .toMatch("icon");
    });

    it("renders the header", () => {
        const header = wrapper.find(".content .header");

        expect(header.exists())
            .toBeTruthy();

        expect(header.text())
            .toMatch(wrapper.vm.data.name);
    });

    it("renders the sub-header", () => {
        const subHeader = wrapper.find(".content .meta");

        expect(subHeader.exists())
            .toBeTruthy();

        expect(subHeader.text())
            .toMatch(wrapper.vm.data.role);
    });

    it("renders the description and its content", () => {
        const items =
            wrapper.findAll(".content .description.mt35 .ui.list .item");

        expect(items.length).toBe(2);

        expect(items.at(0)
            .find(".mail.icon").exists())
            .toBeTruthy();

        expect(items.at(0)
            .find(".content").text())
            .toMatch(wrapper.vm.data.email);

        expect(items.at(1)
            .find(".globe.icon").exists())
            .toBeTruthy();

        expect(items.at(1)
            .find(".content").text())
            .toMatch(wrapper.vm.data.city);
    });

});
