// 1. Initialize DOM Elements
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('image-preview');
const foodName = document.querySelector('#food-name span');
const calorieCount = document.querySelector('#calorie-count span');
const predictBtn = document.getElementById('predict-btn');
const dropArea = document.querySelector('.container');
const statusMessage = document.getElementById('status-message');

// 2. Database variable (Starts empty, populated via JSON)
let calorieDatabase = {};
let model;

// 3. Load AI Model AND JSON Data
async function initializeApp() {
    console.log("Loading AI and Database...");
    try {
        // Load the TensorFlow MobileNet model
        model = await mobilenet.load();
        
        // Load the 200+ foods from your JSON file
        // IMPORTANT: Ensure foodData.json is in the same folder as index.html
        const response = await fetch('foodData.json');
        if (!response.ok) throw new Error("Could not load JSON file");
        
        const data = await response.json();
        // some JSON authors wrap the object in an array; we only need the first element
        if (Array.isArray(data) && data.length > 0) {
            calorieDatabase = data[0];
        } else {
            calorieDatabase = data;
        }
        
        console.log("AI Model and JSON Database Ready!");
    } catch (error) {
        console.error("Initialization Error:", error);
        // Fail-safe: Essential items if the JSON fails to load
        calorieDatabase = { "ramen": "436 kcal", "pizza": "266 kcal", "beef": "250 kcal" };
    }
}

// Execute initialization on page load
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
    handleFiles(e.dataTransfer.files[0]);
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
        await new Promise(resolve => setTimeout(resolve, 100)); 
        
        const predictions = await model.classify(imagePreview);
        
        // 1. Convert ALL AI guesses to one long lowercase string
        // This helps if "pizza" is the 2nd or 3rd guess instead of the 1st
        let allSeenLabels = predictions.map(p => p.className.toLowerCase()).join(' ');

        // 2. Determine the best display name (Skip 'plate' or 'dish' if possible)
        let topGuess = predictions[0].className.split(',')[0];
        if ((topGuess.toLowerCase().includes("plate") || topGuess.toLowerCase().includes("dish")) && predictions[1]) {
            topGuess = predictions[1].className.split(',')[0];
        }
        foodName.innerText = topGuess;

        // 3. SMART SEARCH MATCHING
        let found = false;
        for (let key in calorieDatabase) {
            let lowerKey = key.toLowerCase(); 
            
            // If our keyword (like 'pizza') is found anywhere in the AI's guesses
            if (allSeenLabels.includes(lowerKey)) {
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
        foodName.innerText = "Error!";
        calorieCount.innerText = "Check your internet/JSON file.";
    } finally {
        statusMessage.classList.add('hidden');
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