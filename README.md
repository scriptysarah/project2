# 🍎 Food AI: Calories Estimator

This project is an AI-powered web application developed to detect calories from food. It allows users to upload or drag-and-drop images of food to receive an immediate estimation of caloric content using real-time Computer Vision.

##  Features

* **AI Image Classification:** Uses a Neural Network to identify food items.

* **Real-time Estimation:** Instantly maps identified food to a caloric database.

* **Modern UI/UX:** Includes drag-and-drop functionality and a responsive design.

* **Local Processing:** Runs entirely in the browser for speed and privacy.


## Tools/ Languages used

**JavaScript (ES6+):** The primary programming language for logic and AI integration.

**TensorFlow.js:** The library used to run machine learning models in the browser.

**MobileNet Model:** A pre-trained Deep Learning model for high-accuracy image classification.

**HTML5 & CSS3:** For the structural layout and professional styling.

**JSON:** Used as a structured database for food caloric data.


## How the Model Works

1. **Input:** The user provides an image via upload or drag-and-drop.

2. **Processing:** The MobileNet model (a Convolutional Neural Network) analyzes the image features(such as shapes, textures, and colors)to predict the contents.

3. **Classification:** The model generates a list of "labels" (guesses) with probability scores.

4. **Data Mapping:** The JavaScript logic performs a "Smart Search" across these labels to find a match in the foodData.json database.

5. **Output:** If a match is found, the application displays the food name and its estimated calories per 100g.

