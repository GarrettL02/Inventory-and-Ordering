Backend built with NEST JS

- Update File when new entities are added

Entities

- App
- Low Stock Event
- Parts
- Auth

Each entitiy has;

- Service: sql db calls and data returning
- Controller: calls services functions and gives them backend api route
- Module: connects them all together. Has Authentication check to access

Schemas

- Each function in the services file has a Schema to validate the api response against

Steps to add new entity

- Create Service, Module, Controller file in new entity folder
- Create schema folder in entity folder
- Make sure authentication is required to access data
