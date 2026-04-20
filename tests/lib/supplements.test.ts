import { describe, it, expect } from "vitest";
import {
  buildStack,
  groupByTiming,
  youtubeEmbedId,
  type QuizAnswers,
  type Supplement,
} from "@/lib/supplements";

function supp(id: string, tag: Supplement["tag"] = "core", timing: Supplement["timing"] = "morning"): Supplement {
  return { id, name: id, dose: "1", timing, why: "", tag };
}

const LIBRARY: Record<string, Supplement> = Object.fromEntries(
  [
    ["multi", "core"],
    ["omega3", "core"],
    ["vitd", "core"],
    ["mag", "goal"],
    ["glycine", "goal"],
    ["mel", "goal"],
    ["caff-lth", "goal"],
    ["lions", "goal"],
    ["coq10", "goal"],
    ["creatine", "goal"],
    ["whey", "goal"],
    ["citrulline", "goal"],
    ["ash", "goal"],
    ["ltheanine", "goal"],
    ["zinc", "goal"],
    ["vitc", "goal"],
    ["col", "goal"],
    ["gluco", "goal"],
    ["prob", "goal"],
    ["fiber", "goal"],
    ["b12", "lifestyle"],
    ["iron", "lifestyle"],
    ["b", "lifestyle"],
    ["elec", "lifestyle"],
  ].map(([id, tag]) => [id, supp(id, tag as Supplement["tag"])]),
);

const baseline: QuizAnswers = {
  goals: [],
  activity: "light",
  diet: "omnivore",
  sun: "medium",
  sleepQuality: "good",
  ageGroup: "30to50",
};

describe("buildStack", () => {
  it("always includes multi and omega3", () => {
    const stack = buildStack(baseline, LIBRARY).map((s) => s.id);
    expect(stack).toContain("multi");
    expect(stack).toContain("omega3");
  });

  it("adds vitD unless sun is high", () => {
    expect(buildStack(baseline, LIBRARY).map((s) => s.id)).toContain("vitd");
    expect(
      buildStack({ ...baseline, sun: "high" }, LIBRARY).map((s) => s.id),
    ).not.toContain("vitd");
  });

  it("poor sleep adds magnesium, glycine, melatonin", () => {
    const ids = buildStack({ ...baseline, sleepQuality: "poor" }, LIBRARY).map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["mag", "glycine", "mel"]));
  });

  it("sleep goal without poor sleep skips melatonin", () => {
    const ids = buildStack({ ...baseline, goals: ["sleep"] }, LIBRARY).map((s) => s.id);
    expect(ids).toContain("mag");
    expect(ids).not.toContain("mel");
  });

  it("focus goal adds caffeine+theanine and lions mane", () => {
    const ids = buildStack({ ...baseline, goals: ["focus"] }, LIBRARY).map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["caff-lth", "lions"]));
  });

  it("energy without focus adds caff-lth; energy over-30 adds coq10", () => {
    const under30 = buildStack({ ...baseline, goals: ["energy"], ageGroup: "under30" }, LIBRARY).map((s) => s.id);
    expect(under30).toContain("caff-lth");
    expect(under30).not.toContain("coq10");

    const over50 = buildStack({ ...baseline, goals: ["energy"], ageGroup: "over50" }, LIBRARY).map((s) => s.id);
    expect(over50).toContain("coq10");
  });

  it("muscle or heavy activity adds creatine/whey/citrulline and elec", () => {
    const ids = buildStack({ ...baseline, goals: ["muscle"], activity: "heavy" }, LIBRARY).map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["creatine", "whey", "citrulline", "elec"]));
  });

  it("vegan diet adds b12, iron, b-complex", () => {
    const ids = buildStack({ ...baseline, diet: "vegan" }, LIBRARY).map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["b12", "iron", "b"]));
  });

  it("keto diet adds electrolytes and fiber", () => {
    const ids = buildStack({ ...baseline, diet: "keto" }, LIBRARY).map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["elec", "fiber"]));
  });

  it("over50 triggers joint supplements", () => {
    const ids = buildStack({ ...baseline, ageGroup: "over50" }, LIBRARY).map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["col", "gluco"]));
  });

  it("sorts core then goal then lifestyle", () => {
    const stack = buildStack({ ...baseline, diet: "vegan", goals: ["muscle"] }, LIBRARY);
    const tags = stack.map((s) => s.tag);
    const first = tags.indexOf("core");
    const lastGoal = tags.lastIndexOf("goal");
    const firstLifestyle = tags.indexOf("lifestyle");
    expect(first).toBeLessThan(lastGoal);
    expect(lastGoal).toBeLessThan(firstLifestyle);
  });

  it("does not duplicate when same id added by multiple rules", () => {
    const ids = buildStack(
      { ...baseline, goals: ["sleep", "stress"] },
      LIBRARY,
    ).map((s) => s.id);
    expect(ids.filter((id) => id === "mag")).toHaveLength(1);
  });

  it("ignores unknown ids missing from library", () => {
    const ids = buildStack({ ...baseline, goals: ["gut"] }, { multi: LIBRARY.multi }).map(
      (s) => s.id,
    );
    expect(ids).toEqual(["multi"]);
  });
});

describe("groupByTiming", () => {
  it("buckets by timing", () => {
    const g = groupByTiming([
      supp("a", "core", "morning"),
      supp("b", "core", "evening"),
      supp("c", "goal", "morning"),
      supp("d", "lifestyle", "anytime"),
    ]);
    expect(g.morning.map((s) => s.id)).toEqual(["a", "c"]);
    expect(g.evening.map((s) => s.id)).toEqual(["b"]);
    expect(g.anytime.map((s) => s.id)).toEqual(["d"]);
    expect(g.afternoon).toEqual([]);
  });
});

describe("youtubeEmbedId", () => {
  it("parses youtu.be short links", () => {
    expect(youtubeEmbedId("https://youtu.be/abc123")).toBe("abc123");
  });
  it("parses watch?v= URLs", () => {
    expect(youtubeEmbedId("https://www.youtube.com/watch?v=xyz789&t=10s")).toBe("xyz789");
  });
  it("parses /embed/ and /shorts/ URLs", () => {
    expect(youtubeEmbedId("https://youtube.com/embed/AAA")).toBe("AAA");
    expect(youtubeEmbedId("https://youtube.com/shorts/BBB")).toBe("BBB");
  });
  it("returns null for garbage", () => {
    expect(youtubeEmbedId("not a url")).toBeNull();
    expect(youtubeEmbedId(null)).toBeNull();
    expect(youtubeEmbedId(undefined)).toBeNull();
    expect(youtubeEmbedId("https://vimeo.com/123")).toBeNull();
  });
});
