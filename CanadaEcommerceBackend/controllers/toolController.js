const toolDbService = require("../services/toolDbService");

const getTools = async (req, res) => {
  try {
    const fetched_results = await toolDbService.getTools();
    res.status(201).json(fetched_results);
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when fetching the tools!",
      error: err.message,
    });
  }
};

const editTool = async (req, res) => {
  try {
    const { idTools } = req.params;
    const { Currency } = req.body;
    await toolDbService.editTool(idTools, Currency);
    res.status(201).json({ message: "Updatuion completed!" });
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when updating the tools!",
      error: err.message,
    });
  }
};

const addTool = async (req, res) => {
  try {
    const { Currency } = req.body;
    const add_result = await toolDbService.addTool(Currency);
    res.status(201).json({ message: "Tool adding completed!" });
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when adding the tools!",
      error: err.message,
    });
  }
};
module.exports = {
  getTools,
  editTool,
  addTool,
};
