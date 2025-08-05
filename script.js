// Get DOM elements
const powerInput = document.getElementById('power');
const durationInput = document.getElementById('duration');
const calculateBtn = document.getElementById('calculate');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const batteryCapacitySpan = document.getElementById('battery-capacity');
const recommendationsDiv = document.getElementById('recommendations');
const productListDiv = document.getElementById('product-list');

// Calculate battery capacity function
function calculateBatteryCapacity() {
    // Hide previous results and error messages
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    recommendationsDiv.classList.add('hidden');
    
    // Get input values
    const power = parseFloat(powerInput.value);
    const duration = parseFloat(durationInput.value);
    
    // Validate inputs
    if (powerInput.value === '') {
        showError('Please enter power load');
        return;
    }
    
    if (durationInput.value === '') {
        showError('Please enter duration');
        return;
    }
    
    if (isNaN(power)) {
        showError('Please enter a valid number for power load');
        return;
    }
    
    if (isNaN(duration)) {
        showError('Please enter a valid number for duration');
        return;
    }
    
    if (power <= 0) {
        showError('Power load must be greater than 0');
        return;
    }
    
    if (duration <= 0) {
        showError('Duration must be greater than 0');
        return;
    }
    
    // Calculate battery capacity (Wh)
    const batteryCapacity = power * duration;
    
    // Display result
    batteryCapacitySpan.textContent = batteryCapacity.toFixed(2);
    resultDiv.classList.remove('hidden');
    
    // Show product recommendations
    showProductRecommendations(batteryCapacity);
}

// Show product recommendations function
function showProductRecommendations(capacity) {
    // Clear previous product list
    productListDiv.innerHTML = '';
    
    // Find recommended products (smallest product with capacity >= required capacity, and a slightly larger one)
    const recommendedProducts = products.filter(product => product.capacity >= capacity)
                                        .sort((a, b) => a.capacity - b.capacity)
                                        .slice(0, 2);
    
    // If no suitable products found, recommend the product with maximum capacity
    if (recommendedProducts.length === 0) {
        const maxProduct = [...products].sort((a, b) => b.capacity - a.capacity)[0];
        recommendedProducts.push(maxProduct);
    }
    
    // Generate product recommendation HTML
    recommendedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-semibold text-lg text-gray-800">${product.name}</h3>
                <p class="text-gray-600 mt-2">${product.description}</p>
                <div class="mt-3 flex justify-between items-center">
                    <span class="text-primary font-medium">${product.capacity}Wh</span>
                    <button class="bg-primary hover:bg-[#6a7a40] text-white px-3 py-1 rounded text-sm transition-colors">Learn More</button>
                </div>
            </div>
        `;
        productListDiv.appendChild(productCard);
    });
    
    // Show recommendations section
    recommendationsDiv.classList.remove('hidden');
}

// Show error message function
function showError(message) {
    errorDiv.querySelector('p').textContent = message;
    errorDiv.classList.remove('hidden');
}

// 添加事件监听器
calculateBtn.addEventListener('click', calculateBatteryCapacity);

// 添加回车键支持
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateBatteryCapacity();
    }
});