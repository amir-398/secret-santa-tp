const mongoose = require("mongoose");
const Membership = require("../models/membershipModel");
const Santa = require("../models/santaModel");

exports.assignRandomPairs = async (req, res) => {
  const groupId = req.params.group_id;

  try {
    const acceptedInvitations = await Membership.find({
      group_id: groupId,
      response: true,
    }).select("invited_user -_id");

    let users = acceptedInvitations.map((invite) => invite.invited_user);
    users = shuffleArray(users); // Fonction pour mélanger le tableau

    for (let i = 0; i < users.length; i += 2) {
      if (i + 1 < users.length) {
        const santaPair = new Santa({
          group_id: groupId,
          user_1: users[i],
          user_2: users[i + 1],
        });
        await santaPair.save();
      }
    }

    res.status(200).json({ message: "Paires assignées avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction auxiliaire pour mélanger un tableau
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// get signed user
exports.getAssignedPartner = async (req, res) => {
  const userId = req.params.user_id;

  try {
    // Trouver l'entrée Santa où l'utilisateur est soit user_1 soit user_2
    const santaPair = await Santa.findOne({
      $or: [{ user_1: userId }, { user_2: userId }],
    });

    if (!santaPair) {
      return res.status(404).json({ message: "Aucune paire trouvée" });
    }

    // Déterminer le partenaire assigné
    const assignedPartnerId =
      santaPair.user_1 === userId ? santaPair.user_2 : santaPair.user_1;

    res.status(200).json({ assignedPartnerId });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
