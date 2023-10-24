const express = require('express');
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobs');
const router = express.Router();

router.get('/', getAllJobs);
router.get('/:jobId', getJob);
router.post('/', createJob);
router.patch('/:jobId', updateJob);
router.delete('/:jobId', deleteJob);

module.exports = router;
