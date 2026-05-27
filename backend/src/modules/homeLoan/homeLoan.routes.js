// modules/homeLoan/homeLoan.routes.js — placeholder
import express from 'express'
import { createLoan, getLoans } from './homeLoan.controller.js'

const router = express.Router()
router.post('/', createLoan)
router.get('/', getLoans)

export default router
