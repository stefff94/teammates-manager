import { shallowMount } from "@vue/test-utils";
import CardBack from "../../../src/components/CardBack";

let wrapper = null;

beforeEach(() => {
    wrapper = shallowMount(CardBack, {
        propsData: {
            skills: [
                { id: 1, name: "Java" },
                { id: 2, name: "Spring Boot" },
                { id: 3, name: "Javascript" },
                { id: 4, name: "Vue js" }
            ],
            id: 1
        }
    });
});

afterEach(() => {
    wrapper.destroy();
});

describe("CardBack.vue", () => {

   it("renders the card back", () => {
       expect(wrapper
           .find(".flip-card-back .ui.card .content")
           .exists())
           .toBeTruthy();
   });

   it("renders the delete icon button", () => {
       expect(wrapper
           .find(".content .right.floated.large.icon.trash.alternate.outline.delete")
           .exists())
           .toBeTruthy();
   });

   it("renders the edit icon button", () => {
       expect(wrapper
           .find(".content .right.floated.large.icon.pencil.alternate.update")
           .exists())
           .toBeTruthy();
   });

   it("renders the header", () => {
       const header = wrapper.find(".content .header.text-center");

       expect(header.exists())
           .toBeTruthy();

       expect(header.text())
           .toMatch("Skills");
   });

   it("renders the content", () => {
      expect(wrapper
          .find(".content .description.mt30")
          .exists())
          .toBeTruthy();
   });

   it("renders the items", () => {
       const items = wrapper
           .findAll(".description .ui.bulleted.list .item");

       expect(items.length)
           .toBe(wrapper.vm.skills.length);

       items.wrappers.forEach(skill =>
           expect(wrapper.vm.skills.map(s => s.name))
               .toContain(skill.text())
       );
   });

});

describe("The delete icon button is clicked", () => {

    beforeEach(() => {
        wrapper.find(".content .icon.trash")
            .trigger("click");
    });

    it("emit the corresponding event", () => {
        expect(wrapper.emitted().delete[0])
            .toEqual([wrapper.vm.id]);
    });

});

describe("The edit icon button is clicked", () => {

    beforeEach(() => {
        wrapper.find(".content .icon.pencil")
            .trigger("click");
    });

    it("emit the corresponding event", () => {
        expect(wrapper.emitted().update[0])
            .toEqual([wrapper.vm.id]);
    });

});
