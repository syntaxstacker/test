// 获取DOM元素
const powerInput = document.getElementById('power');
const durationInput = document.getElementById('duration');
const efficiencyInput = document.getElementById('efficiency');
const calculateBtn = document.getElementById('calculate');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const batteryCapacitySpan = document.getElementById('battery-capacity');

// 计算电池容量的函数
function calculateBatteryCapacity() {
    // 隐藏之前的结果和错误信息
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    
    // 获取输入值
    const power = parseFloat(powerInput.value);
    const duration = parseFloat(durationInput.value);
    const efficiency = parseFloat(efficiencyInput.value) / 100; // 转换为小数
    
    // 验证输入
    if (isNaN(power) || isNaN(duration) || isNaN(efficiency)) {
        showError('请输入有效的数字');
        return;
    }
    
    if (power <= 0) {
        showError('负载功率必须大于0');
        return;
    }
    
    if (duration <= 0) {
        showError('工作时长必须大于0');
        return;
    }
    
    if (efficiency <= 0 || efficiency > 1) {
        showError('系统效率必须在0-100%之间');
        return;
    }
    
    // 计算电池容量 (Wh)
    const batteryCapacity = (power * duration) / efficiency;
    
    // 显示结果
    batteryCapacitySpan.textContent = batteryCapacity.toFixed(2);
    resultDiv.classList.remove('hidden');
}

// 显示错误信息的函数
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