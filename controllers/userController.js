const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.userRegister = async (req, res) => {
  try {
    let newUser = new User(req.body);
    let user = await newUser.save();
    res.status(201).json({ message: `Utilisateur crée ${user.email}` });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Requête invalide !" });
  }
};

exports.userLogin = async (req, res) => {
  try {
    // On récupère l'utilisateur par email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // Il est souvent préférable de donner une réponse ambiguë pour des raisons de sécurité
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Comparer le mot de passe fourni avec le mot de passe haché stocké
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Création du payload pour JWT
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role ? "admin" : "user", // Assurez-vous que le rôle est correctement défini
    };

    // Générer un JWT
    const token = jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "10h", // Définir une durée de vie appropriée pour le token
    });

    // Envoi du token
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite lors du traitement" });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // L'identifiant de l'utilisateur à supprimer est récupéré de l'URL
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: `Utilisateur supprimé avec succès` });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite lors de la suppression" });
  }
};

// update user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // L'identifiant de l'utilisateur à mettre à jour
    const updateData = req.body; // Les données de mise à jour fournies dans le corps de la requête

    // Si le mot de passe est fourni, hachez-le avant de mettre à jour
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: `Utilisateur mis à jour`, user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Une erreur s'est produite lors de la mise à jour" });
  }
};
