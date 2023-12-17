const {
  createGroup,
  deleteGroup,
  modifyNameGroup,
  getAllGroups,
} = require("./groupController");
const Group = require("../models/groupModel");
const httpMocks = require("node-mocks-http");
const sinon = require("sinon");

//create a group test
describe("Group Controller - createGroup", () => {
  it("should create a group and return 201 status", async () => {
    const req = httpMocks.createRequest({
      body: { name: "Test Group" },
      user: { id: "adminUserId" },
    });
    const res = httpMocks.createResponse();
    const saveStub = sinon
      .stub(Group.prototype, "save")
      .resolves({ _id: "newGroupId", name: "Test Group" });

    await createGroup(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "Groupe créé avec succès"
    );
    saveStub.restore();
  });
});

//delete a group test
describe("Group Controller - deleteGroup", () => {
  it("should delete a group and return 200 status", async () => {
    const req = httpMocks.createRequest({
      params: { group_id: "existingGroupId" },
      user: { id: "adminUserId" },
    });
    const res = httpMocks.createResponse();
    const findByIdStub = sinon
      .stub(Group, "findById")
      .resolves({ _id: "existingGroupId", admin_id: "adminUserId" });
    const findByIdAndDeleteStub = sinon
      .stub(Group, "findByIdAndDelete")
      .resolves(null);

    await deleteGroup(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "Groupe supprimé avec succès"
    );
    findByIdStub.restore();
    findByIdAndDeleteStub.restore();
  });
});

// modify group name test
describe("Group Controller - modifyNameGroup", () => {
  it("should modify the group name and return 200 status", async () => {
    const req = httpMocks.createRequest({
      params: { group_id: "existingGroupId" },
      body: { name: "Updated Name" },
      user: { id: "adminUserId" },
    });
    const res = httpMocks.createResponse();
    const findByIdStub = sinon
      .stub(Group, "findById")
      .resolves({ _id: "existingGroupId", admin_id: "adminUserId" });
    const findByIdAndUpdateStub = sinon
      .stub(Group, "findByIdAndUpdate")
      .resolves({ _id: "existingGroupId", name: "Updated Name" });

    await modifyNameGroup(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "Nom du groupe modifié avec succès"
    );
    findByIdStub.restore();
    findByIdAndUpdateStub.restore();
  });
});

// get all groups test
describe("Group Controller - getAllGroups", () => {
  it("should return all groups", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const findStub = sinon.stub(Group, "find").resolves([
      { _id: "groupId1", name: "Test Group 1" },
      { _id: "groupId2", name: "Test Group 2" },
    ]);

    await getAllGroups(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveLength(2);
    findStub.restore();
  });

  // Ajoutez d'autres tests pour les cas d'erreur, par exemple une erreur de serveur
});
