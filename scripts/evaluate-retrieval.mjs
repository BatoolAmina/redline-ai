import { readFile } from "node:fs/promises";

const file = process.argv[2] || "benchmarks/retrieval.json";
const configuredThreshold = Number(process.argv[3]);
const threshold = Number.isFinite(configuredThreshold) && configuredThreshold >= 0 && configuredThreshold <= 1
  ? configuredThreshold
  : 0.18;
const benchmark = JSON.parse(await readFile(file, "utf8"));
const labeled = benchmark.cases.filter((testCase) => typeof testCase.answerable === "boolean");

if (!labeled.length) {
  console.error("No human-reviewed cases are labeled yet.");
  process.exitCode = 2;
} else {
  console.log(`Loaded ${labeled.length} labeled cases at threshold ${threshold}.`);
  console.log("Calibration requires recorded top similarity scores for each case.");
}
