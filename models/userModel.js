const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: Boolean,
    require: true,
  },
});

// Hook pour hacher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre("save", async function (next) {
  // Si le mot de passe n'a pas été modifié, passe à la suite
  if (!this.isModified("password")) return next();

  // Hacher le mot de passe
  try {
    const salt = await bcrypt.genSalt(10); // Générer un sel
    this.password = await bcrypt.hash(this.password, salt); // Hacher le mot de passe avec le sel
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model("User", userSchema);
