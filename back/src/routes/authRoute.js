import authMiddleware from '../middlewares/authMiddleware.js';
import { Router } from "express";
import { authLogin } from "../controllers/authController.js";

const router = Router();

/**
 * @typedef {object} LoginRequest
 * @property {string} authorization.required - Bearer token in Authorization header
 */

/**
 * @typedef {object} LoginResponse
 * @property {string} userName - The user's name.
 * @property {string} email - The user's email.
 * @property {string} avatar - URL to the user's avatar.
 */

/**
 * @summary Login user
 * @tags Auth
 * @param {object} req.user.user
 * @return {object} 200 - Success response - application/json header - x-my-header - description of my header
 */
router.post('/auth/login', authMiddleware, authLogin);

/**
 * POST /api/auth/login
 * @tags Authentication
 * @param {LoginRequest} request.body.required - Login credentials
 * @security BearerAuth
 * @return {LoginResponse} 200 - Success response
 * @return {object} 400 - Bad request
 * @return {object} 401 - Unauthorized
 */

export default router;
