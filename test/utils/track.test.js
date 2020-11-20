const { expect } = require("chai");

const track = require("../../utils/track");

describe("Track", () => {
  describe("#clean", () => {
    it("should return the track if nothing", () => {
      const cleaned = track.clean("Crazy in love");
      expect(cleaned).to.equal("Crazy in love");
    });
    it("should return the track if nothing", () => {
      const cleaned = track.clean("Crazy in love (ft. Jay-Z)");
      expect(cleaned).to.equal("Crazy in love");
    });
    it("should return the track if nothing", () => {
      const cleaned = track.clean("Crazy in love - Radio Edit");
      expect(cleaned).to.equal("Crazy in love");
    });
    it("should return the track if nothing", () => {
      const cleaned = track.clean("Crazy in love Pt.3");
      expect(cleaned).to.equal("Crazy in love");
    });
  });
});
