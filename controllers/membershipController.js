const jwt = require("jsonwebtoken");
require("dotenv").config();

const Membership = require("../models/membershipModel");
const Group = require("../models/groupModel");

// invite User in group
exports.inviteUser = async (req, res) => {
  const groupId = req.params.group_id;
  const invitedUserId = req.body.invited_user;
  try {
    const group = await Group.findOne({
      _id: groupId,
      admin_id: req.user.id,
    });

    if (!group) {
      return res.status(403).json({
        message: "Seul l'administrateur peut inviter des utilisateurs",
      });
    }

    // Vérifier si l'utilisateur a déjà été invité
    const existingInvitation = await Membership.findOne({
      group_id: groupId,
      invited_user: invitedUserId,
    });
    if (existingInvitation) {
      return res.status(409).json({
        message: "L'utilisateur a déjà été invité à ce groupe",
      });
    }
    const newInvitation = new Membership({
      group_id: groupId,
      invited_user: invitedUserId,
      admin_id: req.user.id,
    });
    // await newInvitation.save();
    // Création du payload pour le token d'invitation
    const invitationPayload = {
      group_id: groupId,
      invited_user: invitedUserId,
    };
    // Générer un JWT pour l'invitation
    const invitationToken = jwt.sign(invitationPayload, process.env.JWT_KEY, {
      expiresIn: "48h",
    });
    await newInvitation.save();
    res.status(200).json({
      message: "Utilisateur invité avec succès",
      invitation: newInvitation,
      token: invitationToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// accept invitation
exports.acceptInvite = async (req, res) => {
  const groupId = req.params.group_id;
  const userId = req.user.id;

  try {
    const invitation = await Membership.findOne({
      group_id: groupId,
      invited_user: userId,
    });
    if (!invitation) {
      return res.status(404).json({ message: "Invitation non trouvée" });
    }

    // Accepter l'invitation seulement si response n'est pas déjà défini
    if (invitation.response === null) {
      invitation.response = true;
      await invitation.save();
      res.status(200).json({ message: "Invitation acceptée", invitation });
    } else {
      res.status(409).json({ message: "L'invitation a déjà été traitée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// refuse invitation
exports.refuseInvite = async (req, res) => {
  const groupId = req.params.group_id;
  const userId = req.user.id;

  try {
    const invitation = await Membership.findOne({
      group_id: groupId,
      invited_user: userId,
    });
    if (!invitation) {
      return res.status(404).json({ message: "Invitation non trouvée" });
    }

    // Refuser l'invitation seulement si response n'est pas déjà défini
    if (invitation.response === null) {
      invitation.response = false;
      await invitation.save();
      res.status(200).json({ message: "Invitation refusée", invitation });
    } else {
      res.status(409).json({ message: "L'invitation a déjà été traitée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//recuperer toutes les invitations acceptés
exports.getAcceptedInvitations = async (req, res) => {
  const groupId = req.params.group_id;
  try {
    const acceptedInvitations = await Membership.find({
      group_id: groupId,
      response: true,
    });
    console.log(acceptedInvitations);
    res.status(200).json(acceptedInvitations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des invitations" });
  }
};
