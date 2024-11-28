const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  typeOfTreatmentReceived: { type: String, required: true },
  numberOfRelapses: { type: String, required: true },
  timeSinceLastRelapse: { type: String, required: true },
  mentalHealthCondition: { type: String, required: true },
  supportSystem: { type: String, required: true },
  housingStatus: { type: String, required: true },
  employmentStatus: { type: String, required: true },
  substanceUseFrequency: { type: String, required: true },
  durationOfSubstanceUse: { type: String, required: true },
  primarySubstance: { type: String, required: true },
  secondarySubstance: { type: String, required: true },
  familyAddictionHistory: { type: String, required: true },
  severityOfAddiction: { type: String, required: true },
  asicategory: { type: String, required: true },
  relapseRisk: { type: Number, required: true },
});

module.exports = mongoose.model("Prediction", predictionSchema);
