// modules/businessLoan/businessLoan.routes.js — placeholder
import express from 'express'
import { createLoan, getLoans } from './businessLoan.controller.js'

const router = express.Router()
router.post('/', createLoan)
router.get('/', getLoans)

export default router
