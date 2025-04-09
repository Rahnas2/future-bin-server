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

router.get('/my-review/app', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident'), controller.onGetUserReviewsAbountCollectors)
router.get('/my-reviews/collectors', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident'), controller.onGetUserReviewsAbountCollectors)

router.get('/collector/:collectorId', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector', 'admin') , controller.onGetCollectorReviews)

export default router