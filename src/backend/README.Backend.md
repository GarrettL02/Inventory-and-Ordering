Backend built with NEST JS

- Update File when new entities are added

Entities

- App
- Low Stock Event
- Parts
- Auth
- Part Images (one picture per part, files on disk)

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

Part Images

- Routes: GET / PUT / DELETE /api/parts/:id/image (one picture per part)
- The image file is saved on disk in UPLOAD_DIR (default ./uploads/partImages); the partAttachments table only stores the generated file name, the original name and the mime type
- PUT takes the raw image as the request body with its own Content-Type (no multipart). main.ts registers the parser for image/* bodies, max 5 MB (MAX_IMAGE_BYTES)
- JPEG, PNG and WebP only - the type is checked from the file's first bytes, not from the header or file name
- Deleting a part deletes its picture file as well
- Back up UPLOAD_DIR together with the database
