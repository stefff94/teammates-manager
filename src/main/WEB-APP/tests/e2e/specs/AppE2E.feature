Feature: App E2E Tests

	I want to make sure that the whole application is working properly

	Scenario: Filling the form with a wrong values and pressing Submit, I should see an error
		Given I visit the app root page
		And I fill "name" with "Paolo1"
		And I fill "email" with "paolo innocenti"
		And I select "M" for "gender-dropdown"
		And I fill "city" with "Florence1"
		And I select "Student" for "role-dropdown"
		And I insert "Skill" in the multiselect
		When I click on "Submit"
		Then I should see the error message: "Please enter a correct value for field name"
		And I should see the error message: "Please enter a correct value for field email"
		And I should see the error message: "Please enter a correct value for field city"

	Scenario: Filling the form and pressing Reset, I should see an empty form
		Given I visit the app root page
		And I fill "name" with "Paolo"
		And I fill "email" with "paolo.innocenti@stud.unifi.it"
		And I select "M" for "gender-dropdown"
		And I fill "city" with "Florence"
		And I select "Student" for "role-dropdown"
		And I insert "Skill" in the multiselect
		When I click on "Reset"
		Then There shouldn't be any data in the fields

	@initializeDB
	@cleanDB
	Scenario: Visiting the app root page, I should see the teammates list
		When I visit the app root page
		Then I see it contains the teammates list

	@initializeDB
	@cleanDB
	Scenario: Clicking the teammate's delete button, I should see the teammate disappear
		Given I visit the app root page
		When I click the teammate's "delete" button
		Then I see it disappear
	@cleanDB
	Scenario: Filling the form and pressing Submit, I should see a new teammate with the data
		Given I visit the app root page
		And I fill "name" with "Paolo"
		And I fill "email" with "paolo.innocenti@stud.unifi.it"
		And I select "M" for "gender-dropdown"
		And I fill "city" with "Florence"
		And I select "Student" for "role-dropdown"
		And I insert "Skill" in the multiselect
		When I click on "Submit"
		Then There should be a teammate card for the new teammate

	@initializeDB
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
