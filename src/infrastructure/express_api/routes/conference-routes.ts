import { Router } from 'express'
import container from '../config/dependency-injection'
import { changeDates, changeSeats, organizeConference, bookSeat } from '../controllers/conference.controllers'
import { isAuthenticated } from '../middlewares/authentication.middleware'

const router = Router()

router.use(isAuthenticated)
router.post('/conference', organizeConference(container))
router.patch('/conference/seats/:id', changeSeats(container))
router.patch('/conference/dates/:id', changeDates(container))
router.post('/conference/:id/book', bookSeat(container))

export default router