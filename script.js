// 1. Initialize DOM Elements
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('image-preview');
const foodName = document.querySelector('#food-name span');
const calorieCount = document.querySelector('#calorie-count span');
const predictBtn = document.getElementById('predict-btn');
const dropArea = document.querySelector('.container');
const statusMessage = document.getElementById('status-message');

// 2. Updated: Database variable (Now empty, will be filled by JSON)
let calorieDatabase = {};

let model;

// 3. Updated: Load AI Model AND JSON Data
async function initializeApp() {
    console.log("Loading AI and Database...");
    try {
        // Load the TensorFlow MobileNet model
        model = await mobilenet.load();
        
        // Load the 200+ foods from your JSON file
        const response = await fetch('foodData.json');
        calorieDatabase = await response.json();
        
        console.log("Model and JSON Ready!");
    } catch (error) {
        console.error("Initialization Error:", error);
        // Fail-safe: A few items in case the JSON fails to load
        calorieDatabase = { "ramen": "436 kcal", "beef": "250 kcal" };
    }
}

// Start the initialization
initializeApp();

// --- DRAG AND DROP LOGIC ---

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'), false);
});

dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files[0]);
}, false);

imageUpload.addEventListener('change', (e) => {
    handleFiles(e.target.files[0]);
});

function handleFiles(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            
            foodName.innerText = "---";
            calorieCount.innerText = "---";
            statusMessage.classList.add('hidden'); 
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please provide a valid image file!");
    }
}

// --- PREDICTION LOGIC ---

predictBtn.addEventListener('click', async () => {
    if (!imagePreview.src || imagePreview.src.includes('#')) {
        alert("Please upload or drop a food image first!");
        return;
    }

    statusMessage.classList.remove('hidden'); 
    foodName.innerText = "Analyzing...";
    calorieCount.innerText = "Searching...";

    try {
        // Slight timeout to ensure UI updates scanning status
        await new Promise(resolve => setTimeout(resolve, 100)); 
        
        const predictions = await model.classify(imagePreview);
        
        // Process results
        let fullAiResult = predictions.map(p => p.className.toLowerCase()).join(' ');
        let topGuess = predictions[0].className.split(',')[0];
        
        foodName.innerText = topGuess;

        // --- UPDATED SEARCH LOGIC ---
        let found = false;

        // 1. Get the AI's guesses and make them lowercase
        let aiLabels = predictions.map(p => p.className.toLowerCase());
        let fullAiText = aiLabels.join(' '); // e.g. "pizza, pepperoni pizza, dish"

        for (let key in calorieDatabase) {
            let lowerKey = key.toLowerCase(); // Ensure our database key is lowercase
            
            // 2. The "Double Check":
            // Check if the AI text contains our key OR if our key is part of the AI text
            if (fullAiText.includes(lowerKey) || lowerKey.includes(aiLabels[0])) {
                calorieCount.innerText = calorieDatabase[key] + " (est. per 100g)";
                found = true;
                break; 
            }
        }
        if (!found) {
            calorieCount.innerText = "Food detected, but calories unknown.";
        }
    } catch (err) {
        console.error("Prediction error:", err);
        calorieCount.innerText = "Error during prediction.";
    }
});

// --- RESET LOGIC ---

function resetApp() {
    imageUpload.value = "";
    imagePreview.src = "#";
    imagePreview.style.display = 'none';
    foodName.innerText = "---";
    calorieCount.innerText = "---";
    statusMessage.classList.add('hidden');
}