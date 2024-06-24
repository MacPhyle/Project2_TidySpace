const { default: mongoose } = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: String,
  purchasePrice: Number,
  itemNotes: String,
  broken: Boolean,
  wrongSize: Boolean,
  yearLastUsed: Number,
  tags: [String],
});

module.exports = mongoose.model("Items", itemSchema);
