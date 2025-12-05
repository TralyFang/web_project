class JSONParserApp {
    constructor() {
        this.parser = new JSONParser();
        this.jsonInput = document.getElementById('json-input');
        this.parseResult = document.getElementById('parse-result');
        this.errorDetails = document.getElementById('error-details');
        this.errorCount = document.getElementById('error-count');
        this.evalStatus = document.getElementById('eval-status');
        this.statusText = document.getElementById('status-text');
        this.lineNumbers = document.getElementById('line-numbers');
        this.resizeHandle = document.getElementById('resize-handle');
        this.copyBtn = document.getElementById('copy-btn');
        
        // 选项状态
        this.options = {
            compress: true,
            colorize: true,
            showTypes: false,
            showIndices: false
        };

        this.initEventListeners();
        this.updateLineNumbers(); // 初始化行号显示
        this.loadSampleData();
    }

    /**
     * 初始化事件监听器
     */
    initEventListeners() {
        // 输入框变化事件 - 同时更新行号和解析JSON
        this.jsonInput.addEventListener('input', () => {
            this.updateLineNumbers();
            this.debounce(() => this.parseJSON(), 300);
        });

        // 双击格式化事件
        this.jsonInput.addEventListener('dblclick', () => {
            this.formatJSON();
        });

        // 键盘快捷键
        this.jsonInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.formatJSON();
            }
        });

        // 收藏按钮
        document.querySelector('.favorite-btn').addEventListener('click', () => {
            this.addToFavorites();
        });

        // 选项按钮点击事件
        document.querySelector('.options-btn').addEventListener('click', () => {
            this.toggleOptionsMenu();
        });

        // 输入框滚动同步行号
        this.jsonInput.addEventListener('scroll', () => {
            this.lineNumbers.scrollTop = this.jsonInput.scrollTop;
        });

        // 双击复制功能
        this.parseResult.addEventListener('dblclick', (e) => {
            this.copyResultToClipboard();
        });

        // 区域大小调节
        this.initResizeHandler();

        // 选项事件监听
        this.initOptionListeners();

        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            const optionsMenu = document.getElementById('options-menu');
            const optionsBtn = document.querySelector('.options-btn');
            
            if (!optionsMenu.contains(e.target) && !optionsBtn.contains(e.target)) {
                optionsMenu.classList.remove('show');
            }
        });
    }

    /**
     * 防抖函数
     */
    debounce(func, wait) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }

    /**
     * 解析JSON
     */
    parseJSON() {
        const input = this.jsonInput.value.trim();
        
        if (!input) {
            this.clearResults();
            this.statusText.textContent = '准备就绪';
            return;
        }

        this.statusText.textContent = '解析中...';

        // 1. 使用容错解析器
        const parseResult = this.parser.parse(input);
        
        // 2. 尝试eval解析
        const evalResult = this.parser.evalParse(input);

        // 更新UI
        this.updateResults(parseResult, evalResult);
        this.statusText.textContent = '解析完成';
    }

    /**
     * 格式化JSON
     */
    formatJSON() {
        const input = this.jsonInput.value.trim();
        
        if (!input) {
            return;
        }

        try {
            // 先尝试解析
            const result = this.parser.parse(input);
            
            if (result.success) {
                // 如果解析成功，格式化输出
                const formatted = this.parser.formatJson(result.data);
                this.jsonInput.value = formatted;
                this.updateLineNumbers(); // 更新行号显示
                this.parseJSON(); // 重新解析格式化后的内容
            } else {
                // 如果解析失败，尝试基本的格式化
                this.basicFormat(input);
            }
        } catch (error) {
            this.basicFormat(input);
        }
    }

    /**
     * 基础格式化
     */
    basicFormat(input) {
        try {
            // 简单的缩进格式化
            let formatted = input
                .replace(/([{,\[])\s*/g, '$1\n')
                .replace(/\s*([}\]])/g, '\n$1')
                .replace(/\n/g, '\n  ');
            
            this.jsonInput.value = formatted;
            this.updateLineNumbers(); // 更新行号显示
            this.parseJSON();
        } catch (error) {
            // 如果格式化失败，保持原样
        }
    }

    /**
     * 更新结果显示
     */
    updateResults(parseResult, evalResult) {
        this.clearResults();

        // 更新错误计数
        const errorCount = parseResult.errors.length;
        this.errorCount.textContent = `${errorCount} 错误${errorCount > 0 ? ',详细请看黑色部分' : ''}`;
        this.errorCount.className = `error-count ${errorCount > 0 ? 'has-errors' : 'no-errors'}`;

        // 更新eval状态
        this.evalStatus.textContent = evalResult.success ? 'success' : 'fails';
        this.evalStatus.className = `eval-status ${evalResult.success ? 'success' : 'fails'}`;

        if (parseResult.success) {
            this.displaySuccessResult(parseResult);
        } else {
            this.displayErrorResult(parseResult);
        }

        // 显示错误详情
        if (parseResult.errors.length > 0) {
            this.displayErrorDetails(parseResult.errors);
        }

        // 高亮错误行
        this.highlightErrorLines(parseResult.errors);
    }

    /**
     * 显示成功结果
     */
    displaySuccessResult(result) {
        // 根据压缩选项格式化JSON
        const formattedJson = this.options.compress 
            ? JSON.stringify(result.data) 
            : this.parser.formatJson(result.data, 2);
        
        // 只显示格式化文本（移除树形结构显示）
        const textElement = document.createElement('pre');
        textElement.className = 'formatted-json';
        
        if (this.options.colorize) {
            textElement.innerHTML = this.colorizeJson(formattedJson);
        } else {
            textElement.textContent = formattedJson;
        }
        
        this.parseResult.appendChild(textElement);
        
        // 更新结果行数统计
        const resultLineCount = document.getElementById('result-line-count');
        if (resultLineCount) {
            const lineCount = formattedJson.split('\n').length;
            resultLineCount.textContent = `${lineCount} 行`;
        }
    }

    /**
     * 显示错误结果
     */
    displayErrorResult(result) {
        const errorElement = document.createElement('div');
        errorElement.className = 'parse-error';
        
        if (result.repairedJson) {
            // 显示修复后的JSON结构
            try {
                const repairedData = JSON.parse(result.repairedJson);
                const treeElement = this.createJsonTree(repairedData);
                this.parseResult.appendChild(treeElement);
            } catch (e) {
                // 如果修复后的JSON仍然无法解析，显示原始结构
                const structureElement = this.createJsonStructure(result.repairedJson);
                this.parseResult.appendChild(structureElement);
            }
        } else {
            errorElement.innerHTML = `
                <div class="error-message">
                    <strong>解析失败:</strong> ${result.errors[0]?.message || '未知错误'}
                </div>
            `;
            this.parseResult.appendChild(errorElement);
        }
    }

    /**
     * 创建JSON树形结构
     */
    createJsonTree(data, level = 0) {
        const container = document.createElement('div');
        container.className = 'json-tree';

        if (typeof data === 'object' && data !== null) {
            const isArray = Array.isArray(data);
            const entries = isArray ? data.map((value, index) => [index, value]) : Object.entries(data);

            const bracketOpen = document.createElement('span');
            bracketOpen.className = 'json-bracket';
            bracketOpen.textContent = isArray ? '[' : '{';
            container.appendChild(bracketOpen);

            if (entries.length === 0) {
                const empty = document.createElement('span');
                empty.className = 'json-empty';
                empty.textContent = isArray ? ']' : '}';
                container.appendChild(empty);
            } else {
                const list = document.createElement('ul');
                list.className = 'json-list';

                entries.forEach(([key, value], index) => {
                    const item = document.createElement('li');
                    item.className = 'json-item';

                    if (!isArray) {
                        const keyElement = document.createElement('span');
                        keyElement.className = 'json-key';
                        keyElement.textContent = `"${key}"`;
                        item.appendChild(keyElement);

                        const colon = document.createElement('span');
                        colon.className = 'json-colon';
                        colon.textContent = ':';
                        item.appendChild(colon);
                    } else if (this.options.showIndices) {
                        const indexElement = document.createElement('span');
                        indexElement.className = 'json-index';
                        indexElement.textContent = `[${key}]`;
                        indexElement.style.color = '#6c757d';
                        indexElement.style.marginRight = '8px';
                        indexElement.style.fontSize = '12px';
                        indexElement.style.fontWeight = 'bold';
                        item.appendChild(indexElement);
                    }

                    const valueElement = this.createValueElement(value, level + 1);
                    item.appendChild(valueElement);

                    if (index < entries.length - 1) {
                        const comma = document.createElement('span');
                        comma.className = 'json-comma';
                        comma.textContent = ',';
                        item.appendChild(comma);
                    }

                    list.appendChild(item);
                });

                container.appendChild(list);

                const bracketClose = document.createElement('span');
                bracketClose.className = 'json-bracket';
                bracketClose.textContent = isArray ? ']' : '}';
                container.appendChild(bracketClose);
            }
        } else {
            container.appendChild(this.createValueElement(data, level));
        }

        return container;
    }

    /**
     * 创建值元素
     */
    createValueElement(value, level) {
        const element = document.createElement('span');
        
        if (typeof value === 'string') {
            element.className = 'json-string';
            element.textContent = `"${value}"`;
            if (this.options.showTypes) {
                element.setAttribute('title', `类型: string (长度: ${value.length})`);
            }
        } else if (typeof value === 'number') {
            element.className = 'json-number';
            element.textContent = value.toString();
            if (this.options.showTypes) {
                const type = Number.isInteger(value) ? 'integer' : 'float';
                element.setAttribute('title', `类型: number (${type})`);
            }
        } else if (typeof value === 'boolean') {
            element.className = 'json-boolean';
            element.textContent = value.toString();
            if (this.options.showTypes) {
                element.setAttribute('title', `类型: boolean`);
            }
        } else if (value === null) {
            element.className = 'json-null';
            element.textContent = 'null';
            if (this.options.showTypes) {
                element.setAttribute('title', `类型: null`);
            }
        } else if (typeof value === 'object') {
            const typeText = Array.isArray(value) ? 'array' : 'object';
            const size = Array.isArray(value) ? value.length : Object.keys(value).length;
            if (this.options.showTypes) {
                element.setAttribute('title', `类型: ${typeText} (大小: ${size})`);
            }
            element.appendChild(this.createJsonTree(value, level));
        }

        return element;
    }

    /**
     * 创建JSON结构（用于显示修复后的结构）
     */
    createJsonStructure(jsonString) {
        const container = document.createElement('div');
        container.className = 'json-structure';
        
        // 这里可以添加更复杂的结构分析逻辑
        const pre = document.createElement('pre');
        pre.textContent = jsonString;
        container.appendChild(pre);
        
        return container;
    }

    /**
     * 显示错误详情
     */
    displayErrorDetails(errors) {
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'error-list';

        errors.forEach(error => {
            const errorItem = document.createElement('div');
            errorItem.className = 'error-item';
            
            const errorType = this.getErrorTypeText(error.type);
            errorItem.innerHTML = `
                <span class="error-type">${errorType}:</span>
                <span class="error-message">${error.message}</span>
            `;
            
            detailsContainer.appendChild(errorItem);
        });

        this.errorDetails.appendChild(detailsContainer);
    }

    /**
     * 获取错误类型文本
     */
    getErrorTypeText(type) {
        const typeMap = {
            'UNQUOTED_KEY': '属性名缺少引号',
            'UNQUOTED_VALUE': '值缺少引号',
            'SINGLE_QUOTE': '单引号字符串',
            'TRAILING_COMMA': '尾随逗号',
            'FINAL_PARSE_ERROR': '最终解析错误'
        };
        
        return typeMap[type] || type;
    }

    /**
     * 清除结果
     */
    clearResults() {
        this.parseResult.innerHTML = '';
        this.errorDetails.innerHTML = '';
    }

    /**
     * 加载示例数据
     */
    loadSampleData() {
        const sampleData = `{
  "name": "示例数据",
  "version": 1.0,
  "features": ["解析", "格式化", "错误检测"],
  "enabled": true
}`;
        
        this.jsonInput.value = sampleData;
        this.updateLineNumbers();
        this.parseJSON();
    }

    /**
     * 更新行号显示
     */
    updateLineNumbers() {
        const text = this.jsonInput.value;
        const lines = text.split('\n');
        const lineCount = lines.length;
        
        // 更新行号容器
        this.lineNumbers.innerHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            const lineNumber = document.createElement('div');
            lineNumber.className = 'line-number';
            lineNumber.textContent = i;
            this.lineNumbers.appendChild(lineNumber);
        }
        
        // 更新行数统计
        const inputLineCount = document.getElementById('input-line-count');
        if (inputLineCount) {
            inputLineCount.textContent = `${lineCount} 行`;
        }
    }

    /**
     * 高亮错误行
     */
    highlightErrorLines(errors) {
        const errorLines = new Set();
        errors.forEach(error => {
            if (error.line) {
                errorLines.add(error.line);
            }
        });

        const lineNumbers = this.lineNumbers.querySelectorAll('.line-number');
        lineNumbers.forEach((lineNumber, index) => {
            if (errorLines.has(index + 1)) {
                lineNumber.classList.add('error-line');
            } else {
                lineNumber.classList.remove('error-line');
            }
        });
    }

    /**
     * 双击复制结果
     */
    copyResultToClipboard() {
        // 只复制格式化文本，不包含HTML标签
        const formattedElement = this.parseResult.querySelector('.formatted-json');
        if (formattedElement) {
            const resultText = formattedElement.textContent || formattedElement.innerText;
            if (resultText.trim()) {
                navigator.clipboard.writeText(resultText).then(() => {
                    this.copyBtn.textContent = '已复制!';
                    setTimeout(() => {
                        this.copyBtn.textContent = '双击内容可复制';
                    }, 2000);
                }).catch(() => {
                    this.copyBtn.textContent = '复制失败';
                    setTimeout(() => {
                        this.copyBtn.textContent = '双击内容可复制';
                    }, 2000);
                });
            }
        }
    }

    /**
     * 切换选项菜单显示
     */
    toggleOptionsMenu() {
        const optionsMenu = document.getElementById('options-menu');
        optionsMenu.classList.toggle('show');
    }

    /**
     * 初始化选项监听器
     */
    initOptionListeners() {
        const compressOption = document.getElementById('compress-option');
        const colorizeOption = document.getElementById('colorize-option');
        const showTypesOption = document.getElementById('show-types-option');
        const showIndicesOption = document.getElementById('show-indices-option');

        compressOption.checked = this.options.compress;
        colorizeOption.checked = this.options.colorize;
        showTypesOption.checked = this.options.showTypes;
        showIndicesOption.checked = this.options.showIndices;

        compressOption.addEventListener('change', (e) => {
            this.options.compress = e.target.checked;
            this.updateOptionIndicators();
            this.parseJSON();
        });

        colorizeOption.addEventListener('change', (e) => {
            this.options.colorize = e.target.checked;
            this.updateOptionIndicators();
            this.parseJSON();
        });

        showTypesOption.addEventListener('change', (e) => {
            this.options.showTypes = e.target.checked;
            this.updateOptionIndicators();
            this.parseJSON();
        });

        showIndicesOption.addEventListener('change', (e) => {
            this.options.showIndices = e.target.checked;
            this.updateOptionIndicators();
            this.parseJSON();
        });

        // 初始化选项指示器
        this.updateOptionIndicators();
    }

    /**
     * 初始化区域大小调节
     */
    initResizeHandler() {
        let isResizing = false;
        
        this.resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const container = document.querySelector('.container');
            const containerRect = container.getBoundingClientRect();
            const newLeftWidth = e.clientX - containerRect.left;
            const containerWidth = containerRect.width;
            
            if (newLeftWidth > 100 && newLeftWidth < containerWidth - 100) {
                const leftSection = document.querySelector('.input-section');
                const rightSection = document.querySelector('.result-section');
                
                leftSection.style.flex = `0 0 ${newLeftWidth}px`;
                rightSection.style.flex = `1 1 ${containerWidth - newLeftWidth - 28}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.body.style.cursor = '';
        });
    }

    /**
     * JSON着色方法
     */
    colorizeJson(jsonString) {
        return jsonString
            .replace(/"(\\.|[^"\\])*"/g, '<span class="json-string">$&</span>')
            .replace(/\b(true|false)\b/g, '<span class="json-boolean">$&</span>')
            .replace(/\b(null)\b/g, '<span class="json-null">$&</span>')
            .replace(/\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g, '<span class="json-number">$&</span>')
            .replace(/[{}\[\]]/g, '<span class="json-bracket">$&</span>')
            .replace(/:/g, '<span class="json-colon">:</span>')
            .replace(/,/g, '<span class="json-comma">,</span>');
    }

    /**
     * 更新选项指示器
     */
    updateOptionIndicators() {
        const indicators = document.querySelectorAll('.options-indicators .option-indicator');
        const enabledOptions = Object.values(this.options).filter(Boolean).length;
        
        indicators.forEach((indicator, index) => {
            if (index < enabledOptions) {
                indicator.classList.add('active', 'checked');
                indicator.textContent = '●';
            } else {
                indicator.classList.remove('active', 'checked');
                indicator.textContent = '○';
            }
        });
    }

    /**
     * 添加到收藏（示例功能）
     */
    addToFavorites() {
        alert('收藏功能已触发（示例）');
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new JSONParserApp();
});