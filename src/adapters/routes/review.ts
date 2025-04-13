import express from 'express';
import container from '../../infrastructure/config/container'

import { INTERFACE_TYPE } from '../../utils/appConst';
import { reviewController } from '../controllers/reviewController';
import { authMiddleware } from '../middleware/authMiddleware';
import { Auth } from 'googleapis';

const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<reviewController>(INTERFACE_TYPE.reviewController)

const router = express.Router();

router.route('/')
.get(controller.onGetAllReview)
.post(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident'), controller.onAddReview)
.put(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident', 'admin'), controller.onUpdateReview)
.delete(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident', 'admin'), controller.onDeleteReview)
router.get('/app', controller.onGetAllAppReviews)


//get user review about app return single document
router.get('/my-review/app', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident'), controller.onGetUserReviewAboutApp)

//get user review about a collector with the collector id return single document
router.get('/my-review/:collectorId', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident'), controller.onGetUserReviewWithCollectorId)

//get user reveiw about collector return arrray of document 
router.get('/my-reviews/collectors', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident'), controller.onGetUserReviewsAbountCollectors)




//get all reviews about the collector with collector id 
router.get('/collector/:collectorId', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector', 'admin') , controller.onGetCollectorReviews)

export default router