const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const jwtMiddleware = require("../middlewares/jwtMiddleware.js");

// register user-------------------------------------------

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     description: Crée un nouveau compte utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: "amir.398@hotmail.fr"
 *               password:
 *                 type: string
 *                 default: "12345"
 *               role:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de requête
 *     tags:
 *      - Users
 */

router.route("/register").post(userController.userRegister);

// login user ------------------------------

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Authentifie un utilisateur
 *     description: Permet à un utilisateur de se connecter avec son email et son mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: "amir.398@hotmail.fr"
 *               password:
 *                 type: string
 *                 default: "12345"
 *     responses:
 *       200:
 *         description: Connexion réussie, renvoie un token
 *       401:
 *         description: Authentification échouée
 *     tags:
 *      - Users
 */

router.route("/login").post(userController.userLogin);

// delete user

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     description: Supprime un utilisateur spécifié par son ID. Nécessite un token JWT pour l'authentification.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 *     tags:
 *      - Users
 */

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     description: Met à jour les informations d'un utilisateur spécifié par son ID. Nécessite un token JWT pour l'authentification.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: boolean
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Données invalides fournies
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 *     tags:
 *      - Users
 */

router
  .route("/:id")
  .delete(jwtMiddleware.verifyToken, userController.deleteUser)
  .put(jwtMiddleware.verifyToken, userController.updateUser);

module.exports = router;
