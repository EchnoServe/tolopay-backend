const user = require("./../../models/user");
const { signup } = require("./../authController");
const jwt = require("jsonwebtoken");

jest.mock("./../../models/user");
jest.mock("jsonwebtoken");

const request = (overrides) => {
  return {
    body: {
      name: "boob",
      email: "boob@gmail.com",
      password: "12341234",
      passwordConfirm: "12341234",
      phoneNumber: "12341234",
    },
    ...overrides,
  };
};

test("sign up", async () => {
  const req = request();
  const res = {
    json: jest.fn(() => res).mockName("json"),
    status: jest.fn(() => res).mockName("status"),
  };
  const next = jest.fn();
  user.create.mockResolvedValueOnce({
    _id: "123",
  });
  jwt.sign.mockResolvedValueOnce("xxxx");

  await signup(req, res, next);

  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(201);

  expect(res.json).toHaveBeenCalledWith({ status: "OK" });
});
