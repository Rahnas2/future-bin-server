
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { AuthRequest } from "../../dtos/authRequestDto";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IReveiwInteractor } from "../../interfaces/interactors/IReviewInteractor";

@injectable()
export class reviewController {
  constructor(@inject(INTERFACE_TYPE.reviewInteractor) private reviewInteractor: IReveiwInteractor) { }

  //add new review
  onAddReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log('start adding review ')
    try {
      const userId = req._id
      const data = req.body

      const review = await this.reviewInteractor.addReview({ userId, ...data })

      res.status(200).json({ message: 'reveiw added successfully ', review })

    } catch (error) {
      next(error)
    }
  }

  //update review
  onUpdateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { _id, ...data } = req.body

      if (!_id) {
        res.status(400).json({ message: 'id is missing' })
      }

      const updatedReview = await this.reviewInteractor.updateReview(_id, data)

      res.status(200).json({ message: 'review updated successfully ', updatedReview })
    } catch (error) {
      next(error)
    }
  }

  //get all reviews 
  onGetAllReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10

      const reviews = await this.reviewInteractor.getAllReviews(page, limit)
      res.status(200).json({ message: 'success', reviews })
    } catch (error) {
      next(error)
    }
  }

  //get all reviews about app
  onGetAllAppReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviews = await this.reviewInteractor.getAllAppReviews()
      console.log('reviews controller ', reviews)
      res.status(200).json({ reviews })
    } catch (error) {
      next(error)
    }
  }

  //user review about app
  onGetUserReviewAboutApp = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req._id

      if (!userId) {
        res.status(400).json({ message: 'user id not found' })
        return
      }

      const review = await this.reviewInteractor.getUserReviewAboutApp(userId)
      console.log('review ', review)
      res.status(200).json({ message: 'success', review })
    } catch (error) {
      next(error);
    }
  }

  onGetUserReviewWithCollectorId = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req._id
      const collectorId = req.params.collectorId

      if (!userId) {
        res.status(400).json({ message: 'user id not found' })
        return
      }

      const review = await this.reviewInteractor.getUserReveiwWithCollectorId(userId, collectorId)
      res.status(200).json({ message: 'success', review })
    } catch (error) {
      next(error)
    }
  }

  //user reviews about collectors
  onGetUserReviewsAbountCollectors = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req._id

      if (!userId) {
        res.status(400).json({ message: 'user id not found' })
        return
      }

      const reviews = await this.reviewInteractor.getUserReviewsAboutCollectors(userId);
      res.status(200).json({ message: 'success', reviews });
    } catch (error) {
      next(error);
    }
  };

  // For collectors to see reviews about them
  onGetCollectorReviews = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const collectorId = req.params.collectorId;

      // Verify the requesting collector can only see their own reviews
      if (req.role === 'collector' && req._id !== collectorId) {
        res.status(403).json({ message: 'Unauthorized to view these reviews' });
        return
      }

      const reviews = await this.reviewInteractor.getCollectorReviews(collectorId);
      res.status(200).json({ message: 'success', reviews });
    } catch (error) {
      next(error);
    }
  };




  //delete a review
  onDeleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query

      if (!id || typeof id !== "string") {
        res.status(400).json({ message: 'id is invalid or not found' })
        return
      }

      await this.reviewInteractor.deleteReview(id)
      res.status(200).json({ message: 'reveiw deleted successfully ' })
    } catch (error) {
      next(error)
    }
  }




}