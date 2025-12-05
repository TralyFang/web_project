# 修复网页空白和控制台错误问题

## 问题分析

经过检查，发现网页空白和控制台错误可能是由以下原因导致的：

1. **JavaScript错误导致页面渲染中断**：如果在DOMContentLoaded事件处理函数中发生错误，可能会导致整个页面无法正常渲染。

2. **initDynastyEventsData()函数可能存在问题**：
   - 该函数在循环处理dynastyData时可能遇到了数据格式错误
   - 可能尝试访问不存在的DOM元素
   - 可能存在语法错误

3. **数据文件加载顺序问题**：确保dynastyData.js和storyData.js在main.js之前加载。

## 解决方案

我已经对main.js文件进行了以下修复：

### 1. 添加了完整的错误处理机制

在DOMContentLoaded事件处理函数中添加了try-catch块：

```javascript
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 加载完成，开始初始化...');
    
    try {
        // 所有初始化函数
        initSidebar();
        console.log('✓ 侧边栏初始化完成');
        
        // ...其他初始化函数
        
    } catch (error) {
        console.error('初始化过程中发生错误:', error);
        alert('页面加载出错: ' + error.message);
    }
});
```

### 2. 改进了initDynastyEventsData()函数

添加了详细的错误处理和日志输出：

```javascript
function initDynastyEventsData() {
    try {
        console.log('开始初始化朝代事件数据...');
        
        // 检查dynastyData是否存在
        if (typeof dynastyData === 'undefined') {
            console.error('dynastyData 未定义');
            return;
        }
        
        // 遍历所有朝代
        for (const dynasty in dynastyData) {
            console.log(`处理朝代: ${dynasty}`);
            
            const data = dynastyData[dynasty];
            const container = document.getElementById(`${dynasty}-events`);
            
            if (container && data && data.events && data.events.length > 0) {
                // 生成事件卡片HTML
                // ...
                
            } else {
                console.log(`✗ ${dynasty} 没有事件数据或容器不存在`);
                
                // 如果容器存在但没有数据，显示提示信息
                if (container) {
                    container.innerHTML = `
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h2 class="text-2xl font-bold mb-4 text-dark">暂无数据</h2>
                            <p class="text-gray-600">该朝代的历史事件数据正在整理中，敬请期待！</p>
                        </div>
                    `;
                }
            }
        }
        
        console.log('朝代事件数据初始化完成');
        
    } catch (error) {
        console.error('初始化朝代事件数据时发生错误:', error);
    }
}
```

### 3. 确保所有DOM操作都有适当的检查

在所有DOM操作前添加了存在性检查，避免因找不到元素而导致错误：

```javascript
// 示例：
const eventsContainer = document.querySelector('.events-container');
if (eventsContainer) {
    eventsContainer.innerHTML = `...`;
}
```

### 4. 添加了更多的调试信息

在关键位置添加了console.log语句，帮助追踪初始化过程和数据处理情况。

## 测试方法

1. **打开test.html文件**：这个文件包含了对数据文件和函数逻辑的完整测试，可以帮助确认数据是否正确加载。

2. **检查浏览器控制台**：
   - 打开Chrome/Firefox浏览器的开发者工具（F12）
   - 切换到Console标签页
   - 刷新页面，查看是否有错误信息
   - 正常情况下应该看到一系列成功的初始化日志

3. **验证功能**：
   - 检查侧边栏菜单是否可以正常展开/折叠
   - 尝试切换不同的功能模块（历史朝代歌、朝代大事纪等）
   - 检查朝代大事纪中的朝代切换是否正常工作
   - 验证历史小故事是否可以正常显示

## 预期结果

修复后，网页应该能够正常加载，控制台不应该有错误信息，所有功能模块都应该能够正常工作。如果仍然遇到问题，请查看浏览器控制台的错误信息，并根据错误提示进一步调试。
