
import { Request } from "express";

export interface AuthRequest extends Request {
    _id?: string;
    role?: string
}