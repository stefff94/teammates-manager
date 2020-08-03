Feature: App E2E Tests

	I want to make sure that the whole application is working properly

	Background: Initializing the database with some example data
		Given I visit the app root page
		And I fill "name" with "Stefano"
		And I fill "email" with "stefano.vannucchi@stud.unifi.it"
		And I select "M" for "gender-dropdown"
		And I fill "city" with "Florence"
		And I select "Student" for "role-dropdown"
		And I insert "Spring Boot" in the multiselect
		And I insert "Vue js" in the multiselect
		And I click on "Submit"
		And I wait for a little while
		And I fill "name" with "Paolo"
		And I fill "email" with "paolo.innocenti@stud.unifi.it"
		And I select "M" for "gender-dropdown"
		And I fill "city" with "Florence"
		And I select "Student" for "role-dropdown"
		And I insert "Spring Boot" in the multiselect
		And I insert "Vue js" in the multiselect
		And I click on "Submit"

	@cleanDB
	Scenario: Visiting the app root page, I should see the teammates list
		When I visit the app root page
		Then I see it contains the teammates list

	@cleanDB
	Scenario: Clicking the teammate's delete button, I should see the teammate disappear
		Given I visit the app root page
		When I click the teammate's "delete" button
		Then I see it disappear

	@cleanDB
	Scenario: Filling the form and pressing Submit, I should see a new teammate with the data
		Given I visit the app root page
		And I fill "name" with "New"
		And I fill "email" with "new@email.it"
		And I select "M" for "gender-dropdown"
		And I fill "city" with "New City"
		And I select "Student" for "role-dropdown"
		And I insert "Skill" in the multiselect
		When I click on "Submit"
		Then There should be a teammate card for the new teammate

	@cleanDB
	Scenario: Updating an existent teammate, I should see the teammate's data updated
		Given I visit the app root page
		And I click the teammate's "update" button
		And I clear the field "name"
		And I fill "name" with "Updated Name"
		And I clear the field "email"
		And I fill "email" with "updated@email.it"
		And I select "F" for "gender-dropdown"
		And I clear the field "city"
		And I fill "city" with "Updated City"
		And I select "Analyst Programmer" for "role-dropdown"
		And I insert "Another skill" in the multiselect
		When I click on "Submit"
		Then There should be a teammate card with the updated teammate
