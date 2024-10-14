// Import required modules
const express = require("express");
const mongoose = require("mongoose");

// Create an Express application
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Define the MongoDB connection string
const mongoURI = "mongodb://localhost:27017/myDatabase"; // Replace myDatabase with the desired database name

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Define a Mongoose Schema and Model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  description: { type: String, required: false },
});

const Product = mongoose.model("Product", productSchema);

// Define a schema that captures a wide variety of MongoDB types and features
const comprehensiveSchema = new mongoose.Schema(
  {
    // Basic data types
    name: {
      type: String,
      required: true, // Field is required
      trim: true, // Trims leading and trailing whitespace
      minlength: 3, // Minimum length
      maxlength: 50, // Maximum length
    },

    age: {
      type: Number,
      min: 0, // Minimum value
      max: 150, // Maximum value
    },

    // Boolean
    isActive: {
      type: Boolean,
      default: true, // Default value
    },

    // Date
    birthdate: {
      type: Date,
      default: Date.now, // Default to current date
    },

    // Array of Strings
    hobbies: {
      type: [String], // Array of strings
      default: [], // Default is an empty array
    },

    // Array of Mixed Types
    mixedArray: {
      type: Array, // Array that can contain any data types
      default: [],
    },

    // Object (Subdocument)
    address: {
      street: { type: String },
      city: { type: String },
      zipCode: { type: String },
    },

    // Nested Document (Subdocument)
    contact: {
      email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/, // Email validation with regex
      },
      phone: {
        type: String,
        minlength: 10,
        maxlength: 15,
      },
    },

    // Embedded array of objects (Subdocuments)
    orders: [
      {
        orderDate: { type: Date, default: Date.now },
        amount: { type: Number, min: 0 },
        items: [{ type: String }],
      },
    ],

    // Enum (Predefined set of values)
    userType: {
      type: String,
      enum: ["admin", "user", "guest"], // Only these values are allowed
      default: "user",
    },

    // Custom validation
    website: {
      type: String,
      validate: {
        validator: function (value) {
          return /^https?:\/\/[^\s]+$/.test(value); // Must be a valid URL
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },

    // Map of key-value pairs
    metadata: {
      type: Map,
      of: String, // Map values are of type String
      default: {}, // Default is an empty map
    },

    // GeoJSON (for location data)
    location: {
      type: {
        type: String,
        enum: ["Point"], // Must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // Array of numbers [longitude, latitude]
        required: true,
      },
    },

    // Mixed Type (can store any kind of data)
    additionalInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Timestamps: Automatically track creation and update times
  },
  { timestamps: true }
);

// Compile the schema into a model
const ComprehensiveModel = mongoose.model(
  "ComprehensiveModel",
  comprehensiveSchema
);

// Define a simple GET route
app.get("/", (req, res) => {
  res.send("Hello, MongoDB!");
});

// Create a new product (POST)
app.post("/products", async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

// Get all products (GET)
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Get a product by ID (GET)
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});

// Update a product by ID (PUT)
app.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// Delete a product by ID (DELETE)
app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
