# 修复朝代大事记和历史小故事数据显示问题

## 问题描述

在使用中国历史知识助手网站时，发现朝代大事记和历史小故事页面在选择朝代后，对应的历史事件和故事数据无法显示。

## 问题分析

经过详细检查，发现以下问题：

1. **数据文件加载问题**：虽然数据文件在HTML中被正确引入，但可能存在加载顺序或时机问题。

2. **初始化函数调用问题**：虽然初始化函数在DOMContentLoaded事件中被调用，但缺少对数据文件是否成功加载的检查。

3. **事件处理问题**：故事详情模态框的关闭按钮事件处理可能存在问题。

4. **内容渲染问题**：在历史小故事页面中，HTML已经包含了静态的故事卡片，而JavaScript代码又在动态生成故事卡片，可能导致冲突。

## 解决方案

### 1. 添加数据加载检查

在main.js的DOMContentLoaded事件处理函数中，添加对数据文件是否成功加载的检查：

```javascript
// 检查数据文件是否加载
console.log('dynastyData 是否存在:', typeof dynastyData !== 'undefined');
console.log('storyData 是否存在:', typeof storyData !== 'undefined');

// 初始化朝代事件数据
if (typeof dynastyData !== 'undefined') {
    initDynastyEventsData();
} else {
    console.error('dynastyData 未定义，无法初始化朝代事件数据');
}

// 初始化历史故事数据
if (typeof storyData !== 'undefined') {
    initStoryData();
} else {
    console.error('storyData 未定义，无法初始化历史故事数据');
}
```

### 2. 修复故事详情模态框事件处理

将故事详情模态框的关闭按钮事件处理移到DOMContentLoaded事件中：

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // 关闭故事详情模态框
    document.getElementById('close-story-modal')?.addEventListener('click', function() {
        document.getElementById('story-modal').classList.add('hidden');
    });

    // 点击故事模态框外部关闭
    document.getElementById('story-modal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
});
```

### 3. 避免重复渲染故事卡片

在initStoryData函数中添加检查，避免重复渲染故事卡片：

```javascript
// 检查容器是否已经有内容
if (container.children.length === 0) {
    // 创建朝代故事容器并添加故事卡片
    // ...
} else {
    console.log(`朝代 ${dynasty} 故事容器已有内容，跳过渲染`);
}
```

### 4. 添加详细的调试日志

在关键函数中添加详细的调试日志，帮助追踪数据加载和处理过程：

- 在initDynastyEventsData函数中添加日志，检查每个朝代的数据和容器元素
- 在initStoryData函数中添加日志，检查每个朝代的故事数据和容器元素
- 在showSection函数中添加日志，检查页面切换过程

### 5. 创建测试页面

创建了以下测试页面来帮助诊断问题：

1. **test-data.html**：测试数据文件是否正确加载和数据结构是否正确
2. **test-events.html**：测试朝代事件数据是否能正确显示
3. **test.html**：简化的主页面测试

## 验证方法

1. 打开浏览器的开发者工具（按F12），查看控制台输出，确认数据文件是否被正确加载
2. 访问朝代大事记页面，检查是否能正确显示历史事件
3. 访问历史小故事页面，检查是否能正确显示历史故事
4. 使用测试页面进行更详细的功能测试

## 注意事项

1. 确保数据文件路径正确，并且在HTML中被正确引入
2. 确保浏览器没有缓存旧版本的JavaScript文件，可以尝试清除浏览器缓存
3. 确保所有必要的DOM元素都存在，并且ID与JavaScript代码中的ID匹配
4. 如果问题仍然存在，可以使用提供的测试页面进行更详细的诊断

通过以上修复，朝代大事记和历史小故事页面应该能够正确显示数据，用户可以选择不同的朝代查看对应的历史事件和故事。
