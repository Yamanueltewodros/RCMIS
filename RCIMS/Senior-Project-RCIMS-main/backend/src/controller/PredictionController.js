const { spawn } = require("child_process");
const path = require("path");

const Prediction = require("../models/Prediction");

class PredictionController {
    static async getPrediction(req, res) {
        try {
            const inputData = req.body;
            const patientId = req.params.patientId;

            // Spawn a Python process
            const pythonProcess = spawn("python", [
                path.join(__dirname, "../riskPrediction.py"),
                JSON.stringify(inputData),
            ]);

            let result = "";

            // Collect data from script
            pythonProcess.stdout.on("data", (data) => {
                result += data.toString();
            });

            // Handle errors
            pythonProcess.stderr.on("data", (data) => {
                console.error(`Error from Python script: ${data}`);
            });

            // Send the result when the Python script closes
            pythonProcess.on("close", async (code) => {
                if (code !== 0) {
                    return res
                        .status(500)
                        .json({ error: "Python script exited with error" });
                }
                try {
                    // Trim whitespace from the result
                    result = result.trim();
                    const predictions = JSON.parse(result);

                    // Save inputData and predictions to the database
                    const newPrediction = await Prediction.create({
                        patientId,
                        age: inputData.Age,
                        gender: inputData.Gender,
                        typeOfTreatmentReceived:
                            inputData["Type of Treatment Received"],
                        numberOfRelapses: inputData["Number of Relapses"],
                        timeSinceLastRelapse:
                            inputData["Time since last relapse"],
                        mentalHealthCondition:
                            inputData["Mental Health Condition"],
                        supportSystem: inputData["Support System"],
                        housingStatus: inputData["Housing Status"],
                        employmentStatus: inputData["Employment Status"],
                        substanceUseFrequency:
                            inputData["Substance Use Frequency"],
                        durationOfSubstanceUse:
                            inputData["Duration of Substance Use"],
                        primarySubstance: inputData["Primary Substance"],
                        secondarySubstance: inputData["Secondary Substance"],
                        familyAddictionHistory:
                            inputData["Family Addiction History"],
                        severityOfAddiction: inputData["Severity of Addiction"],
                        asicategory: inputData.partial_leak_feature, // Assuming this maps to asicategory
                        relapseRisk: predictions.predictions[0],
                    });
                    const savedPrediction = await newPrediction.save();

                    res.json({ predictions: predictions.predictions[0] });
                } catch (error) {
                    console.error("Failed to parse prediction results:", error);
                    res.status(500).json({
                        error: "Failed to parse prediction results",
                    });
                }
            });
        } catch (error) {
            console.error("Error in getPrediction:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // end point to get the latest prediction for a patient
    static async getLatestPrediction(req, res) {
        const patientId = req.params.patientId;
        const latestPrediction = await Prediction.findOne({ patientId }).sort({
            createdAt: -1,
        });
        res.json(latestPrediction);
    }
}

module.exports = PredictionController;
