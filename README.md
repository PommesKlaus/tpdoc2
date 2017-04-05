# TP-doc 2

## To Do's

### Transactions
- [ ] Write more Content Tests

### Templates
- [ ] Write Content Tests

### User
- [ ] Add authentication logic to controller
- [ ] Write Authentication Tests
- [ ] Write Content Tests

### Entity
- [x] Add property "Parent Reporting Entity" to Model: If set for an entity, the Parent Reporting Entity will also be included in the final report as it is needed to give a full picture. Not required. Object containing the foreign entities "id" and it's name.
- [ ] POSTPONED: Add calculated property to model "deletable": Check if company is part of a transaction or if entity is a "Parent Reporting Entity"
- [ ] POSTPONED: Implement logic to prevent deletion if entity is participation in a transaction or if entity is a "Parent Reporting Entity"
- [x] Temporarily disallow deletion of entities (should only be releavant in rare cases and could then be done via console)

### File-Upload
- [ ] POSTPONED: Enable Multi-Upload
- [ ] Write Authentication Tests
- [ ] Write Content Tests

### Generate Reports
- [ ] POSTPONED: Implement logic to generate a combined report for a single entity or a group of entities.
- [ ] POSTPONED: Include all entity's information (questionnaires) participating in transactions with the selected company
- [ ] POSTPONED: Include all transactions (questionnaries) the entity is participating in
- [ ] POSTPONED: Generate a combined zip-file with all relevant attachments including a folder structure
- [ ] POSTPONED: Generate Word-Document with all relevant information (using xmlbuilder and zip)
- [ ] POSTPONED: Add ability to genarate a list for selected companies with all transactions that are relevant in a given year, eventually filtered by transaction type (idea: get confirmation of relevant persons, that list of transactions is complete and none are missing.)
