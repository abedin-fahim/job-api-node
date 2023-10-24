const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');

const getAllJobs = async (req, res) => {
  const { userId } = req.user;
  const jobs = await Job.find({ createdBy: userId }).sort('createdAt');
  return res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
  const { userId } = req.user;
  const { jobId } = req.params;

  const job = await Job.findOne({ createdBy: userId, _id: jobId });

  if (!job) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ req: 'success', message: 'Job not found' });
  }

  return res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.OK).json({ job });
};
const updateJob = async (req, res) => {
  // const { userId } = req.user;
  // const { jobId } = req.params;
  // const updatedJob = req.body;
  const {
    user: { userId },
    params: { jobId },
    body: { company, position },
  } = req;

  if (company === '' || position === '') {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Company or Position can not be empty' });
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ req: 'success', message: 'Job not found' });
  }

  return res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { jobId },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });

  if (!job) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ req: 'success', message: 'Job not found' });
  }

  return res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
