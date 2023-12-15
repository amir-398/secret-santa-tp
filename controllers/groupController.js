const Group = require("../models/groupModel"); // Votre modèle de groupe nommé 'User'

// create group
exports.createGroup = async (req, res) => {
  try {
    // Créer un nouveau groupe en utilisant l'ID de l'utilisateur extrait du token JWT
    const newGroup = new Group({
      name: req.body.name,
      admin_id: req.user.id, // L'ID de l'utilisateur est extrait de req.user, qui est défini par le middleware JWT
    });

    await newGroup.save();
    res
      .status(201)
      .json({ message: "Groupe créé avec succès", group: newGroup });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du groupe" });
  }
};

// delete group
exports.deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.group_id;
    console.log(groupId); // Récupérer l'ID du groupe de l'URL
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé" });
    }

    // Vérifier si l'utilisateur actuel est l'administrateur du groupe
    if (req.user.id.toString() !== group.admin_id.toString()) {
      return res
        .status(403)
        .json({ message: "Seul l'administrateur peut supprimer le groupe" });
    }

    // Suppression du groupe
    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: "Groupe supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// modify name group
exports.modifyNameGroup = async (req, res) => {
  try {
    const groupId = req.params.group_id;
    const newName = req.body.name;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Groupe non trouvé" });
    }

    // Vérifier si l'utilisateur actuel est l'administrateur du groupe
    if (req.user.id.toString() !== group.admin_id.toString()) {
      return res.status(403).json({
        message: "Seul l'administrateur peut modifier le nom du groupe",
      });
    }

    // Modification du nom du groupe
    await Group.findByIdAndUpdate(groupId, { name: newName });
    res.status(200).json({ message: "Nom du groupe modifié avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// get all groups
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({});
    res.status(200).json(groups);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des groupes" });
  }
};
