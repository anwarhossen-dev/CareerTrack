import { Router } from 'express';
import { 
  createApplication, 
  listApplications, 
  getApplicationById, 
  updateApplication, 
  deleteApplication 
} from '../controllers/application.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Apply JWT authentication to all application endpoints
router.use(authenticateJWT);

router.post('/', createApplication);
router.get('/', listApplications);
router.get('/:id', getApplicationById);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
