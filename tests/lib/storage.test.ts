// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { saveAnswers, loadAnswers, clearAnswers } from "@/lib/storage";
import type { QuizAnswers } from "@/lib/supplements";

const answers: QuizAnswers = {
  goals: ["focus"],
  activity: "moderate",
  diet: "omnivore",
  sun: "medium",
  sleepQuality: "good",
  ageGroup: "30to50",
};

describe("quiz storage", () => {
  beforeEach(() => sessionStorage.clear());

  it("roundtrips saved answers", () => {
    saveAnswers(answers);
    expect(loadAnswers()).toEqual(answers);
  });

  it("returns null when nothing saved", () => {
    expect(loadAnswers()).toBeNull();
  });

  it("returns null on corrupted JSON", () => {
    sessionStorage.setItem("stackitup:answers", "{not json");
    expect(loadAnswers()).toBeNull();
  });

  it("clears answers", () => {
    saveAnswers(answers);
    clearAnswers();
    expect(loadAnswers()).toBeNull();
  });
});
