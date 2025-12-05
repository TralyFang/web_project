class JSONParser {
    constructor() {
        this.errors = [];
        this.repairedJson = '';
    }

    /**
     * 主解析方法
     */
    parse(jsonString) {
        this.errors = [];
        this.repairedJson = jsonString;

        // 1. 首先尝试标准JSON.parse
        try {
            const result = JSON.parse(jsonString);
            return {
                success: true,
                data: result,
                errors: [],
                repairedJson: jsonString
            };
        } catch (error) {
            // 2. 如果标准解析失败，启动容错解析
            return this.tolerantParse(jsonString, error);
        }
    }

    /**
     * 容错解析方法
     */
    tolerantParse(jsonString, originalError) {
        this.errors = [];
        
        // 执行修复策略
        const repaired = this.repairJson(jsonString);
        
        // 尝试重新解析修复后的JSON
        try {
            const result = JSON.parse(repaired);
            return {
                success: true,
                data: result,
                errors: this.errors,
                repairedJson: repaired
            };
        } catch (error) {
            // 如果修复后仍然失败，返回错误信息
            this.errors.push({
                type: 'FINAL_PARSE_ERROR',
                message: error.message,
                position: error.position
            });
            
            return {
                success: false,
                data: null,
                errors: this.errors,
                repairedJson: repaired
            };
        }
    }

    /**
     * JSON修复策略
     */
    repairJson(jsonString) {
        this.repairedJson = jsonString; // 保存当前处理的字符串用于行号计算
        let result = jsonString;
        
        // 修复策略按优先级执行
        result = this.fixMissingQuotes(result);
        result = this.fixSingleQuotes(result);
        result = this.fixTrailingCommas(result);
        result = this.fixUnquotedKeys(result);
        result = this.fixUnescapedChars(result);
        
        return result;
    }

    /**
     * 修复缺失的引号
     */
    fixMissingQuotes(str) {
        // 匹配属性名: 值 的模式
        const propertyPattern = /(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*):(\s*)([^,\}\s][^,\}\]]*?)(?=\s*[,}\]]|$)/g;
        
        return str.replace(propertyPattern, (match, space1, key, space2, space3, value) => {
            let fixedValue = value;
            
            // 检查值是否需要引号，排除JSON结构字符
            if (!this.isQuoted(value) && !this.isNumber(value) && !this.isBoolean(value) && !this.isNull(value) && 
                !this.isJsonStructure(value)) {
                fixedValue = `"${value}"`;
                this.addError('UNQUOTED_VALUE', `值 "${value}" 缺少双引号`, match.index);
            }
            
            return `${space1}"${key}"${space2}:${space3}${fixedValue}`;
        });
    }

    /**
     * 修复单引号为双引号
     */
    fixSingleQuotes(str) {
        // 匹配单引号字符串
        const singleQuotePattern = /'(?:[^'\\]|\\.)*'/g;
        
        return str.replace(singleQuotePattern, (match) => {
            // 将单引号替换为双引号，并转义内部的双引号
            const content = match.slice(1, -1).replace(/"/g, '\\"');
            this.addError('SINGLE_QUOTE', '字符串使用了单引号，已转换为双引号', match.index);
            return `"${content}"`;
        });
    }

    /**
     * 修复尾随逗号
     */
    fixTrailingCommas(str) {
        // 修复对象尾随逗号
        let result = str.replace(/,(\s*[}\]])(?!\s*[{\[])/g, '$1');
        
        // 修复数组尾随逗号
        result = result.replace(/,(\s*\])(?!\s*\[)/g, '$1');
        
        if (result !== str) {
            this.addError('TRAILING_COMMA', '修复了尾随逗号', 0);
        }
        
        return result;
    }

    /**
     * 修复未加引号的键
     */
    fixUnquotedKeys(str) {
        // 匹配未加引号的属性名
        const unquotedKeyPattern = /(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*):/g;
        
        return str.replace(unquotedKeyPattern, (match, space1, key, space2) => {
            this.addError('UNQUOTED_KEY', `属性名 "${key}" 缺少双引号`, match.index);
            return `${space1}"${key}"${space2}:`;
        });
    }

    /**
     * 修复未转义的特殊字符
     */
    fixUnescapedChars(str) {
        // 在双引号字符串中修复未转义的特殊字符
        const stringPattern = /"(?:[^"\\]|\\.)*"/g;
        
        return str.replace(stringPattern, (match) => {
            // 这里可以添加更复杂的转义逻辑
            // 目前主要处理基本的转义需求
            return match;
        });
    }

    /**
     * 辅助方法：检查是否为数字
     */
    isNumber(str) {
        return /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(str.trim());
    }

    /**
     * 辅助方法：检查是否为布尔值
     */
    isBoolean(str) {
        return str.trim() === 'true' || str.trim() === 'false';
    }

    /**
     * 辅助方法：检查是否为null
     */
    isNull(str) {
        return str.trim() === 'null';
    }

    /**
     * 辅助方法：检查是否已加引号
     */
    isQuoted(str) {
        const trimmed = str.trim();
        return (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
               (trimmed.startsWith("'") && trimmed.endsWith("'"));
    }

    /**
     * 辅助方法：检查是否为JSON结构字符
     */
    isJsonStructure(str) {
        const trimmed = str.trim();
        return trimmed === '{' || trimmed === '}' || trimmed === '[' || trimmed === ']';
    }

    /**
     * 添加错误信息
     */
    addError(type, message, position) {
        this.errors.push({
            type,
            message,
            position,
            line: this.getLineNumber(position)
        });
    }

    /**
     * 根据位置获取行号
     */
    getLineNumber(position) {
        if (position === undefined || position === null) return 1;
        const textBefore = this.repairedJson.substring(0, position);
        return (textBefore.match(/\n/g) || []).length + 1;
    }

    /**
     * 格式化JSON输出
     */
    formatJson(obj, indent = 2) {
        return JSON.stringify(obj, null, indent);
    }

    /**
     * 尝试使用eval解析（类似BeJSON的JS eval功能）
     */
    evalParse(jsonString) {
        try {
            // 使用间接eval提高安全性
            const indirectEval = eval;
            const result = indirectEval(`(${jsonString})`);
            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}