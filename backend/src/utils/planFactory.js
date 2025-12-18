const FLOWS = {
  email: [
    { agent: "content", description: "Write the email content" },
    { agent: "execution", description: "Prepare final output" }
  ],

  plan: [
    { agent: "knowledge", description: "Provide structured learning approach" },
    { agent: "content", description: "Create detailed plan" },
    { agent: "execution", description: "Generate final deliverable" }
  ],

  analysis: [
    { agent: "data", description: "Analyze input data" },
    { agent: "knowledge", description: "Add domain context" },
    { agent: "content", description: "Summarize insights" },
    { agent: "execution", description: "Generate final report" }
  ],

  code: [
    { agent: "content", description: "Generate code" },
    { agent: "execution", description: "Prepare final output" }
  ],

  general: [
    { agent: "content", description: "Generate response" },
    { agent: "execution", description: "Prepare final output" }
  ]
};

exports.createPlanFromType = (taskType) => {
  const plan = FLOWS[taskType];
  if (!plan) {
    throw new Error(`Unsupported task type: ${taskType}`);
  }
  return plan;
};
