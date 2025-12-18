const VALID_FLOWS = {
  email: ["content", "execution"],
  plan: ["knowledge", "content", "execution"],
  analysis: ["data", "knowledge", "content", "execution"],
  code: ["content", "execution"],
  general: ["content", "execution"]
};

exports.validatePlan = (taskType, plan) => {
  const expected = VALID_FLOWS[taskType];
  const actual = plan.map(p => p.agent);

  if (!expected) {
    throw new Error(`Unknown task type: ${taskType}`);
  }

  if (expected.join() !== actual.join()) {
    throw new Error(
      `Invalid agent flow for "${taskType}". Expected ${expected}, got ${actual}`
    );
  }
};
