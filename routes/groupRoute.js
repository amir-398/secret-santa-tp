const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middlewares/jwtMiddleware.js");
const groupController = require("../controllers/groupController");
const membershipController = require("../controllers/membershipController.js");
router
  .route("/newGroup")
  .post(jwtMiddleware.verifyToken, groupController.createGroup);

router.route("/groups").get(groupController.getAllGroups);

router
  .route("/groups/:group_id")
  .get(membershipController.getAcceptedInvitations)
  .delete(jwtMiddleware.verifyToken, groupController.deleteGroup)
  .put(jwtMiddleware.verifyToken, groupController.modifyNameGroup);

router
  .route("/groups/:group_id/invitations")
  .post(jwtMiddleware.verifyToken, membershipController.inviteUser);

router
  .route("/groups/:group_id/accepted")
  .post(jwtMiddleware.verifyToken, membershipController.acceptInvite);

router
  .route("/groups/:group_id/refused")
  .post(jwtMiddleware.verifyToken, membershipController.refuseInvite);

module.exports = router;
