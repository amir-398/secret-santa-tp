const express = require("express");
const router = express.Router();
const santaController = require("../controllers/santaController");
const jwtMiddleware = require("../middlewares/jwtMiddleware.js");
/**
 * @openapi
 * /{group_id}/create-binomes:
 *   post:
 *     summary: Attribue des paires aléatoires de membres dans un groupe
 *     description: Sélectionne des paires de membres au hasard dans le groupe spécifié et les assigne pour l'échange de cadeaux.
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du groupe pour lequel les paires sont attribuées
 *     responses:
 *       200:
 *         description: Paires attribuées avec succès
 *       500:
 *         description: Erreur serveur
 */
router
  .route("/:group_id/create-binomes")
  .post(santaController.assignRandomPairs);

/**
 * @openapi
 * /{group_id}/my_binome:
 *   post:
 *     summary: Récupère le binôme assigné à l'utilisateur actuel
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
 *         description: Détails du binôme assigné
 *       401:
 *         description: Utilisateur non autorisé
 *       500:
 *         description: Erreur serveur
 */

router
  .route("/:group_id/my_binome")
  .post(jwtMiddleware.verifyToken, santaController.getAssignedPartner);

/**
 * @openapi
 * /{group_id}/allBinomes:
 *   get:
 *     summary: Récupère tous les binômes d'un groupe
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
 *         description: Liste de tous les binômes dans le groupe
 *       401:
 *         description: Utilisateur non autorisé
 *       500:
 *         description: Erreur serveur
 */

router
  .route("/:group_id/allBinomes")
  .get(jwtMiddleware.verifyToken, santaController.getAllBonimes);

module.exports = router;
