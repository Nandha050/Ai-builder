const { runTaskAgent } = require('../services/agent/taskAgent.service');

// @desc    Run AI on a task
// @route   POST /api/agent/run
// @access  Private
exports.runAgent = async (req, res) => {
    const { taskPrompt } = req.body;

    try {
        const result = await runTaskAgent(taskPrompt);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
