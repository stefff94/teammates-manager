import { When, Then, Before, After, And } from "cypress-cucumber-preprocessor/steps";
import ApiService from "../../../../src/services/ApiService";

let stefano = {
    personalData: {
        name: "Stefano Vannucchi",
        role: "Student",
        gender: "M",
        photoUrl: "https://semantic-ui.com/images/avatar/large/steve.jpg",
        email: "stefano.vannucchi@stud.unifi.it",
        city: "Prato"
    },
    skills: [
        { id: 1, name: "Java" },
        { id: 2, name: "Vue js" }
    ]
};
let paolo = {
    personalData: {
        name: "Paolo Innocenti",
        role: "Student",
        gender: "M",
        photoUrl: "https://semantic-ui.com/images/avatar/large/elliot.jpg",
        email: "paolo.innocenti@stud.unifi.it",
        city: "Pistoia"
    },
    skills: [
        { id: 1, name: "Java" },
        { id: 2, name: "Vue js" }
    ]
};

Before({ tags: "@initializeDB" }, () => {
    ApiService.insertTeammate(stefano).then(response =>
        stefano.id = response.data.id);

    ApiService.insertTeammate(paolo).then(response =>
        paolo.id = response.data.id);

    cy.wait(1500);
});

When(`I visit the app root page`, () => {
    cy.visit("/");
});

Then(`I see it contains the teammates list`, () => {
    const cards = cy.get(".ui.three.column.stackable.grid.mt35")
        .children();

    cards
        .should("have.length", 2);

    cards
        .should("contain", stefano.personalData.name);
    cards
        .should("contain", stefano.personalData.role);
    cards
        .should("contain", stefano.personalData.email);
    cards
        .should("contain", stefano.personalData.city);
    cards
        .should("contain", stefano.skills[0].name);
    cards
        .should("contain", stefano.skills[1].name);

    cards
        .should("contain", paolo.personalData.name);
    cards
        .should("contain", paolo.personalData.role);
    cards
        .should("contain", paolo.personalData.email);
    cards
        .should("contain", paolo.personalData.city);
    cards
        .should("contain", paolo.skills[0].name);
    cards
        .should("contain", paolo.skills[1].name);
});

When(/^I click the teammate's "(.*?)" button$/, buttonName => {
    cy.get(".icon." + buttonName).first()
        .click({force: true});
});

Then("I see it disappear", () => {
    cy.get(".ui.three.column.stackable.grid.mt35")
        .children()
        .should("have.length", 1);
});

And(/^I clear the field "(.*?)"$/, fieldName => {
    cy.get("input[name='" + fieldName + "']")
        .clear();
});

And(/^I fill "(.*?)" with "(.*?)"$/, (fieldName, data) => {
    cy.get("input[name='" + fieldName + "']")
        .type(data);
});

And(/^I select "(.*?)" for "(.*?)"$/, (dropdownValue, dropdownName) => {
    cy.get(".ui.selection.dropdown." + dropdownName)
        .click()
        .get(".menu.transition.visible .item")
        .contains(dropdownValue).click();
});

And(/^I insert "(.*?)" in the multiselect$/, skillName => {
    cy.get("#skill-multiselect")
        .click()
        .type(skillName)
        .contains(skillName)
        .click();
});

/*And("I wait for a while", () => {

});*/

When(/^I click on "(.*?)"$/, buttonName => {
    cy.get(".ui.button")
        .contains(buttonName)
        .click();
});

Then("There should be a teammate card for the new teammate", () => {
    const cards = cy.get(".ui.three.column.stackable.grid.mt35")
        .children();

    cards
        .should("contain", "Paolo");
    cards
        .should("contain", "Student");
    cards
        .should("contain", "paolo.innocenti@stud.unifi.it");
    cards
        .should("contain", "Florence");
    cards
        .should("contain", "Skill");
});

Then("There should be a teammate card with the updated teammate", () => {
    const cards = cy.get(".ui.three.column.stackable.grid.mt35")
        .children();

    cards
        .should("contain", "Updated Name");
    cards
        .should("contain", "Analyst Programmer");
    cards
        .should("contain", "updated@email.it");
    cards
        .should("contain", "Updated City");
    cards
        .should("contain", "Java");
    cards
        .should("contain", "Vue js");
    cards
        .should("contain", "Another skill");
});

After({ tags: "@cleanDB" }, () => {
    cy.get(".icon.trash")
        .each((el) =>
            cy.wrap(el).click({force: true}));
});
