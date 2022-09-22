const { transfer } = require("./../transactionController");
const user = require("./../../models/user");
const bcrypt = require("bcryptjs");

jest.mock("./../../models/user");
jest.mock("bcryptjs");

const request = (overrides) => {
  return {
    user: {},
    body: {
      receiver_user_email: "name@gmail.com",
      amount: "1000",
      password: "12341234",
      remark: "for food",
    },
    ...overrides,
  };
};

beforeEach(() => {
  jest.clearAllMocks();
});

test("should return please enter the fields ", () => {
  const req = request({ body: {} });

  const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
  const next = jest.fn();
  const error = new Error("Please enter the fields in your form correctly");
  transfer(req, res, next);
  expect(next).toHaveBeenCalledWith(error);
  expect(next).toHaveBeenCalledTimes(1);
  expect(res.json).not.toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
});

test("should receiver_user_email", async () => {
  const req = request();
  const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
  const next = jest.fn();
  const error = new Error("Please enter correct email ");
  user.findOne.mockResolvedValueOnce(null);

  await transfer(req, res, next);

  expect(next).toHaveBeenCalledWith(error);
  expect(next).toHaveBeenCalledTimes(1);
  expect(res.json).not.toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
});

test("your balance is not enough", async () => {
  const req = request({ user: { balance: 0 } });
  const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
  const next = jest.fn();
  const error = new Error("your balance is not enough");
  user.findOne.mockResolvedValueOnce({});

  await transfer(req, res, next);

  expect(next).toHaveBeenCalledWith(error);
  expect(next).toHaveBeenCalledTimes(1);
  expect(res.json).not.toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
});

test("Incorrect password", async () => {
  const req = request({ user: { balance: 1200 } });
  const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
  const next = jest.fn();
  const error = new Error("Incorrect password");
  user.findOne.mockResolvedValueOnce({});
  bcrypt.compare.mockResolvedValueOnce(false);

  await transfer(req, res, next);

  expect(next).toHaveBeenCalledWith(error);
  expect(next).toHaveBeenCalledTimes(1);
  expect(res.json).not.toHaveBeenCalled();
  expect(res.status).not.toHaveBeenCalled();
});
