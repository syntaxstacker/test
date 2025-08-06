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
    productListDiv.innerHTML = '';

    const parseKwh = (s) => {
        if (!s) return NaN;
        let t = String(s).trim();
        t = t.replace('额定容量：', '').replace('Rated capacity: ', '').replace(/kWh/i, '').trim();
        t = t.replace(/[^0-9.]/g, '');
        return parseFloat(t);
    };

    const withCap = products.map(p => ({ p, cap: parseKwh(p.ratedCapacity) })).filter(x => !isNaN(x.cap));
    const ge = withCap.filter(x => x.cap >= requiredKwh).sort((a,b) => a.cap - b.cap);

    let picks = [];
    if (ge.length) {
        const minCap = ge[0].cap;
        picks = ge.filter(x => Math.abs(x.cap - minCap) < 1e-9); // include ties
    } else {
        const maxCap = Math.max(...withCap.map(x => x.cap));
        picks = withCap.filter(x => x.cap === maxCap);
    }

    if (!picks.length) {
        recommendationsDiv.classList.add('hidden');
        return;
    }

    picks.forEach(({p: chosen}) => {
        const productCard = document.createElement('div');
        productCard.className = 'border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow';
        productCard.innerHTML = `
            <img src="${chosen.image}" alt="${chosen.model}" class="w-full h-92 object-cover">
            <div class="p-4">
                <h3 class="font-semibold text-lg text-gray-800">${chosen.model}</h3>
                <p class="text-gray-600 mt-2">${chosen.description}</p>
                <p class="text-gray-700 mt-1">${chosen.ratedCapacity}</p>
                <p class="text-gray-700">${chosen.ratedPower}</p>
                <div class="flex justify-between items-center">
                    <p class="text-gray-700">${chosen.maximumPhotovoltaicInput}</p>
                    <button class="bg-primary hover:bg-[#6a7a40] text-white px-3 py-1 rounded text-sm transition-colors">查看详情</button>
                </div>
            </div>
        `;
        productListDiv.appendChild(productCard);
    });
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