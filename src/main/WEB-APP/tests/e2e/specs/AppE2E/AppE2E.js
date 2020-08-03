import { When, Then, After, And } from "cypress-cucumber-preprocessor/steps";

When(`I visit the app root page`, () => {
    cy.visit("/");
});

Then(`I see it contains the teammates list`, () => {
    const cards = cy.get(".ui.three.column.stackable.grid.mt35")
        .children();

    cards
        .should("have.length", 2);

    cards
        .should("contain", "Stefano");
    cards
        .should("contain", "Student");
    cards
        .should("contain", "stefano.vannucchi@stud.unifi.it");
    cards
        .should("contain", "Florence");
    cards
        .should("contain", "Spring Boot");
    cards
        .should("contain", "Vue js");

    cards
        .should("contain", "Paolo");
    cards
        .should("contain", "Student");
    cards
        .should("contain", "paolo.innocenti@stud.unifi.it");
    cards
        .should("contain", "Florence");
    cards
        .should("contain", "Spring Boot");
    cards
        .should("contain", "Vue js");
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

And("I wait for a little while", () => {
   cy.wait(1500);
});

When(/^I click on "(.*?)"$/, buttonName => {
    cy.get(".ui.button")
        .contains(buttonName)
        .click();
});

Then("There should be a teammate card for the new teammate", () => {
    const cards = cy.get(".ui.three.column.stackable.grid.mt35")
        .children();

    cards
        .should("contain", "New");
    cards
        .should("contain", "Student");
    cards
        .should("contain", "new@email.it");
    cards
        .should("contain", "New City");
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
        .should("contain", "Spring Boot");
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
