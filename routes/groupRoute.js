const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middlewares/jwtMiddleware.js");
const groupController = require("../controllers/groupController");
const membershipController = require("../controllers/membershipController.js");

/**
 * @openapi
 * /newGroup:
 *   post:
 *     summary: Crée un nouveau groupe
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Groupe créé
 */
router
  .route("/newGroup")
  .post(jwtMiddleware.verifyToken, groupController.createGroup);

/**
 * @openapi
 * /allGroups:
 *   get:
 *     summary: Liste tous les groupes
 *     responses:
 *       200:
 *         description: Liste des groupes
 */
router.route("/allGroups").get(groupController.getAllGroups);

/**
 * @openapi
 * /groups/{group_id}:
 *   get:
 *     summary: Liste les invitations acceptées pour un groupe spécifique
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invitations acceptées
 *   delete:
 *     summary: Supprime un groupe spécifique
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Groupe supprimé
 *   put:
 *     summary: Modifie le nom d'un groupe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nom du groupe modifié
 */
router
  .route("/:group_id")
  .get(membershipController.getAcceptedInvitations)
  .delete(jwtMiddleware.verifyToken, groupController.deleteGroup)
  .put(jwtMiddleware.verifyToken, groupController.modifyNameGroup);

/**
 * @openapi
 * /{group_id}/invitations:
 *   post:
 *     summary: Invite un utilisateur à rejoindre un groupe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invited_user:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur invité
 */
router
  .route("/:group_id/invitations")
  .post(jwtMiddleware.verifyToken, membershipController.inviteUser);

/**
 * @openapi
 * /{group_id}/accepted:
 *   post:
 *     summary: Accepte une invitation à rejoindre un groupe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invitation acceptée
 */
router
  .route("/:group_id/accepted")
  .post(jwtMiddleware.verifyToken, membershipController.acceptInvite);

/**
 * @openapi
 * /{group_id}/refused:
 *   post:
 *     summary: Refuse une invitation à rejoindre un groupe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invitation refusée
 */
router
  .route("/:group_id/refused")
  .post(jwtMiddleware.verifyToken, membershipController.refuseInvite);

module.exports = router;
