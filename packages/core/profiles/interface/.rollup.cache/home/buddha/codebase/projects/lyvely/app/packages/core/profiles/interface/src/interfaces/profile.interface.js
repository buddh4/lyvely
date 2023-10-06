export var ProfileType;
(function (ProfileType) {
    ProfileType["User"] = "UserProfile";
    ProfileType["Group"] = "GroupProfile";
    ProfileType["Organization"] = "Organization";
})(ProfileType || (ProfileType = {}));
export var ProfileVisibilityLevel;
(function (ProfileVisibilityLevel) {
    ProfileVisibilityLevel[ProfileVisibilityLevel["Member"] = 0] = "Member";
    ProfileVisibilityLevel[ProfileVisibilityLevel["Organization"] = 1] = "Organization";
    ProfileVisibilityLevel[ProfileVisibilityLevel["User"] = 2] = "User";
    ProfileVisibilityLevel[ProfileVisibilityLevel["Visitor"] = 3] = "Visitor";
})(ProfileVisibilityLevel || (ProfileVisibilityLevel = {}));
