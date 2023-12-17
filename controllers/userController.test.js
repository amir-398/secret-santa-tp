const {
  userRegister,
  userLogin,
  deleteUser,
  updateUser,
} = require("./userController");
const User = require("../models/userModel");
const httpMocks = require("node-mocks-http");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//user Register Test
describe("userRegister", () => {
  it("should create a new user and return 201 status", async () => {
    // Mock de la requête et de la réponse
    const req = httpMocks.createRequest({
      body: {
        email: "test@example.com",
        password: "password123",
      },
    });
    const res = httpMocks.createResponse();

    // Mock de la fonction 'save' du modèle User
    const saveStub = sinon
      .stub(User.prototype, "save")
      .resolves({ email: "test@example.com" });

    await userRegister(req, res);

    // Vérifications
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "Utilisateur crée test@example.com"
    );
    console.log(res._getJSONData());
    saveStub.restore();
  });
});

//User Login Test
describe("userLogin", () => {
  it("should log in the user and return a token", async () => {
    const req = httpMocks.createRequest({
      body: {
        email: "test@example.com",
        password: "password123",
      },
    });
    const res = httpMocks.createResponse();

    const user = { email: "test@example.com", password: "$2b$10$exampleHash" };
    sinon.stub(User, "findOne").resolves(user);
    sinon.stub(bcrypt, "compare").resolves(true);
    sinon.stub(jwt, "sign").returns("mockToken");

    await userLogin(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty("token", "mockToken");

    User.findOne.restore();
    bcrypt.compare.restore();
    jwt.sign.restore();
  });

  // Ajoutez d'autres tests pour couvrir les scénarios d'échec (utilisateur non trouvé, mot de passe incorrect, etc.)
});

// user delete user
describe("deleteUser", () => {
  it("should delete the user and return 200 status", async () => {
    const req = httpMocks.createRequest({
      params: {
        id: "userId123",
      },
    });
    const res = httpMocks.createResponse();

    sinon.stub(User, "findByIdAndDelete").resolves({ _id: "userId123" });

    await deleteUser(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "Utilisateur supprimé avec succès"
    );

    User.findByIdAndDelete.restore();
  });

  it("should return 404 if user not found", async () => {
    const req = httpMocks.createRequest({
      params: {
        id: "nonExistentUserId",
      },
    });
    const res = httpMocks.createResponse();

    sinon.stub(User, "findByIdAndDelete").resolves(null);

    await deleteUser(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "Utilisateur non trouvé"
    );

    User.findByIdAndDelete.restore();
  });

  // Vous pouvez ajouter d'autres tests pour couvrir d'autres scénarios, si nécessaire
});

// update User test

describe("updateUser", () => {
  it("should update the user and return 200 status", async () => {
    const req = httpMocks.createRequest({
      params: { id: "userId123" },
      body: { email: "updated@example.com" },
    });
    const res = httpMocks.createResponse();

    sinon
      .stub(User, "findByIdAndUpdate")
      .resolves({ _id: "userId123", email: "updated@example.com" });

    await updateUser(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "Utilisateur mis à jour"
    );

    User.findByIdAndUpdate.restore();
  });

  it("should return 404 if user not found", async () => {
    const req = httpMocks.createRequest({
      params: { id: "nonExistentUserId" },
      body: { email: "updated@example.com" },
    });
    const res = httpMocks.createResponse();

    sinon.stub(User, "findByIdAndUpdate").resolves(null);

    await updateUser(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "Utilisateur non trouvé"
    );

    User.findByIdAndUpdate.restore();
  });

  // Test pour la mise à jour du mot de passe
  it("should hash the password if provided", async () => {
    const req = httpMocks.createRequest({
      params: { id: "userId123" },
      body: { password: "newPassword" },
    });
    const res = httpMocks.createResponse();
    const hashStub = sinon.stub(bcrypt, "hash").resolves("hashedPassword");

    sinon.stub(User, "findByIdAndUpdate").resolves({
      _id: "userId123",
      password: "hashedPassword",
    });

    await updateUser(req, res);

    expect(hashStub.calledOnce).toBeTruthy();
    expect(res.statusCode).toBe(200);

    bcrypt.hash.restore();
    User.findByIdAndUpdate.restore();
  });
});
