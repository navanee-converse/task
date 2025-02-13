"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["hr"] = "hr";
    Role["developer"] = "developer";
    Role["designer"] = "designer";
    Role["engineer"] = "engineer";
})(Role || (exports.Role = Role = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["notViewed"] = "NotViewed";
    UserStatus["inProgress"] = "WaitingList";
    UserStatus["shortListed"] = "ShortListed";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
