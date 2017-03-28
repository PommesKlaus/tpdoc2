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
- [ ] Add property "Parent Reporting Entity" to Model: If set for an entity, the Parent Reporting Entity will also be included in the final report as it is needed to give a full picture. Not required. Object containing the foreign entities "id" and it's name.
- [ ] Add calculated property to model "deletable": Check if company is part of a transaction or if entity is a "Parent Reporting Entity"
- [ ] Implement logic to prevent deletion if entity is participation in a transaction or if entity is a "Parent Reporting Entity"

### File-Upload
- [ ] Enable Multi-Upload (postponed)
- [ ] Write Authentication Tests
- [ ] Write Content Tests

### Generate Reports
- [ ] Implement logic to generate a combined report for a single entity or a group of entities.
- [ ] Include all entity's information (questionnaires) participating in transactions with the selected company
- [ ] Include all transactions (questionnaries) the entity is participating in
- [ ] Generate a combined zip-file with all relevant attachments including a folder structure
- [ ] Generate Word-Document with all relevant information (using xmlbuilder and zip)
