# Test to be performed

## Entity-Model

For Entities, the following rules should be validated:

- The existence of entities is a public information. Therefore, every valid user is able to retrieve a list of entities. This is also necessary as the creation/edit of transactions requires a list of potentially involved entities.
- The general list of entities should not contain detailed information (the questionnaires) for each entity but only a condensed representation (name, shortname, uuid)
- Only users with role "tp" should be allowed to add entities and/or retrieve detailed information for entities. As a result, the documentation of entities is a responsibility of a TP-expert. "Normal" users are not allowed for this task.
- Entities can only be deleted by a user with role "admin". TODO: Allow "tp"-users to delete entities but only if no transactions exist referencing to the entity

The following tests are performed for the given routes:

### Initialize tests

- Create Users (Normal, tp, admin)
- Create 1 dummy entit< with short questionnaire

### GET /api/entities - Get list of entities

- Missing JWT: Should return "Unauthorized"
- Existing JWT: Should return
  - an array of length 1
  - entities without "questionnaires"-property

### POST /api/entities - Create new entity

- Missing JWT: Should return "Unauthorized"
- Existing JWT and logged in and role "tp" is missing (normal user): should return "Unauthorized"
- Existing JWT and logged in as "tp" user: should return "OK"

### GET /api/entities/:entityId - Get entity

- Missing JWT: Should return "Unauthorized"
- Existing JWT and logged in and role "tp" is missing (normal user): should return "Unauthorized"
- Existing JWT and logged in as "tp" user:
  - should return "OK"
  - should return an object including the property "questionnaire"

### PUT /api/entities/:entityId - Update entity

- Missing JWT: Should return "Unauthorized"
- Existing JWT and logged in and role "tp" is missing (normal user): should return "Unauthorized"
- Existing JWT and logged in as "tp" user: should return "OK"

### DELETE /api/entities/:entityId - Delete entity

- Missing JWT: Should return "Unauthorized"
- Existing JWT and logged in and role "admin" is missing (tp user): should return "Unauthorized"
- Existing JWT and logged in as "admin" user: should return "OK"