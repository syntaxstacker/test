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
    
    // Get input values (power in kWh)
    if (!/^\d*(?:\.\d{0,4})?$/.test(powerInput.value)) {
        powerInput.value = powerInput.value
            .replace(/[^\d.]/g, '')
            .replace(/(\..*)\./g, '$1')
            .replace(/(\.\d{4}).*/g, '$1');
    }
    if (powerInput.value === '' || isNaN(powerInput.value)) {
        showError('请输入有效的数字');
        return;
    }
    const powerKwh = parseFloat(powerInput.value);
    
    if (!/^\d*(?:\.\d{0,4})?$/.test(durationInput.value)) {
        durationInput.value = durationInput.value
            .replace(/[^\d.]/g, '')
            .replace(/(\..*)\./g, '$1')
            .replace(/(\.\d{4}).*/g, '$1');
    }
    if (durationInput.value === '' || isNaN(durationInput.value)) {
        showError('请输入有效的数字');
        return;
    }
    const duration = parseFloat(durationInput.value);
    
    if (powerKwh <= 0) {
        powerInput.value = '0';
        showError('负载功率必须大于0');
        return;
    }
    
    if (powerInput.value < 0) {
        powerInput.value = '0';
        showError('负载功率必须大于0');
        return;
    }
    
    if (duration <= 0) {
        durationInput.value = '0';
        if (powerKwh > 0) {
            errorDiv.classList.add('hidden');
        } else {
            showError('请填写有效的数值');
        }
        return;
    }
    
    if (durationInput.value < 0) {
        durationInput.value = '0';
        showError('请填写有效的数值');
        return;
    }
    
    // Calculate energy (kWh)
    const energyKwh = powerKwh * duration;
    
    // Display result in kWh and Wh
    batteryCapacitySpan.textContent = `${energyKwh.toFixed(2)} kWh / ${(energyKwh*1000).toFixed(0)} Wh`;
    resultDiv.classList.remove('hidden');
    
    // Show product recommendations using kWh
    showProductRecommendations(energyKwh);
}

// Show product recommendations function
function showProductRecommendations(requiredKwh) {
    // Clear previous product list
    productListDiv.innerHTML = '';
    
    // Find recommended products (smallest product with capacity >= required capacity, and a slightly larger one)
    const recommendedProducts = products.filter(product => {
        const productCapacity = parseFloat(product.ratedCapacity.replace('Rated capacity: ', '').replace('kWh', ''));
        return productCapacity >= requiredKwh;
    }).sort((a, b) => {
        const capacityA = parseFloat(a.ratedCapacity.replace('Rated capacity: ', '').replace('kWh', ''));
        const capacityB = parseFloat(b.ratedCapacity.replace('Rated capacity: ', '').replace('kWh', ''));
        return capacityA - capacityB;
    }).slice(0, 2);
    
    // If no suitable products found, recommend the product with maximum capacity
    if (recommendedProducts.length === 0) {
        const maxProduct = [...products].sort((a, b) => {
            const capacityA = parseFloat(a.ratedCapacity.replace('Rated capacity: ', '').replace('kWh', ''));
            const capacityB = parseFloat(b.ratedCapacity.replace('Rated capacity: ', '').replace('kWh', ''));
            return capacityB - capacityA;
        })[0];
        recommendedProducts.push(maxProduct);
    }
    
    // Generate product recommendation HTML
    recommendedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.model}" class="w-full h-92 object-cover">
            <div class="p-4">
                <h3 class="font-semibold text-lg text-gray-800">${product.model}</h3>
                <p class="text-gray-600 mt-2">${product.description}</p>
                <p class="text-gray-700 mt-1">${product.ratedCapacity}</p>
                <p class="text-gray-700">${product.ratedPower}</p>
                <div class="flex justify-between items-center">
                    <p class="text-gray-700">${product.maximumPhotovoltaicInput}</p>
                    <button class="bg-primary hover:bg-[#6a7a40] text-white px-3 py-1 rounded text-sm transition-colors">查看详情</button>
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
    const messages = errorDiv.querySelectorAll('p');
    messages.forEach((el, i) => {
        if (i === 0) el.textContent = message;
        else el.textContent = '';
    });
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