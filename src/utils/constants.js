export const UserRolesEnum = {
    ADMIN: "admin",
    PROJECT_ADMIN: "Project_admin",
    MEMBER: "member"
}

export const AvailableUserRole = Object.values(UserRolesEnum)

export const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGESS: "in_progress",
    DONE: "done",
};

export const AvailableTasksStatus = Object.values(TaskStatusEnum);