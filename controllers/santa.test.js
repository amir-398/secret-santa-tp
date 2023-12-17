const httpMocks = require("node-mocks-http");
const sinon = require("sinon");
const {
  assignRandomPairs,
  getAssignedPartner,
  getAllBonimes,
} = require("../controllers/santaController");
const Membership = require("../models/membershipModel");
const Santa = require("../models/santaModel");
const Group = require("../models/groupModel");

// assignRandomPairs test
describe("assignRandomPairs", () => {
  it("should assign random pairs and return 200 status", async () => {
    const req = httpMocks.createRequest({
      params: { group_id: "groupId123" },
    });
    const res = httpMocks.createResponse();
    const findStub = sinon
      .stub(Membership, "find")
      .resolves([{ invited_user: "user1" }, { invited_user: "user2" }]);
    const saveStub = sinon.stub(Santa.prototype, "save").resolves();

    await assignRandomPairs(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "Paires assignées avec succès"
    );
    findStub.restore();
    saveStub.restore();
  });
});

// getAssignedPartner test
describe("getAssignedPartner", () => {
  it("should return assigned partner for the user", async () => {
    const req = httpMocks.createRequest({
      params: { group_id: "groupId123" },
      user: { id: "userId123" },
    });
    const res = httpMocks.createResponse();
    const findOneStub = sinon
      .stub(Santa, "findOne")
      .resolves({ user_1: "userId123", user_2: "partnerId" });

    await getAssignedPartner(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty("assignedPartnerId", "partnerId");
    findOneStub.restore();
  });
});

// getAllBonimes test
describe("getAllBonimes", () => {
  it("should return all bonimes if user is admin", async () => {
    const req = httpMocks.createRequest({
      params: { group_id: "groupId123" },
      user: { id: "adminId" },
    });
    const res = httpMocks.createResponse();
    const findByIdStub = sinon
      .stub(Group, "findById")
      .resolves({ admin_id: "adminId" });
    const findStub = sinon
      .stub(Santa, "find")
      .resolves([{ user_1: "user1", user_2: "user2" }]);

    await getAllBonimes(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([{ user_1: "user1", user_2: "user2" }]);
    findByIdStub.restore();
    findStub.restore();
  });

  it("should return 403 if user is not admin", async () => {
    const req = httpMocks.createRequest({
      params: { group_id: "groupId123" },
      user: { id: "nonAdminId" },
    });
    const res = httpMocks.createResponse();
    const findByIdStub = sinon
      .stub(Group, "findById")
      .resolves({ admin_id: "adminId" });

    await getAllBonimes(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toHaveProperty("message", "Accès non autorisé");
    findByIdStub.restore();
  });
});
