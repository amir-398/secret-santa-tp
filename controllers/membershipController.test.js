const httpMocks = require("node-mocks-http");
const sinon = require("sinon");
import {
  inviteUse,
  acceptInvite,
  refuseInvite,
  getAcceptedInvitations,
} from "./membershipController";
const Membership = require("../models/membershipModel");
const Group = require("../models/groupModel");

// inviteUser test
describe("inviteUser", () => {
  it("should invite a user and return 200 status", async () => {
    const req = httpMocks.createRequest({
      params: { group_id: "groupId123" },
      body: { invited_user: "userId123" },
      user: { id: "adminId" },
    });
    const res = httpMocks.createResponse();
    const findOneGroupStub = sinon
      .stub(Group, "findOne")
      .resolves({ admin_id: "adminId" });
    const findOneMembershipStub = sinon
      .stub(Membership, "findOne")
      .resolves(null);
    const saveStub = sinon.stub(Membership.prototype, "save").resolves();

    await inviteUser(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "Utilisateur invité avec succès"
    );
    findOneGroupStub.restore();
    findOneMembershipStub.restore();
    saveStub.restore();
  });
});

// acceptInvite test
describe("acceptInvite", () => {
  it("should accept an invitation", async () => {
    const req = httpMocks.createRequest({
      params: { group_id: "groupId123" },
      user: { id: "userId123" },
    });
    const res = httpMocks.createResponse();
    const findOneStub = sinon
      .stub(Membership, "findOne")
      .resolves({ response: null });
    const saveStub = sinon.stub(Membership.prototype, "save").resolves();

    await acceptInvite(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty("message", "Invitation acceptée");
    findOneStub.restore();
    saveStub.restore();
  });
});

// refuseInvite test

describe("refuseInvite", () => {
  let removeStub;
  beforeEach(() => {
    removeStub = sinon.stub(Membership, "remove").resolves();
  });
  afterEach(() => {
    removeStub.restore();
  });
  it("should delete the membership from database when refusing an invitation", async () => {
    const req = httpMocks.createRequest({
      params: { group_id: "groupId123" },
      user: { id: "userId123" },
    });
    const res = httpMocks.createResponse();
    const findOneStub = sinon
      .stub(Membership, "findOne")
      .resolves({ response: null });

    await refuseInvite(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty("message", "Invitation refusée");
    findOneStub.restore();
    expect(removeStub.calledOnce).toBe(true);
  });
  it("should return 409 status if the invitation has already been treated", async () => {
    const req = httpMocks.createRequest({
      params: { group_id: "groupId123" },
      user: { id: "userId123" },
    });
    const res = httpMocks.createResponse();
    const findOneStub = sinon
      .stub(Membership, "findOne")
      .resolves({ response: false });

    await refuseInvite(req, res);

    expect(res.statusCode).toBe(409);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "L'invitation a déjà été traitée"
    );
    findOneStub.restore();
    expect(removeStub.calledOnce).toBe(false);
  });
});

// getAcceptedInvitations test
describe("getAcceptedInvitations", () => {
  it("should return all accepted invitations", async () => {
    const req = httpMocks.createRequest({
      params: { group_id: "groupId123" },
    });
    const res = httpMocks.createResponse();
    const findStub = sinon
      .stub(Membership, "find")
      .resolves([{ invited_user: "userId123", response: true }]);

    await getAcceptedInvitations(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveLength(1);
    findStub.restore();
  });
});
