🍎 Food AI: Calories Estimator
📝 Project Overview
This project is an AI-powered web application developed for the 2nd Term ICT Project (2025-2026) at Al Kamal American International School. It allows users to upload or drag-and-drop images of food to receive an immediate estimation of caloric content using real-time Computer Vision.

🚀 Features
AI Image Classification: Uses a Neural Network to identify food items.

Real-time Estimation: Instantly maps identified food to a caloric database.

Modern UI/UX: Includes drag-and-drop functionality and a responsive design.

Local Processing: Runs entirely in the browser for speed and privacy.

🛠️ Tools & Technologies Used
As required by the project guidelines, this application was built using:

JavaScript (ES6+): The primary programming language for logic and AI integration.

TensorFlow.js: The library used to run machine learning models in the browser.

MobileNet Model: A pre-trained Deep Learning model for high-accuracy image classification.

HTML5 & CSS3: For the structural layout and professional styling.

JSON: Used as a structured database for food caloric data.

🧠 How the AI Model Works
Consistent with the requirement to explain the AI model:

Input: The user provides an image via upload or drag-and-drop.

Processing: The MobileNet model (a Convolutional Neural Network) analyzes the image features—such as shapes, textures, and colors—to predict the contents.

Classification: The model generates a list of "labels" (guesses) with probability scores.

Data Mapping: The JavaScript logic performs a "Smart Search" across these labels to find a match in the foodData.json database.

Output: If a match is found, the application displays the food name and its estimated calories per 100g.

📂 File Structure
index.html - The core structure of the web application.

style.css - Custom styling for a professional "Innovation Team" look.

script.js - The "brain" of the app handling AI logic and file processing.

foodData.json - A database containing caloric information for over 200 food items.

