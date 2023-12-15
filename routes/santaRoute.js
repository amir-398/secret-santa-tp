const express = require("express");
const router = express.Router();
const santaController = require("../controllers/santaController");
/**
 * @openapi
 * /{group_id}:
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
router.route("/:group_id").post(santaController.assignRandomPairs);

router.route("groups/:user_id").post(santaController.getAssignedPartner);
module.exports = router;
