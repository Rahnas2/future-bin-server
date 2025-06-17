
import {  NextFunction, Request, Response } from "express";
import { conflictError, Forbidden, InvalidCredentialsError, notFound, unAuthorized } from "../../domain/errors";
import { HttpStatusCode } from "../../utils/statusCode";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) =>{
    console.error('next error', err)

    if(err instanceof InvalidCredentialsError){
        res.status(HttpStatusCode.UNAUTHORIZED).json({message: err.message})  
        return     
    }

    if(err instanceof notFound){
        res.status(HttpStatusCode.NOT_FOUND).json({message: err.message})      
        return  
    }

    if(err instanceof unAuthorized) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({message: err.message})     
        return   
    }

    if(err instanceof Forbidden) {
        res.status(HttpStatusCode.FORBIDDEN).json({message: err.message})
        return
    }

    if(err instanceof conflictError) {
        res.status(HttpStatusCode.CONFLICT).json({message: err.message})
        return
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: err.message || 'Internal Server Error',
    });
}