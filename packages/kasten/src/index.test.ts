import { greet } from "./index";

describe("greet", () => {
  it("should return the correct greeting message", () => {
    expect(greet()).toBe("Hello from Kasten!");
  });
});
