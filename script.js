// 更新时间和问候语的函数
function updateTimeAndGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    document.getElementById('currentTime').textContent = `${hours}:${minutes}`;
    
    let greeting = '';
    if (hours >= 5 && hours < 12) {
        greeting = '早上好';
    } else if (hours >= 12 && hours < 18) {
        greeting = '下午好';
    } else {
        greeting = '晚上好';
    }
    document.getElementById('greeting').textContent = greeting;
}

// 搜索功能设置函数
function setupSearch() {
    const searchBox = document.querySelector('.search-box');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', function() {
        performSearch();
    });
    
    searchBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// 执行搜索的函数
function performSearch() {
    const searchTerm = document.querySelector('.search-box').value.trim();
    
    if (searchTerm !== '') {
        window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(searchTerm)}`, '_blank');
        document.querySelector('.search-box').value = '';
    }
}

// 长按和点击功能
function setupAppIcons() {
    const appIcons = document.querySelectorAll('.app-icon');
    let longPressTimer;
    const longPressDuration = 500; // 长按时间（毫秒）
    let currentEditingApp = null; // 当前正在编辑的应用
    
    // 从本地存储获取自定义链接，如果没有则使用默认值
    function getAppUrl(appName, defaultUrl) {
        const customUrls = JSON.parse(localStorage.getItem('customAppUrls') || '{}');
        return customUrls[appName] || defaultUrl;
    }
    
    // 保存自定义链接到本地存储
    function saveAppUrl(appName, url) {
        const customUrls = JSON.parse(localStorage.getItem('customAppUrls') || '{}');
        customUrls[appName] = url;
        localStorage.setItem('customAppUrls', JSON.stringify(customUrls));
    }
    
    // 重置为默认链接
    function resetAppUrl(appName) {
        const customUrls = JSON.parse(localStorage.getItem('customAppUrls') || '{}');
        delete customUrls[appName];
        localStorage.setItem('customAppUrls', JSON.stringify(customUrls));
        return getDefaultUrl(appName);
    }
    
    // 获取默认链接
    function getDefaultUrl(appName) {
        const icon = document.querySelector(`.app-icon[data-name="${appName}"]`);
        return icon ? icon.getAttribute('data-default') : '';
    }
    
    // 打开链接
    function openAppUrl(url, appName) {
        if (url.startsWith('http') || url.startsWith('https')) {
            window.open(url, '_blank');
        } else if (url.startsWith('tel:') || url.startsWith('mailto:')) {
            window.location.href = url;
        } else {
            // 对于其他协议，尝试打开但可能不被支持
            try {
                window.location.href = url;
            } catch (error) {
                alert(`${appName} 功能：链接 "${url}" 可能不被浏览器支持`);
            }
        }
    }
    
    // 显示自定义链接模态框
    function showCustomizeModal(appName, currentUrl) {
        currentEditingApp = appName; // 设置当前编辑的应用
        
        const modal = document.getElementById('customizeModal');
        const appNameInput = document.getElementById('appName');
        const appUrlInput = document.getElementById('appUrl');
        
        appNameInput.value = appName;
        appUrlInput.value = currentUrl;
        
        modal.style.display = 'flex';
        
        // 清除之前的事件监听器
        const saveBtn = document.getElementById('saveUrl');
        const cancelBtn = document.getElementById('cancelUrl');
        const resetBtn = document.getElementById('resetUrl');
        
        // 移除旧的事件监听器
        saveBtn.replaceWith(saveBtn.cloneNode(true));
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        resetBtn.replaceWith(resetBtn.cloneNode(true));
        
        // 重新获取按钮元素
        const newSaveBtn = document.getElementById('saveUrl');
        const newCancelBtn = document.getElementById('cancelUrl');
        const newResetBtn = document.getElementById('resetUrl');
        
        // 保存按钮事件 - 只在点击保存时才保存
        newSaveBtn.onclick = function() {
            const newUrl = appUrlInput.value.trim();
            if (newUrl && currentEditingApp) {
                saveAppUrl(currentEditingApp, newUrl);
                modal.style.display = 'none';
                currentEditingApp = null; // 清空当前编辑的应用
                alert(`"${appName}" 的链接已更新！`);
            } else {
                alert('请输入有效的链接地址');
            }
        };
        
        // 取消按钮事件 - 直接关闭，不保存
        newCancelBtn.onclick = function() {
            modal.style.display = 'none';
            currentEditingApp = null; // 清空当前编辑的应用
        };
        
        // 重置按钮事件 - 重置并关闭
        newResetBtn.onclick = function() {
            if (currentEditingApp) {
                const defaultUrl = resetAppUrl(currentEditingApp);
                appUrlInput.value = defaultUrl;
                modal.style.display = 'none';
                currentEditingApp = null; // 清空当前编辑的应用
                alert(`"${appName}" 的链接已恢复为默认值`);
            }
        };
    }
    
    // 为每个图标添加事件
    appIcons.forEach((icon) => {
        const appName = icon.getAttribute('data-name');
        const defaultUrl = icon.getAttribute('data-default');
        
        // 触摸开始 - 开始长按计时
        icon.addEventListener('touchstart', function(e) {
            longPressTimer = setTimeout(() => {
                e.preventDefault();
                const currentUrl = getAppUrl(appName, defaultUrl);
                showCustomizeModal(appName, currentUrl);
            }, longPressDuration);
        });
        
        // 触摸结束 - 取消长按计时
        icon.addEventListener('touchend', function(e) {
            clearTimeout(longPressTimer);
        });
        
        // 鼠标按下 - 开始长按计时
        icon.addEventListener('mousedown', function(e) {
            longPressTimer = setTimeout(() => {
                const currentUrl = getAppUrl(appName, defaultUrl);
                showCustomizeModal(appName, currentUrl);
            }, longPressDuration);
        });
        
        // 鼠标抬起 - 取消长按计时
        icon.addEventListener('mouseup', function() {
            clearTimeout(longPressTimer);
        });
        
        // 鼠标离开 - 取消长按计时
        icon.addEventListener('mouseleave', function() {
            clearTimeout(longPressTimer);
        });
        
        // 点击事件 - 打开链接
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const url = getAppUrl(appName, defaultUrl);
            openAppUrl(url, appName);
        });
    });
    
    // 点击模态框外部关闭
    document.getElementById('customizeModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            currentEditingApp = null; // 清空当前编辑的应用
        }
    });
}

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    updateTimeAndGreeting();
    setInterval(updateTimeAndGreeting, 1000);
    setupSearch();
    setupAppIcons();
});