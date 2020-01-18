import AccessControl from "accesscontrol";
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("user")
    .readOwn("profile")
    .updateOwn("profile");

  ac.grant("district-supervisor")
    .extend("user")
    .readAny("profile");

  ac.grant("admin")
    .extend("user")
    .extend("district-supervisor")
    .updateAny("profile")
    .deleteAny("profile");

  return ac;
})();
