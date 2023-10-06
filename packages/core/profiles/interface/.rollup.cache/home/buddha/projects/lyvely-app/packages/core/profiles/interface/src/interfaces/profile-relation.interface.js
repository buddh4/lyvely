export var RoleVisibilityLevel;
(function (RoleVisibilityLevel) {
    RoleVisibilityLevel[RoleVisibilityLevel["Owner"] = 0] = "Owner";
    RoleVisibilityLevel[RoleVisibilityLevel["Admin"] = 1] = "Admin";
    RoleVisibilityLevel[RoleVisibilityLevel["Moderator"] = 2] = "Moderator";
    RoleVisibilityLevel[RoleVisibilityLevel["Member"] = 3] = "Member";
    RoleVisibilityLevel[RoleVisibilityLevel["Guest"] = 4] = "Guest";
    RoleVisibilityLevel[RoleVisibilityLevel["Organization"] = 5] = "Organization";
    RoleVisibilityLevel[RoleVisibilityLevel["User"] = 6] = "User";
    RoleVisibilityLevel[RoleVisibilityLevel["Visitor"] = 7] = "Visitor";
})(RoleVisibilityLevel || (RoleVisibilityLevel = {}));
