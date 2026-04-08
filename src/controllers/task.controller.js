import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";
import {
  AvailableUserRole,
  UserRolesEnum,
  TaskStatusEnum,
  AvailableTasksStatus,
} from "../utils/constants.js";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const createTasks = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "project not found");
  }

  const files = req.files || [];
  const attachment = files.map((file) => ({
    url: `${process.env.SERVER_URL}/images/${file.filename || file.originalname}`,
    mimetype: file.mimetype,
    size: file.size,
  }));

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status: status || TaskStatusEnum.TODO,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments: attachment,
  }).then((task) => task.populate("assignedTo assignedBy"));

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;
  const updates = {
    title,
    description,
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
  };

  const task = await Task.findByIdAndUpdate(taskId, updates, {
    new: true,
    runValidators: true,
  }).populate("assignedTo assignedBy project");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Optional: check project exists
  const project = await Project.findById(task.project);
  if (!project) {
    throw new ApiError(404, "Associated project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Cascade delete subtasks
  await Subtask.deleteMany({ task: new mongoose.Types.ObjectId(taskId) });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { taskId, subtaskId } = req.params;
  const { title, isCompleted } = req.body;

  const subtask = await Subtask.findByIdAndUpdate(
    subtaskId,
    { title, isCompleted },
    { new: true, runValidators: true },
  ).populate("createdBy");

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  // Check task exists
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { taskId, subtaskId } = req.params;

  const subtask = await Subtask.findByIdAndDelete(subtaskId);

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  // Verify belongs to task
  if (
    subtask.task.toString() !== new mongoose.Types.ObjectId(taskId).toString()
  ) {
    throw new ApiError(400, "Subtask does not belong to this task");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subtask deleted successfully"));
});

export {
  getTasks,
  createTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateSubTask,
  deleteSubTask,
};
