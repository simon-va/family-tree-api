import { Api } from '@chayns-codes/http';
import { AdminController } from './api/admin/admin.controller.js';
import { AuthController } from './api/auth/auth.controller.js';
import { PersonsController } from './api/persons/persons.controller.js';
import { RelationsController } from './api/relations/relations.controller.js';
import { ResidencesController } from './api/residences/residences.controller.js';

export default new Api()
  // auth 
  .post('/auth/user-key', AuthController.generateUserKey)

  // persons
  .get('/persons', PersonsController.getPersons)
  .post('/persons', PersonsController.addPerson)
  .put('/persons/:id', PersonsController.updatePerson)
  .delete('/persons/:id', PersonsController.deletePerson)

  // relations
  .get('/relations', RelationsController.getRelations)
  .post('/relations', RelationsController.addRelation)
  .put('/relations/:id', RelationsController.updateRelation)
  .delete('/relations/:id', RelationsController.deleteRelation)

  // residence
  .get('/residences', ResidencesController.getResidences)
  .post('/residences', ResidencesController.addResidence)
  .put('/residences/:id', ResidencesController.updateResidence)
  .delete('/residences/:id', ResidencesController.deleteResidence)

  // admin
  .get('/admin/storage-data', AdminController.getData)
  .delete('/admin/storage-data', AdminController.deleteData)
  .put('/admin/user-key-creation', AdminController.setUserKeyCreation)

  // build
  .build();