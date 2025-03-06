
import {  NextFunction, Request, Response } from "express";
import { conflictError, Forbidden, InvalidCredentialsError, notFound, unAuthorized } from "../../domain/errors";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) =>{
    console.error('next error', err)

    if(err instanceof InvalidCredentialsError){
        res.status(401).json({message: err.message})  
        return     
    }

    if(err instanceof notFound){
        res.status(404).json({message: err.message})      
        return  
    }

    if(err instanceof unAuthorized) {
        res.status(401).json({message: err.message})     
        return   
    }

    if(err instanceof Forbidden) {
        res.status(403).json({message: err.message})
        return
    }

    if(err instanceof conflictError) {
        res.status(409).json({message: err.message})
        return
    }

    res.status(500).json({
        message: err.message || 'Internal Server Error',
    });
}