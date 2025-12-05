// 语音合成对象
let synth = window.speechSynthesis;
let currentUtterance = null;
let isPlaying = false;

// 全局朝代顺序（用于导航按钮与左右切换）
const dynastyOrder = ['xia', 'shang', 'zhou', 'qin', 'han', 'tang', 'song', 'yuan', 'ming', 'qing'];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 加载完成，开始初始化...');
    
    // 初始化语音播放界面与事件绑定
    setupTextToSpeechUI();
    
    // 初始化语音控制界面
    initAudioControls();
    
    
    // 初始化语音合成功能
    initTextToSpeech();
    
    // 检查浏览器是否支持语音合成
    if ('speechSynthesis' in window) {
        console.log('浏览器支持语音合成功能');
    } else {
        console.warn('浏览器不支持语音合成功能');
    }
    
    // 检查数据文件是否加载
    console.log('dynastyData 是否存在:', typeof dynastyData !== 'undefined');
    console.log('storyData 是否存在:', typeof storyData !== 'undefined');
    
    // 初始化侧边栏
    initSidebar();
    
    // 初始化朝代筛选
    initDynastyFilter();
    
    // 初始化朝代事件筛选
    initDynastyEventsFilter();
    
    // 初始化历史小故事筛选
    initStoryFilter();
    
    // 初始化时间轴
    initTimeline();
    
    // 初始化模态框
    initModal();
    
    // 初始化AI助手
    initAIAssistant();
    
    // 初始化对外条约
    initForeignTreaties();
    
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
    
    // 并行构建事件-故事映射
    if (typeof dynastyData !== 'undefined' && typeof storyData !== 'undefined') {
        buildEventStoryIndexMap();
    }
    
    // 默认显示历史朝代歌页面
    showSection('dynasty-song');
    
    // 默认渲染内容由各初始化函数负责
});

function standardizePlayButtons() {
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.className = 'play-button w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors';
        btn.innerHTML = '<i class="fa fa-volume-up"></i>';
    });
}

// 初始化侧边栏
function initSidebar() {
    // 侧边栏切换
    document.getElementById('toggle-sidebar').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('sidebar-expanded');
        sidebar.classList.toggle('sidebar-collapsed');
        
        // 如果侧边栏折叠，隐藏所有子菜单
        if (sidebar.classList.contains('sidebar-collapsed')) {
            document.querySelectorAll('.sidebar-submenu').forEach(submenu => {
                submenu.classList.add('hidden');
            });
            
            // 旋转箭头
            document.querySelectorAll('.sidebar-menu-item i.fa-angle-down').forEach(arrow => {
                arrow.style.transform = 'rotate(0deg)';
            });
        }
    });
    
    // 导航菜单项点击事件
    document.querySelectorAll('.sidebar-menu-item[data-target], .sidebar-submenu-item[data-target]').forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // 切换到对应的内容区域
            showSection(target);
        });
    });
}

// 子菜单切换
function toggleSubmenu(id) {
    const submenu = document.getElementById(`${id}-submenu`);
    const arrow = document.getElementById(`${id}-arrow`);
    
    submenu.classList.toggle('hidden');
    
    // 旋转箭头
    if (submenu.classList.contains('hidden')) {
        arrow.style.transform = 'rotate(0deg)';
    } else {
        arrow.style.transform = 'rotate(180deg)';
    }
}

// 初始化朝代筛选
function initDynastyFilter() {
    document.querySelectorAll('.dynasty-filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            document.querySelectorAll('.dynasty-filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // 筛选朝代卡片
            document.querySelectorAll('.dynasty-card').forEach(card => {
                if (filter === 'all' || card.getAttribute('data-period') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 初始化时间轴
function initTimeline() {
    // 时间轴点击事件
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', function() {
            const dynasty = this.getAttribute('data-dynasty');
            console.log(`点击了${dynasty}朝代`);
            
            // 获取当前显示的页面
            const currentSection = document.querySelector('main > section:not(.hidden)').id;
            
            // 清除所有按钮的active类
            document.querySelectorAll('.dynasty-filter-btn, .dynasty-btn, .story-dynasty-btn').forEach(button => {
                button.classList.remove('active');
            });
            
            // 清除所有朝代卡片的高亮状态
            document.querySelectorAll('.dynasty-card').forEach(card => {
                card.classList.remove('ring-2', 'ring-primary');
            });
            
            if (currentSection === 'dynasty-culture') {
                // 在朝代传承页面
                // 滚动到对应的朝代卡片
                const dynastyCard = document.querySelector(`.dynasty-card[data-dynasty="${dynasty}"]`);
                if (dynastyCard) {
                    dynastyCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // 高亮显示对应的朝代卡片
                    document.querySelectorAll('.dynasty-card').forEach(card => {
                        card.classList.remove('ring-2', 'ring-primary');
                    });
                    dynastyCard.classList.add('ring-2', 'ring-primary');
                }
                
                // 更新朝代筛选按钮的激活状态
                document.querySelectorAll('.dynasty-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 如果有对应的朝代筛选按钮，激活它
                const dynastyFilterBtn = document.querySelector(`.dynasty-filter-btn[data-filter="${getPeriodByDynasty(dynasty)}"]`);
                if (dynastyFilterBtn) {
                    dynastyFilterBtn.classList.add('active');
                } else {
                    // 如果没有对应的时期筛选按钮，激活"全部"按钮
                    document.querySelector('.dynasty-filter-btn[data-filter="all"]').classList.add('active');
                }
            } else if (currentSection === 'dynasty-events') {
                // 在朝代大事纪页面
                // 更新朝代按钮的激活状态
                document.querySelectorAll('.dynasty-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 激活对应的朝代按钮
                const dynastyBtn = document.querySelector(`.dynasty-btn[data-dynasty="${dynasty}"]`);
                if (dynastyBtn) {
                    dynastyBtn.classList.add('active');
                    
                    // 触发朝代切换
                    // 隐藏所有朝代事件
                    document.querySelectorAll('.dynasty-events').forEach(events => {
                        events.classList.add('hidden');
                    });
                    
                    // 显示选中朝代的事件
                    const selectedEvents = document.getElementById(`${dynasty}-events`);
                    if (selectedEvents) {
                        selectedEvents.classList.remove('hidden');
                    } else {
                        // 如果没有对应朝代的事件，显示提示信息
                        const eventsContainer = document.querySelector('.events-container');
                        eventsContainer.innerHTML = `
                            <div class="bg-white rounded-lg shadow-md p-6">
                                <h2 class="text-2xl font-bold mb-4 text-dark">暂无数据</h2>
                                <p class="text-gray-600">该朝代的历史事件数据正在整理中，敬请期待！</p>
                            </div>
                        `;
                    }
                }
            } else if (currentSection === 'historical-stories') {
                // 在历史小故事页面
                // 更新故事朝代按钮的激活状态
                document.querySelectorAll('.story-dynasty-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 激活对应的故事朝代按钮
                const storyDynastyBtn = document.querySelector(`.story-dynasty-btn[data-dynasty="${dynasty}"]`);
                if (storyDynastyBtn) {
                    storyDynastyBtn.classList.add('active');
                    
                    // 触发朝代切换
                    // 隐藏所有朝代故事
                    document.querySelectorAll('.dynasty-stories').forEach(stories => {
                        stories.classList.add('hidden');
                    });
                    
                    // 显示选中朝代的故事
                    const selectedStories = document.getElementById(`${dynasty}-stories`);
                    if (selectedStories) {
                        selectedStories.classList.remove('hidden');
                    } else {
                        // 如果没有对应朝代的故事，显示提示信息
                        const storiesContainer = document.querySelector('.stories-container');
                        storiesContainer.innerHTML = `
                            <div class="bg-white rounded-lg shadow-md p-6">
                                <h2 class="text-2xl font-bold mb-4 text-dark">暂无数据</h2>
                                <p class="text-gray-600">该朝代的历史小故事数据正在整理中，敬请期待！</p>
                            </div>
                        `;
                    }
                    
                    // 更新导航按钮状态
                    updateNavButtons(dynasty);
                }
            }
        });
    });
}

// 根据朝代获取时期
function getPeriodByDynasty(dynasty) {
    const periodMap = {
        'xia': 'ancient',
        'shang': 'ancient',
        'zhou': 'early',
        'qin': 'early',
        'han': 'early',
        'three_kingdoms': 'early',
        'jin': 'early',
        'southern_northern': 'early',
        'sui': 'early',
        'tang': 'middle',
        'five_dynasties': 'middle',
        'song': 'middle',
        'yuan': 'late',
        'ming': 'late',
        'qing': 'late'
    };
    
    return periodMap[dynasty] || 'all';
}

// 初始化朝代事件数据
function initDynastyEventsData() {
    console.log('初始化朝代事件数据...');
    console.log('dynastyData:', dynastyData);
    
    // 遍历所有朝代
    for (const dynasty in dynastyData) {
        const data = dynastyData[dynasty];
        const container = document.getElementById(`${dynasty}-events`);
        
        console.log(`处理朝代: ${dynasty}`);
        console.log(`朝代数据:`, data);
        console.log(`容器元素:`, container);
        
        if (container && data && data.events && data.events.length > 0) {
            console.log(`朝代 ${dynasty} 有 ${data.events.length} 个事件`);
            
            // 创建朝代事件容器
            let content = `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-bold mb-4 text-dark">${data.title}大事纪</h2>
                    
                    <div class="space-y-4">
            `;
            
            // 添加事件卡片
            data.events.forEach(event => {
                const safeTitle = encodeURIComponent(event.event);
                const safeYear = encodeURIComponent(event.year);
                content += `
                    <div class="event-card p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-semibold text-primary">${event.event}</h3>
                            <div class="flex items-center gap-3">
                                <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm" onclick="aiTellStory('${dynasty}', '${safeTitle}', '${safeYear}')">AI讲故事</button>
                                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${event.year}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            // 关闭容器
            content += `
                    </div>
                </div>
            `;
            
            // 设置容器内容
            container.innerHTML = content;
            console.log(`朝代 ${dynasty} 事件已渲染到页面`);
        } else {
            console.log(`朝代 ${dynasty} 没有事件数据或容器不存在`);
        }
    }
}

// 事件到故事索引映射
let eventStoryIndexMap = {};

function normalizeText(str) {
    return (str || '')
        .toLowerCase()
        .replace(/[\s\u3000]/g, '')
        .replace(/[\-_,.，。！？!?:：；;“”"'‘’\(\)（）]/g, '');
}

async function buildEventStoryIndexMap() {
    eventStoryIndexMap = {};
    const dynasties = Object.keys(dynastyData || {});
    await Promise.all(dynasties.map(async (dynasty) => {
        const events = (dynastyData[dynasty]?.events) || [];
        const stories = (storyData[dynasty]) || [];
        const titleToIndex = {};
        stories.forEach((s, idx) => { titleToIndex[normalizeText(s.title)] = idx; });
        const map = {};
        events.forEach(ev => {
            const key = normalizeText(ev.event);
            if (titleToIndex[key] !== undefined) {
                map[ev.event] = titleToIndex[key];
            } else {
                // 尝试包含匹配
                const match = stories.findIndex(s => normalizeText(ev.event).includes(normalizeText(s.title)) || normalizeText(s.title).includes(normalizeText(ev.event)));
                if (match !== -1) map[ev.event] = match;
            }
        });
        eventStoryIndexMap[dynasty] = map;
    }));
    console.log('事件-故事索引映射已构建:', eventStoryIndexMap);
}

function openEventDetail(dynasty, encodedTitle, encodedYear) {
    const title = decodeURIComponent(encodedTitle || '');
    const year = decodeURIComponent(encodedYear || '');
    const index = eventStoryIndexMap?.[dynasty]?.[title];
    if (index !== undefined) {
        showStoryDetails(dynasty, index);
        return;
    }
    // 无匹配故事时，使用故事模态展示基础信息
    const modal = document.getElementById('story-modal');
    const modalTitle = document.getElementById('story-modal-title');
    const modalContent = document.getElementById('story-modal-content');
    if (modal && modalTitle && modalContent) {
        modalTitle.textContent = `${title}`;
        modalContent.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-semibold text-gray-700">事件详情</h4>
                </div>
                <p class="text-gray-600">暂无匹配的故事详情，后续将补充该事件的详解。</p>
            </div>
        `;
        modalContent.classList.add('relative');
        const headerPlayBtn2 = document.getElementById('play-story');
        if (headerPlayBtn2) {
            headerPlayBtn2.className = 'play-button w-10 h-10 rounded-full bg-primary text-white flex items中心 justify-center shadow-lg hover:bg-blue-700 transition-colors';
            headerPlayBtn2.innerHTML = '<i class="fa fa-volume-up"></i>';
            const holder2 = document.createElement('div');
            holder2.className = 'absolute top-2 right-2';
            holder2.appendChild(headerPlayBtn2);
            modalContent.appendChild(holder2);
        }
        modal.classList.remove('hidden');
    }
}

async function aiTellStory(dynasty, encodedTitle, encodedYear) {
    const title = decodeURIComponent(encodedTitle || '');
    const year = decodeURIComponent(encodedYear || '');
    const index = eventStoryIndexMap?.[dynasty]?.[title];
    let text = '';
    if (index !== undefined && storyData[dynasty] && storyData[dynasty][index]) {
        const story = storyData[dynasty][index];
        text = `${story.title}。${story.content}。寓意：${story.moral}`;
    } else {
        text = `${year ? year + '年，' : ''}${title}`;
    }
    await sendToDoubao(text, { dynasty, title, year });
}

async function sendToDoubao(text, meta) {
    const cfg = window.DOUBAO_CONFIG || {};
    const endpoint = cfg.endpoint;
    const apiKey = cfg.apiKey;
    const chat = document.getElementById('chat-container');
    if (chat) {
        const userHTML = `
            <div class="flex justify-end mb-4">
                <div class="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                    <p>请讲述：${meta?.title || '事件'}</p>
                </div>
            </div>
        `;
        chat.insertAdjacentHTML('beforeend', userHTML);
    }
    if (endpoint && apiKey) {
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({ prompt: text, meta })
            });
            const data = await res.json();
            const reply = (data && (data.reply || data.text || data.content)) || text;
            if (chat) {
                const aiHTML = `
                    <div class="flex mb-4">
                        <div class="bg-blue-100 rounded-lg p-3 max-w-[80%]">
                            <p class="text-gray-800">${reply}</p>
                        </div>
                    </div>
                `;
                chat.insertAdjacentHTML('beforeend', aiHTML);
                chat.scrollTop = chat.scrollHeight;
            }
            speakText(reply, meta?.title || 'AI讲故事', '豆包讲述');
            return;
        } catch (e) {}
    }
    if (chat) {
        const aiHTML = `
            <div class="flex mb-4">
                <div class="bg-blue-100 rounded-lg p-3 max-w-[80%]">
                    <p class="text-gray-800">${text}</p>
                </div>
            </div>
        `;
        chat.insertAdjacentHTML('beforeend', aiHTML);
        chat.scrollTop = chat.scrollHeight;
    }
    speakText(text, meta?.title || 'AI讲故事', '本地讲述');
}

// 初始化朝代筛选
function initDynastyEventsFilter() {
    document.querySelectorAll('.dynasty-btn').forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            document.querySelectorAll('.dynasty-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            const dynasty = this.getAttribute('data-dynasty');
            
            // 隐藏所有朝代事件
            document.querySelectorAll('.dynasty-events').forEach(events => {
                events.classList.add('hidden');
            });
            
            // 显示选中朝代的事件
            const selectedEvents = document.getElementById(`${dynasty}-events`);
            if (selectedEvents) {
                selectedEvents.classList.remove('hidden');
                // 渲染选中朝代的事件
                renderEvents(dynasty);
            } else {
                // 如果没有对应朝代的事件，显示提示信息
                const eventsContainer = document.querySelector('.events-container');
                eventsContainer.innerHTML = `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h2 class="text-2xl font-bold mb-4 text-dark">暂无数据</h2>
                        <p class="text-gray-600">该朝代的历史事件数据正在整理中，敬请期待！</p>
                    </div>
                `;
            }
        });
    });
}

// 更新导航按钮状态
function updateNavButtons(currentDynasty) {
    const currentIndex = dynastyOrder.indexOf(currentDynasty);
    const prevButton = document.getElementById('prev-dynasty');
    const nextButton = document.getElementById('next-dynasty');
    
    // 更新上一个朝代按钮状态
    if (currentIndex === 0) {
        prevButton.disabled = true;
        prevButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        prevButton.disabled = false;
        prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    // 更新下一个朝代按钮状态
    if (currentIndex === dynastyOrder.length - 1) {
        nextButton.disabled = true;
        nextButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        nextButton.disabled = false;
        nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// 初始化历史小故事筛选
function initStoryFilter() {
    // 使用全局 dynastyOrder
    // 朝代按钮点击事件
    document.querySelectorAll('.story-dynasty-btn').forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            document.querySelectorAll('.story-dynasty-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            const dynasty = this.getAttribute('data-dynasty');
            
            // 隐藏所有朝代故事
            document.querySelectorAll('.dynasty-stories').forEach(stories => {
                stories.classList.add('hidden');
            });
            
            // 显示选中朝代的故事
            const selectedStories = document.getElementById(`${dynasty}-stories`);
            if (selectedStories) {
                selectedStories.classList.remove('hidden');
                // 渲染选中朝代的故事
                renderStories(dynasty);
            } else {
                // 如果没有对应朝代的故事，显示提示信息
                const storiesContainer = document.querySelector('.stories-container');
                storiesContainer.innerHTML = `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h2 class="text-2xl font-bold mb-4 text-dark">暂无数据</h2>
                        <p class="text-gray-600">该朝代的历史小故事数据正在整理中，敬请期待！</p>
                    </div>
                `;
            }
            
            // 更新导航按钮状态
            updateNavButtons(dynasty);
        });
    });
    
    // 上一个朝代按钮点击事件
    document.getElementById('prev-dynasty').addEventListener('click', function() {
        const currentDynasty = getCurrentDynasty();
        const currentIndex = dynastyOrder.indexOf(currentDynasty);
        
        if (currentIndex > 0) {
            const prevDynasty = dynastyOrder[currentIndex - 1];
            const prevButton = document.querySelector(`.story-dynasty-btn[data-dynasty="${prevDynasty}"]`);
            if (prevButton) {
                // 移除所有按钮的active类
                document.querySelectorAll('.story-dynasty-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 添加当前按钮的active类
                prevButton.classList.add('active');
                
                // 触发朝代切换
                const dynasty = prevButton.getAttribute('data-dynasty');
                
                // 隐藏所有朝代故事
                document.querySelectorAll('.dynasty-stories').forEach(stories => {
                    stories.classList.add('hidden');
                });
                
                // 显示选中朝代的故事
                const selectedStories = document.getElementById(`${dynasty}-stories`);
                if (selectedStories) {
                    selectedStories.classList.remove('hidden');
                    // 渲染选中朝代的故事
                    renderStories(dynasty);
                } else {
                    // 如果没有对应朝代的故事，显示提示信息
                    const storiesContainer = document.querySelector('.stories-container');
                    storiesContainer.innerHTML = `
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h2 class="text-2xl font-bold mb-4 text-dark">暂无数据</h2>
                            <p class="text-gray-600">该朝代的历史小故事数据正在整理中，敬请期待！</p>
                        </div>
                    `;
                }
                
                // 更新导航按钮状态
                updateNavButtons(dynasty);
            }
        }
    });
    
    // 下一个朝代按钮点击事件
    document.getElementById('next-dynasty').addEventListener('click', function() {
        const currentDynasty = getCurrentDynasty();
        const currentIndex = dynastyOrder.indexOf(currentDynasty);
        
        if (currentIndex < dynastyOrder.length - 1) {
            const nextDynasty = dynastyOrder[currentIndex + 1];
            const nextButton = document.querySelector(`.story-dynasty-btn[data-dynasty="${nextDynasty}"]`);
            if (nextButton) {
                // 移除所有按钮的active类
                document.querySelectorAll('.story-dynasty-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 添加当前按钮的active类
                nextButton.classList.add('active');
                
                // 触发朝代切换
                const dynasty = nextButton.getAttribute('data-dynasty');
                
                // 隐藏所有朝代故事
                document.querySelectorAll('.dynasty-stories').forEach(stories => {
                    stories.classList.add('hidden');
                });
                
                // 显示选中朝代的故事
                const selectedStories = document.getElementById(`${dynasty}-stories`);
                if (selectedStories) {
                    selectedStories.classList.remove('hidden');
                    // 渲染选中朝代的故事
                    renderStories(dynasty);
                } else {
                    // 如果没有对应朝代的故事，显示提示信息
                    const storiesContainer = document.querySelector('.stories-container');
                    storiesContainer.innerHTML = `
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h2 class="text-2xl font-bold mb-4 text-dark">暂无数据</h2>
                            <p class="text-gray-600">该朝代的历史小故事数据正在整理中，敬请期待！</p>
                        </div>
                    `;
                }
                
                // 更新导航按钮状态
                updateNavButtons(dynasty);
            }
        }
    });
    
    // 获取当前选中的朝代
    function getCurrentDynasty() {
        const activeButton = document.querySelector('.story-dynasty-btn.active');
        return activeButton ? activeButton.getAttribute('data-dynasty') : 'xia';
    }
    
    // 初始化导航按钮状态
    updateNavButtons('xia');
}

// 初始化模态框
function initModal() {
    // 关闭模态框
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('dynasty-modal').classList.add('hidden');
    });
    
    // 点击模态框外部关闭
    document.getElementById('dynasty-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
}

// 初始化语音合成功能
function setupTextToSpeechUI() {
    addAudioButtonsToModules();
    document.addEventListener('click', function(e) {
        const playBtn = e.target.closest('.play-audio-btn');
        if (playBtn) {
            const text = playBtn.getAttribute('data-text');
            if (text) {
                stopSpeech();
                speakText(text);
            }
            return;
        }
        const stopBtn = e.target.closest('.stop-audio-btn');
        if (stopBtn) {
            stopSpeech();
            const container = stopBtn.closest('.text-to-speech-container');
            if (container) {
                const pb = container.querySelector('.play-audio-btn');
                if (pb) {
                    pb.innerHTML = '<i class="fa fa-volume-up"></i>';
                    pb.classList.remove('bg-red-500');
                    pb.classList.add('bg-primary');
                }
            }
        }
    });
    standardizePlayButtons();
    const playStoryHeader = document.getElementById('play-story');
    if (playStoryHeader) {
        playStoryHeader.addEventListener('click', function() {
            const title = document.getElementById('story-modal-title')?.textContent || '故事';
            const body = document.getElementById('story-modal-content');
            if (!body) return;
            const ps = Array.from(body.querySelectorAll('p')).map(p => p.textContent).filter(Boolean);
            const text = ps.join('。');
            speakText(text, title, '历史小故事');
        });
    }
}

// 动态添加语音播放按钮到各个模块
function addAudioButtonsToModules() {
    console.log('动态添加语音播放按钮到各个模块...');
    
    // 为制度演变添加语音播放按钮
    addAudioButtonsToInstitutionEvolution();
    
    // 为对外条约添加语音播放按钮
    addAudioButtonsToForeignTreaties();
}

// 为历史朝代歌添加语音播放按钮
function addAudioButtonToDynastySong() {
    const dynastySongSection = document.getElementById('dynasty-song');
    if (!dynastySongSection) return;
    
    // 人教版经典朝代歌
    const renJiaoDynastySong = dynastySongSection.querySelector('.bg-blue-50 p.text-center:last-child');
    if (renJiaoDynastySong) {
        const text = renJiaoDynastySong.textContent.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
        const button = createAudioButton(text, '播放朝代歌');
        
        // 在朝代歌上方添加按钮
        const parentDiv = renJiaoDynastySong.parentElement;
        const title = parentDiv.querySelector('p.text-lg');
        
        if (title) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'flex justify-center mb-2';
            buttonContainer.appendChild(button);
            // 将按钮插入到诗歌段落之前，避免引用非直接子节点导致的错误
            parentDiv.insertBefore(buttonContainer, renJiaoDynastySong);
        }
    }
    
    // 苏教版朝代歌
    const suJiaoDynastySong = dynastySongSection.querySelector('.bg-green-50 p.text-center');
    if (suJiaoDynastySong) {
        const text = suJiaoDynastySong.textContent.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
        const button = createAudioButton(text, '播放朝代歌');
        
        // 在朝代歌上方添加按钮
        const parentDiv = suJiaoDynastySong.parentElement;
        const title = parentDiv.previousElementSibling;
        
        if (title && title.tagName === 'H3') {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'flex justify-center mb-2';
            buttonContainer.appendChild(button);
            parentDiv.insertBefore(buttonContainer, parentDiv.firstChild);
        }
    }
    
    // 简易版朝代歌
    const simpleDynastySong = dynastySongSection.querySelector('.bg-yellow-50 p.text-center');
    if (simpleDynastySong) {
        const text = simpleDynastySong.textContent.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
        const button = createAudioButton(text, '播放朝代歌');
        
        // 在朝代歌上方添加按钮
        const parentDiv = simpleDynastySong.parentElement;
        const title = parentDiv.previousElementSibling;
        
        if (title && title.tagName === 'H3') {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'flex justify-center mb-2';
            buttonContainer.appendChild(button);
            parentDiv.insertBefore(buttonContainer, parentDiv.firstChild);
        }
    }
    
    // 网络流行版朝代歌
    const popularDynastySong = dynastySongSection.querySelector('.bg-purple-50 p.text-center');
    if (popularDynastySong) {
        const text = popularDynastySong.textContent.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
        const button = createAudioButton(text, '播放朝代歌');
        
        // 在朝代歌上方添加按钮
        const parentDiv = popularDynastySong.parentElement;
        const title = parentDiv.previousElementSibling;
        
        if (title && title.tagName === 'H3') {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'flex justify-center mb-2';
            buttonContainer.appendChild(button);
            parentDiv.insertBefore(buttonContainer, parentDiv.firstChild);
        }
    }
}

// 为制度演变添加语音播放按钮
function addAudioButtonsToInstitutionEvolution() {
    const institutionSection = document.getElementById('institution-evolution');
    if (!institutionSection) return;
    
    // 为每个表格添加语音播放按钮
    const tables = institutionSection.querySelectorAll('table');
    tables.forEach((table, index) => {
        const title = table.closest('.bg-white').querySelector('h2, h3');
        if (!title) return;
        
        // 提取表格内容文本
        let text = title.textContent + '。';
        
        // 提取表头
        const headers = table.querySelectorAll('thead th');
        headers.forEach(header => {
            text += header.textContent + '，';
        });
        
        // 提取表格内容
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, cellIndex) => {
                if (cellIndex > 0) { // 跳过第一列（朝代）
                    text += cell.textContent + '。';
                }
            });
        });
        
        const policyName = (title.textContent || '').trim();
        const playBtn = createAudioButton(text, '播放内容');
        const aiBtn = document.createElement('button');
        aiBtn.className = 'ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm';
        aiBtn.textContent = 'AI讲制度';
        aiBtn.addEventListener('click', () => aiTellInstitution(policyName));
        const titleRow = document.createElement('div');
        titleRow.className = 'flex items-center justify-between';
        const actions = document.createElement('div');
        actions.className = 'flex items-center';
        actions.appendChild(playBtn);
        actions.appendChild(aiBtn);
        title.parentNode.insertBefore(titleRow, title);
        titleRow.appendChild(title);
        titleRow.appendChild(actions);
    });
}

async function aiTellInstitution(policyName) {
    const name = (policyName || '').trim();
    const prompt = name
        ? `请以通俗生动的方式讲解“${name}”，包含起源、核心机制、代表朝代、影响与演变，并配上简短历史故事。`
        : '请讲解这一制度的起源与演变';
    await sendToDoubao(prompt, { type: 'institution', policy: name });
}

// 为对外条约添加语音播放按钮
function addAudioButtonsToForeignTreaties() {
    const treatiesSection = document.getElementById('foreign-treaties');
    if (!treatiesSection) return;
    
    // 为每个条约卡片添加语音播放按钮
    const treatyCards = treatiesSection.querySelectorAll('.treaty-card');
    treatyCards.forEach(card => {
        const title = card.querySelector('h3');
        const content = card.querySelector('p.text-gray-600');
        
        if (title && content) {
            const text = title.textContent + '。' + content.textContent;
            const button = createAudioButton(text, '播放详情');
            
            // 在标题旁边添加按钮
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'ml-2';
            buttonContainer.appendChild(button);
            
            // 将标题和按钮放在同一行
            const titleContainer = document.createElement('div');
            titleContainer.className = 'flex items-center justify-between';
            
            // 移动标题到新容器
            title.parentNode.insertBefore(titleContainer, title);
            titleContainer.appendChild(title);
            titleContainer.appendChild(buttonContainer);
        }
    });
}

// 创建语音播放按钮
function createAudioButton(text, buttonText) {
    const button = document.createElement('button');
    button.className = 'play-audio-btn';
    button.setAttribute('data-text', text);
    button.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10v4h4l5 4V6L7 10H3zm13 2a3 3 0 0 0-1.73-2.73v5.46A3 3 0 0 0 16 12zm-1.73-7.5v2.06A6 6 0 0 1 19 12a6 6 0 0 1-4.73 5.44v2.06A8.01 8.01 0 0 0 21 12a8.01 8.01 0 0 0-6.73-7.5z"/>
      </svg>`;
    return button;
}

// 全局变量存储语音合成实例
let speechSynthesisInstance = null;
let currentSpeechContainer = null;

// 语音合成函数
function speakTextInContainer(text, container) {
    // 检查浏览器是否支持语音合成
    if (!('speechSynthesis' in window)) {
        alert('您的浏览器不支持语音合成功能，请使用Chrome、Edge或Safari浏览器。');
        return;
    }
    
    // 创建语音合成实例
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = 'zh-CN'; // 设置为中文
    
    // 尝试使用女声
    const voices = window.speechSynthesis.getVoices();
    const chineseVoices = voices.filter(voice => voice.lang.includes('zh'));
    
    if (chineseVoices.length > 0) {
        // 优先选择女声
        const femaleVoice = chineseVoices.find(voice => voice.name.includes('女') || voice.name.includes('Female'));
        if (femaleVoice) {
            speech.voice = femaleVoice;
        } else {
            speech.voice = chineseVoices[0];
        }
    }
    
    // 设置语音合成实例
    speechSynthesisInstance = speech;
    currentSpeechContainer = container;
    
    // 获取播放按钮
    const playButton = container.querySelector('.play-audio-btn');
    
    // 语音播放开始事件
    speech.onstart = function() {
        if (playButton) {
            playButton.innerHTML = '<i class="fa fa-stop mr-1"></i> 停止';
            playButton.classList.remove('bg-primary');
            playButton.classList.add('bg-red-500');
        }
    };
    
    // 语音播放结束事件
    speech.onend = function() {
        if (playButton) {
            playButton.innerHTML = '<i class="fa fa-volume-up mr-1"></i> 播放';
            playButton.classList.remove('bg-red-500');
            playButton.classList.add('bg-primary');
        }
        speechSynthesisInstance = null;
        currentSpeechContainer = null;
    };
    
    // 语音播放错误事件
    speech.onerror = function(event) {
        console.error('语音合成错误:', event.error);
        if (playButton) {
            playButton.innerHTML = '<i class="fa fa-volume-up mr-1"></i> 播放';
            playButton.classList.remove('bg-red-500');
            playButton.classList.add('bg-primary');
        }
        speechSynthesisInstance = null;
        currentSpeechContainer = null;
    };
    
    // 开始语音播放
    window.speechSynthesis.speak(speech);
}

// 停止语音播放函数
function stopSpeech() {
    if (speechSynthesisInstance) {
        window.speechSynthesis.cancel();
        speechSynthesisInstance = null;
        
        // 重置当前播放容器的按钮状态
        if (currentSpeechContainer) {
            const playButton = currentSpeechContainer.querySelector('.play-audio-btn');
            if (playButton) {
                playButton.innerHTML = '<i class="fa fa-volume-up mr-1"></i> 播放';
                playButton.classList.remove('bg-red-500');
                playButton.classList.add('bg-primary');
            }
            currentSpeechContainer = null;
        }
    }
}

// 初始化对外条约
function initForeignTreaties() {
    // 条约类型筛选
    document.querySelectorAll('.treaty-filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            document.querySelectorAll('.treaty-filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // 筛选条约卡片
            document.querySelectorAll('.treaty-card').forEach(card => {
                if (filter === 'all' || card.getAttribute('data-type') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // 国家筛选
    document.querySelectorAll('.country-filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            document.querySelectorAll('.country-filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            const country = this.getAttribute('data-country');
            
            // 筛选条约卡片
            document.querySelectorAll('.treaty-card').forEach(card => {
                if (country === 'all' || card.getAttribute('data-country') === country) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // 筛选时间轴项
            document.querySelectorAll('.timeline-item[data-treaty]').forEach(item => {
                const treatyId = item.getAttribute('data-treaty');
                const treatyCard = document.querySelector(`.treaty-card[data-treaty="${treatyId}"]`);
                
                if (treatyCard && treatyCard.style.display !== 'none') {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // 时间轴点击事件
    document.querySelectorAll('.timeline-item[data-treaty]').forEach(item => {
        item.addEventListener('click', function() {
            const treaty = this.getAttribute('data-treaty');
            
            // 滚动到对应的条约卡片
            const treatyCard = document.querySelector(`.treaty-card[data-treaty="${treaty}"]`);
            if (treatyCard) {
                treatyCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // 高亮显示对应的条约卡片
                document.querySelectorAll('.treaty-card').forEach(card => {
                    card.classList.remove('ring-2', 'ring-primary');
                });
                treatyCard.classList.add('ring-2', 'ring-primary');
            }
        });
    });
}

// 初始化AI助手
function initAIAssistant() {
    // 发送问题按钮点击事件
    document.getElementById('send-question')?.addEventListener('click', sendQuestion);
    
    // 输入框回车事件
    document.getElementById('user-question')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendQuestion();
        }
    });
    
    // 推荐问题点击事件
    document.querySelectorAll('.recommended-question').forEach(button => {
        button.addEventListener('click', function() {
            const question = this.textContent;
            document.getElementById('user-question').value = question;
            sendQuestion();
        });
    });
}

// 显示指定内容区域
function showSection(sectionId) {
    // 隐藏所有内容区域
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // 显示目标内容区域
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // 更新菜单项的激活状态
    document.querySelectorAll('.sidebar-menu-item, .sidebar-submenu-item').forEach(menuItem => {
        menuItem.classList.remove('sidebar-active');
    });
    
    // 激活对应的菜单项
    const activeMenuItem = document.querySelector(`.sidebar-menu-item[data-target="${sectionId}"], .sidebar-submenu-item[data-target="${sectionId}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('sidebar-active');
        
        // 如果是子菜单项，展开其父菜单
        if (activeMenuItem.classList.contains('sidebar-submenu-item')) {
            const parentMenuItem = activeMenuItem.closest('.sidebar-menu-group').querySelector('.sidebar-menu-item');
            if (parentMenuItem) {
                const submenuId = parentMenuItem.getAttribute('onclick').match(/'([^']+)'/)[1];
                const submenu = document.getElementById(`${submenuId}-submenu`);
                const arrow = document.getElementById(`${submenuId}-arrow`);
                
                if (submenu && arrow) {
                    submenu.classList.remove('hidden');
                    arrow.style.transform = 'rotate(180deg)';
                }
            }
        }
    }
    
    // 清除所有按钮的active类
    document.querySelectorAll('.dynasty-filter-btn, .dynasty-btn, .story-dynasty-btn').forEach(button => {
        button.classList.remove('active');
    });
    
    // 清除所有朝代卡片的高亮状态
    document.querySelectorAll('.dynasty-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-primary');
    });
    
    // 添加延迟，确保在清除按钮active类后再设置当前页面的默认按钮
    setTimeout(() => {
        console.log(`当前页面: ${sectionId}`);
        
        // 根据当前页面设置默认选中的按钮
        if (sectionId === 'dynasty-culture') {
            // 朝代传承页面，默认选中"全部"按钮
            const allBtn = document.querySelector('.dynasty-filter-btn[data-filter="all"]');
            if (allBtn) {
                allBtn.classList.add('active');
                console.log('朝代传承页面 - 默认选中"全部"按钮');
            }
        } else if (sectionId === 'dynasty-events') {
            // 朝代大事纪页面，默认选中第一个朝代按钮
            const firstDynastyBtn = document.querySelector('.dynasty-btn');
            if (firstDynastyBtn) {
                firstDynastyBtn.classList.add('active');
                console.log('朝代大事纪页面 - 默认选中第一个朝代按钮');
                
                // 触发朝代切换
                const dynasty = firstDynastyBtn.getAttribute('data-dynasty');
                console.log(`选中的朝代: ${dynasty}`);
                
                // 隐藏所有朝代事件
                document.querySelectorAll('.dynasty-events').forEach(events => {
                    events.classList.add('hidden');
                });
                
                // 显示选中朝代的事件
                const selectedEvents = document.getElementById(`${dynasty}-events`);
                if (selectedEvents) {
                    selectedEvents.classList.remove('hidden');
                    console.log(`显示朝代 ${dynasty} 的事件`);
                } else {
                    console.log(`朝代 ${dynasty} 的事件容器不存在`);
                }
            } else {
                console.log('朝代大事纪页面 - 没有找到朝代按钮');
            }
        } else if (sectionId === 'historical-stories') {
            // 历史小故事页面，默认选中第一个朝代按钮
            const firstStoryBtn = document.querySelector('.story-dynasty-btn');
            if (firstStoryBtn) {
                firstStoryBtn.classList.add('active');
                console.log('历史小故事页面 - 默认选中第一个朝代按钮');
                
                // 触发朝代切换
                const dynasty = firstStoryBtn.getAttribute('data-dynasty');
                console.log(`选中的朝代: ${dynasty}`);
                
                // 隐藏所有朝代故事
                document.querySelectorAll('.dynasty-stories').forEach(stories => {
                    stories.classList.add('hidden');
                });
                
                // 显示选中朝代的故事
                const selectedStories = document.getElementById(`${dynasty}-stories`);
                if (selectedStories) {
                    selectedStories.classList.remove('hidden');
                    console.log(`显示朝代 ${dynasty} 的故事`);
                } else {
                    console.log(`朝代 ${dynasty} 的故事容器不存在`);
                }
                
                // 更新导航按钮状态
                updateNavButtons(dynasty);
            } else {
                console.log('历史小故事页面 - 没有找到朝代按钮');
            }
        }
    }, 10);
}

// 朝代详情模态框
function showDynastyDetails(dynasty) {
    const modal = document.getElementById('dynasty-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    // 获取选中朝代的数据
    const data = dynastyData[dynasty];
    
    if (!data) return;
    
    // 设置模态框标题
    modalTitle.textContent = data.title;
    
    // 构建模态框内容
    let content = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-gray-50 p-3 rounded-lg">
                <h4 class="font-semibold text-gray-700 mb-1">时期</h4>
                <p class="text-gray-600">${data.period}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
                <h4 class="font-semibold text-gray-700 mb-1">历时</h4>
                <p class="text-gray-600">${data.duration}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
                <h4 class="font-semibold text-gray-700 mb-1">开国皇帝</h4>
                <p class="text-gray-600">${data.founder}</p>
            </div>
        </div>
        
        <div class="mb-6">
            <h4 class="font-semibold text-gray-700 mb-2">都城</h4>
            <p class="text-gray-600">${data.capital}</p>
        </div>
        
        <div class="mb-6 text-to-speech-container">
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-semibold text-gray-700">朝代简介</h4>
                <div class="flex gap-2">
                    <button class="play-audio-btn px-3 py-1 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors" data-text="${data.description}">
                        <i class="fa fa-volume-up mr-1"></i> 播放
                    </button>
                </div>
            </div>
            <p class="text-gray-600">${data.description}</p>
        </div>
        
        <div class="mb-6 text-to-speech-container">
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-semibold text-gray-700">主要成就</h4>
                <div class="flex gap-2">
                    <button class="play-audio-btn px-3 py-1 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors" data-text="${data.achievements.join('。')}">
                        <i class="fa fa-volume-up mr-1"></i> 播放
                    </button>
                </div>
            </div>
            <ul class="list-disc list-inside text-gray-600 space-y-1">
                ${data.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
        </div>
        
        <div class="mb-6">
            <h4 class="font-semibold text-gray-700 mb-2">重要历史人物</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${data.figures.map(figure => `
                    <div class="bg-gray-50 p-3 rounded-lg text-to-speech-container">
                        <div class="flex justify-between items-center mb-1">
                            <h5 class="font-medium text-gray-700">${figure.name}</h5>
                            <button class="play-audio-btn px-2 py-0.5 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors text-xs" data-text="${figure.description}">
                                <i class="fa fa-volume-up mr-0.5"></i> 播放
                            </button>
                        </div>
                        <p class="text-gray-500 text-sm">${figure.title}</p>
                        <p class="text-gray-600 text-sm mt-1">${figure.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="text-to-speech-container">
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-semibold text-gray-700">重要历史事件</h4>
                <div class="flex gap-2">
                    <button class="play-audio-btn px-3 py-1 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors" data-text="${data.events.map(event => `${event.year}年，${event.event}`).join('。')}">
                        <i class="fa fa-volume-up mr-1"></i> 播放
                    </button>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">年份</th>
                            <th class="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">事件</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.events.map(event => `
                            <tr>
                                <td class="py-2 px-4 border-b text-sm text-gray-600">${event.year}</td>
                                <td class="py-2 px-4 border-b text-sm text-gray-600">${event.event}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // 设置模态框内容
    modalContent.innerHTML = content;
    modalContent.classList.add('relative');
    const headerPlayBtn = document.getElementById('play-story');
    if (headerPlayBtn) {
        headerPlayBtn.className = 'play-button w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors';
        headerPlayBtn.innerHTML = '<i class="fa fa-volume-up"></i>';
        const holder = document.createElement('div');
        holder.className = 'absolute top-2 right-2';
        holder.appendChild(headerPlayBtn);
        modalContent.appendChild(holder);
    }
    
    // 显示模态框
    modal.classList.remove('hidden');
}

// AI历史问答功能
function sendQuestion() {
    const userQuestion = document.getElementById('user-question');
    const chatContainer = document.getElementById('chat-container');
    
    if (!userQuestion || !chatContainer) return;
    
    const question = userQuestion.value.trim();
    
    if (question === '') return;
    
    // 添加用户问题到聊天窗口
    const userMessageHTML = `
        <div class="flex justify-end mb-4">
            <div class="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                <p>${question}</p>
            </div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', userMessageHTML);
    
    // 清空输入框
    userQuestion.value = '';
    
    // 显示AI正在输入
    const typingHTML = `
        <div class="flex mb-4 ai-typing">
            <div class="bg-blue-100 rounded-lg p-3 max-w-[80%]">
                <p class="text-gray-800">
                    <span class="typing-dots">AI正在思考</span>
                    <span class="typing-dots">...</span>
                </p>
            </div>
        </div>
    `;
    chatContainer.insertAdjacentHTML('beforeend', typingHTML);
    
    // 滚动到底部
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // 模拟AI回答（实际应用中应该调用后端API）
    setTimeout(() => {
        // 移除正在输入提示
        const typingElement = document.querySelector('.ai-typing');
        if (typingElement) {
            typingElement.remove();
        }
        
        // 根据问题生成回答
        let answer = getAIAnswer(question);
        
        // 添加AI回答到聊天窗口
        const aiMessageHTML = `
            <div class="flex mb-4">
                <div class="bg-blue-100 rounded-lg p-3 max-w-[80%]">
                    ${answer}
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', aiMessageHTML);
        
        // 滚动到底部
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1500);
}

// 模拟AI回答
function getAIAnswer(question) {
    // 简单的关键词匹配
    question = question.toLowerCase();
    
    if (question.includes('丝绸之路')) {
        return `
            <p class="text-gray-800"><strong>丝绸之路</strong>是连接中国与西方的古代商业贸易路线，始于西汉张骞出使西域。</p>
            <p class="text-gray-800 mt-2">主要特点：</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>全长约7000多公里，分为陆上丝绸之路和海上丝绸之路</li>
                <li>促进了东西方的商品贸易，如中国的丝绸、瓷器、茶叶传到西方，西方的葡萄、胡萝卜、玻璃制品传入中国</li>
                <li>促进了东西方文化交流，佛教、伊斯兰教通过丝绸之路传入中国</li>
                <li>促进了科技传播，中国的造纸术、印刷术、火药通过丝绸之路传到西方</li>
            </ul>
        `;
    } else if (question.includes('王安石变法')) {
        return `
            <p class="text-gray-800"><strong>王安石变法</strong>是北宋神宗时期（1069年-1085年）由王安石主持的一系列社会改革。</p>
            <p class="text-gray-800 mt-2">主要内容：</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>青苗法：政府在青黄不接时向农民提供贷款，收获后偿还</li>
                <li>募役法：以钱代役，扩大税源</li>
                <li>方田均税法：重新丈量土地，按土地肥沃程度征税</li>
                <li>农田水利法：鼓励兴修水利，发展农业</li>
                <li>保甲法：建立基层治安组织，加强对人民的控制</li>
            </ul>
            <p class="text-gray-800 mt-2">变法触动了大地主、大官僚的利益，遭到强烈反对，最终失败。但变法在一定程度上增加了政府财政收入，促进了农业生产。</p>
        `;
    } else if (question.includes('鸦片战争')) {
        return `
            <p class="text-gray-800"><strong>鸦片战争</strong>（1840年-1842年）是英国对中国发动的侵略战争。</p>
            <p class="text-gray-800 mt-2">主要原因：</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>英国为解决对华贸易逆差，大量向中国走私鸦片</li>
                <li>林则徐虎门销烟，触犯了英国利益</li>
                <li>英国为打开中国市场，推行殖民扩张政策</li>
            </ul>
            <p class="text-gray-800 mt-2">战争结果：中国战败，被迫签订《南京条约》，这是中国近代史上第一个不平等条约。</p>
            <p class="text-gray-800 mt-2">主要影响：</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>中国开始沦为半殖民地半封建社会</li>
                <li>割让香港岛给英国</li>
                <li>开放广州、厦门、福州、宁波、上海五处为通商口岸</li>
                <li>赔款2100万银元</li>
                <li>中国社会开始发生深刻变化，开启了中国近代史</li>
            </ul>
        `;
    } else if (question.includes('三国') && question.includes('人物')) {
        return `
            <p class="text-gray-800"><strong>三国时期</strong>（220年-280年）是中国历史上魏、蜀、吴三个国家鼎立的时期。</p>
            <p class="text-gray-800 mt-2">主要人物：</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li><strong>曹操</strong>：魏国奠基者，政治家、军事家、文学家</li>
                <li><strong>刘备</strong>：蜀汉开国皇帝，以仁德著称</li>
                <li><strong>孙权</strong>：吴国开国皇帝，善于用人</li>
                <li><strong>诸葛亮</strong>：蜀汉丞相，杰出的政治家、军事家，辅佐刘备建立蜀汉</li>
                <li><strong>关羽</strong>：蜀汉大将，以忠义著称，五虎上将之首</li>
                <li><strong>张飞</strong>：蜀汉大将，勇猛过人，五虎上将之一</li>
                <li><strong>赵云</strong>：蜀汉大将，智勇双全，五虎上将之一</li>
                <li><strong>周瑜</strong>：吴国大都督，赤壁之战的主要指挥者</li>
                <li><strong>司马懿</strong>：魏国大臣，西晋奠基人</li>
            </ul>
            <p class="text-gray-800 mt-2">三国时期人才辈出，军事谋略层出不穷，是中国历史上最为精彩的时期之一，被罗贯中写入《三国演义》而广为人知。</p>
        `;
    } else if (question.includes('科举制度')) {
        return `
            <p class="text-gray-800"><strong>科举制度</strong>是中国古代通过考试选拔官吏的制度，始于隋朝，终于清朝光绪三十一年（1905年）。</p>
            <p class="text-gray-800 mt-2">主要特点：</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>打破了世族垄断官职的局面，为平民提供了上升通道</li>
                <li>考试内容主要是儒家经典，特别是四书五经</li>
                <li>考试分为多个等级：院试、乡试、会试、殿试</li>
                <li>殿试第一名称为状元，第二名称为榜眼，第三名称为探花</li>
            </ul>
            <p class="text-gray-800 mt-2">科举制度的积极影响：</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>促进了社会阶层流动，扩大了统治基础</li>
                <li>促进了教育普及，提高了官员文化素质</li>
                <li>促进了儒家文化的传播和发展</li>
            </ul>
            <p class="text-gray-800 mt-2">科举制度的消极影响：</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>考试内容僵化，束缚了知识分子的思想</li>
                <li>导致士人只重科举，轻视实用学问</li>
                <li>后期科举腐败现象严重</li>
            </ul>
        `;
    } else if (question.includes('长城')) {
        return `
            <p class="text-gray-800"><strong>长城</strong>始建于战国，秦始皇统一后连接各国旧长城，汉、明等历代均有修筑与维护。</p>
            <p class="text-gray-800 mt-2">修建历程与作用：</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>战国：各国为防御彼此修筑边墙</li>
                <li>秦：连接、延伸旧墙，形成万里长城雏形</li>
                <li>汉：西北方向延伸，用于保障丝绸之路安全</li>
                <li>明：体系最完备，防御北方势力南下</li>
                <li>军事防御、交通通信、边防管理与文化象征</li>
            </ul>
        `;
    } else if (question.includes('秦朝') && (question.includes('统一') || question.includes('制度'))) {
        return `
            <p class="text-gray-800"><strong>秦朝统一与制度建设</strong>奠定了中国古代中央集权的基础。</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>郡县制：废分封、实行中央派遣官吏管理地方</li>
                <li>统一度量衡、货币、车轨：促进经济与交通一体化</li>
                <li>书同文：以小篆为标准，后推行隶书，提升行政效率</li>
                <li>法律制度：以法家思想治国，严刑峻法维持秩序</li>
            </ul>
        `;
    } else if (question.includes('汉武帝')) {
        return `
            <p class="text-gray-800"><strong>汉武帝</strong>改革内政、扩张外交，奠定汉朝盛世。</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>推恩令：削弱诸侯王势力，加强中央集权</li>
                <li>盐铁官营：增强财政与国家控制力</li>
                <li>罢黜百家、独尊儒术：确立儒学为意识形态</li>
                <li>张骞出使西域、开通丝绸之路，打击匈奴</li>
            </ul>
        `;
    } else if (question.includes('唐朝') && question.includes('科举')) {
        return `
            <p class="text-gray-800"><strong>唐朝科举</strong>在隋创科举基础上完善，进士科成为主流。</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>考试科目以儒学经义、诗赋为主</li>
                <li>用人更重才学，弱化门第限制</li>
                <li>促进士人文化发展与社会流动</li>
            </ul>
        `;
    } else if (question.includes('宋朝') && (question.includes('经济') || question.includes('科技'))) {
        return `
            <p class="text-gray-800"><strong>宋朝经济与科技</strong>高度繁荣，城市商业与技术走在世界前列。</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>市民经济与手工业繁盛，商业税收重要</li>
                <li>交子等纸币流通，金融发展</li>
                <li>三大发明广泛应用：火药、印刷术、指南针</li>
            </ul>
        `;
    } else if (question.includes('元朝') && question.includes('行省')) {
        return `
            <p class="text-gray-800"><strong>元朝行省制度</strong>在全国设置行省以加强对地方的管理。</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>中央设中书省统辖全国政务</li>
                <li>地方设行省，行中书省掌民政、军政</li>
                <li>提高行政效率，形成后世省级建制源头</li>
            </ul>
        `;
    } else if (question.includes('明朝') && (question.includes('海禁') || question.includes('郑和'))) {
        return `
            <p class="text-gray-800"><strong>明朝海禁与郑和下西洋</strong>体现国策与对外交流的摇摆。</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>海禁：限制民间贸易与出海，维护边防与税制</li>
                <li>郑和七下西洋：传播国威、发展朝贡贸易</li>
                <li>影响：促进海上交通与文化交流，但未持续转向海上扩张</li>
            </ul>
        `;
    } else if (question.includes('清朝') && (question.includes('闭关') || question.includes('洋务'))) {
        return `
            <p class="text-gray-800"><strong>清朝闭关与洋务运动</strong>反映从保守到近代化尝试的转变。</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>闭关：限制对外交流，维护传统秩序</li>
                <li>鸦片战争后被迫开放、签订多项不平等条约</li>
                <li>洋务运动：自强求富，兴办近代工业与军工，成效有限</li>
            </ul>
        `;
    } else if (question.includes('太平天国')) {
        return `
            <p class="text-gray-800"><strong>太平天国运动</strong>是清中期的大规模农民战争。</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>原因：经济凋敝、赋税沉重、民族与宗教矛盾激化</li>
                <li>过程：定都天京，推行若干社会政策，与清军、湘淮军长期对峙</li>
                <li>影响：重创清廷财政与军政，促使后续洋务运动与地方势力上升</li>
            </ul>
        `;
    } else if (question.includes('戊戌变法')) {
        return `
            <p class="text-gray-800"><strong>戊戌变法</strong>是清末的维新改革尝试（1898）。</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>内容：设学堂、废科举八股、鼓励工商、改革官制</li>
                <li>失败原因：保守势力强大、触及既得利益、缺乏军权支持</li>
                <li>影响：启迪近代思想与制度改革，为后续变革提供经验</li>
            </ul>
        `;
    } else {
        return `
            <p class="text-gray-800">你好！我是你的历史AI助手，可以回答你关于中国历史的问题。</p>
            <p class="text-gray-800 mt-2">你可以问我：</p>
            <ul class="list-disc list-inside text-gray-800 mt-1">
                <li>中国历史朝代顺序</li>
                <li>重要历史事件的原因和影响</li>
                <li>历史人物的生平事迹</li>
                <li>文化制度的发展演变</li>
                <li>历史地理知识</li>
            </ul>
            <p class="text-gray-800 mt-2">请提出具体的历史问题，我会尽力为你解答。</p>
        `;
    }
}

// 初始化历史故事数据
function initStoryData() {
    console.log('初始化历史故事数据...');
    console.log('storyData:', storyData);
    
    // 遍历所有朝代
    for (const dynasty in storyData) {
        const data = storyData[dynasty];
        const container = document.getElementById(`${dynasty}-stories`);
        
        console.log(`处理朝代: ${dynasty}`);
        console.log(`朝代故事数据:`, data);
        console.log(`容器元素:`, container);
        
        if (container && data && data.length > 0) {
            console.log(`朝代 ${dynasty} 有 ${data.length} 个故事`);
            
            // 创建朝代故事容器
            let content = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            `;
            
            // 添加故事卡片
            data.forEach((story, index) => {
                content += `
                    <div class="story-card bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2 text-dark">${story.title}</h3>
                            <p class="text-gray-600 mb-4 line-clamp-3">${story.content.substring(0, 150)}...</p>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-500">寓意：${story.moral}</span>
                                <button onclick="showStoryDetails('${dynasty}', ${index})" class="text-primary hover:text-blue-700">查看全文</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            // 关闭容器
            content += `
                </div>
            `;
            
            // 设置容器内容
            container.innerHTML = content;
            console.log(`朝代 ${dynasty} 故事已渲染到页面`);
        } else {
            console.log(`朝代 ${dynasty} 没有故事数据或容器不存在`);
        }
    }
}

// 显示故事详情
function showStoryDetails(dynasty, index) {
    const modal = document.getElementById('story-modal');
    const modalTitle = document.getElementById('story-modal-title');
    const modalContent = document.getElementById('story-modal-content');
    
    // 获取选中故事的数据
    const story = storyData[dynasty][index];
    
    if (!story) return;
    
    // 设置模态框标题
    modalTitle.textContent = story.title;
    
    // 构建模态框内容
    let content = `
        <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-semibold text-gray-700">故事内容</h4>
            </div>
            <p class="text-gray-600">${story.content}</p>
        </div>
        
        <div>
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-semibold text-gray-700">故事寓意</h4>
            </div>
            <p class="text-gray-600">${story.moral}</p>
        </div>
    `;
    
    // 设置模态框内容
    modalContent.innerHTML = content;
    
    // 显示模态框
    modal.classList.remove('hidden');
}

// 关闭故事详情模态框
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

// 初始化语音播放功能
function initTextToSpeech() {
    console.log('初始化语音播放功能...');
    
    // 检查浏览器是否支持语音合成
    if ('speechSynthesis' in window) {
        console.log('浏览器支持语音合成');
        
        // 预加载语音
        setTimeout(() => {
            const testUtterance = new SpeechSynthesisUtterance('语音功能已就绪');
            testUtterance.lang = 'zh-CN';
            testUtterance.volume = 0.1; // 低音量测试
            synth.speak(testUtterance);
        }, 2000);
    } else {
        console.error('浏览器不支持语音合成');
        // 显示提示信息
        const alertElement = document.createElement('div');
        alertElement.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
        alertElement.innerHTML = `
            <div class="flex items-center">
                <i class="fa fa-exclamation-circle mr-2"></i>
                <span>您的浏览器不支持语音播放功能，请使用Chrome、Edge或Safari浏览器。</span>
            </div>
        `;
        document.body.appendChild(alertElement);
        
        // 3秒后自动关闭提示
        setTimeout(() => {
            alertElement.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => {
                document.body.removeChild(alertElement);
            }, 500);
        }, 3000);
    }
}

// 初始化音频控制界面
function initAudioControls() {
    console.log('初始化音频控制界面...');
    
    // 创建音频控制组件
    createAudioControlComponent();
    
    // 为故事卡片添加语音播放按钮
    addSpeechButtonsToStoryCards();
    
    // 为朝代详情模态框添加语音播放按钮
    addSpeechButtonToDynastyModal();
    
    // 为故事详情模态框添加语音播放按钮
    
    // 为AI问答添加语音播放按钮
    addSpeechButtonToAIAnswers();
}

// 创建音频控制组件
function createAudioControlComponent() {
    // 创建音频控制栏
    const audioControlBar = document.createElement('div');
    audioControlBar.id = 'audio-control-bar';
    audioControlBar.className = 'fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3 z-40 hidden';
    audioControlBar.innerHTML = `
        <div class="container mx-auto flex items-center justify-between">
            <div class="flex items-center">
                <div id="play-pause-btn" class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer mr-3">
                    <i class="fa fa-play"></i>
                </div>
                <div>
                    <p id="current-text-title" class="font-medium text-gray-800 truncate max-w-xs">正在播放...</p>
                    <p id="current-text-subtitle" class="text-sm text-gray-500 truncate max-w-xs">加载中...</p>
                </div>
            </div>
            <div class="flex items-center">
                <div class="hidden md:flex items-center mr-4">
                    <span id="current-time" class="text-sm text-gray-600 mr-2">0:00</span>
                    <div class="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div id="progress-bar" class="h-full bg-primary" style="width: 0%"></div>
                    </div>
                    <span id="total-time" class="text-sm text-gray-600 ml-2">0:00</span>
                </div>
                <div class="flex items-center">
                    <button id="volume-btn" class="text-gray-600 hover:text-primary mr-3">
                        <i class="fa fa-volume-up"></i>
                    </button>
                    <div class="hidden md:block w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-4">
                        <div id="volume-bar" class="h-full bg-primary" style="width: 80%"></div>
                    </div>
                    <button id="close-audio-btn" class="text-gray-600 hover:text-primary">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(audioControlBar);
    
    // 添加事件监听器
    document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
    document.getElementById('close-audio-btn').addEventListener('click', stopSpeech);
    
    // 添加音量控制
    const volumeBtn = document.getElementById('volume-btn');
    const volumeBar = document.getElementById('volume-bar');
    
    volumeBtn.addEventListener('click', () => {
        if (synth) {
            const currentVolume = volumeBar.style.width.replace('%', '') / 100;
            const newVolume = currentVolume > 0 ? 0 : 0.8;
            volumeBar.style.width = `${newVolume * 100}%`;
            
            if (currentUtterance) {
                currentUtterance.volume = newVolume;
            }
            
            // 更新图标
            const icon = volumeBtn.querySelector('i');
            if (newVolume === 0) {
                icon.className = 'fa fa-volume-off';
            } else if (newVolume < 0.5) {
                icon.className = 'fa fa-volume-down';
            } else {
                icon.className = 'fa fa-volume-up';
            }
        }
    });
    
    // 添加进度条点击事件
    const progressBarContainer = document.getElementById('progress-bar').parentElement;
    progressBarContainer.addEventListener('click', (e) => {
        if (currentUtterance && currentUtterance.text.length > 0) {
            const rect = progressBarContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            const progress = x / width;
            
            // 估算文本位置并缓存当前内容
            const textLength = currentUtterance.text.length;
            const charIndex = Math.floor(textLength * progress);
            const oldText = currentUtterance.text;
            const oldTitle = currentUtterance.title;
            const oldSubtitle = currentUtterance.subtitle;
            
            // 停止当前播放
            stopSpeech();
            
            // 从指定位置开始播放
            const newText = oldText.substring(charIndex);
            speakText(newText, oldTitle || '朗读', oldSubtitle || '文本朗读');
        }
    });
    
    // 添加音量条点击事件
    volumeBar.parentElement.addEventListener('click', (e) => {
        const rect = volumeBar.parentElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const volume = x / width;
        
        volumeBar.style.width = `${volume * 100}%`;
        
        if (currentUtterance) {
            currentUtterance.volume = volume;
        }
        
        // 更新图标
        const icon = volumeBtn.querySelector('i');
        if (volume === 0) {
            icon.className = 'fa fa-volume-off';
        } else if (volume < 0.5) {
            icon.className = 'fa fa-volume-down';
        } else {
            icon.className = 'fa fa-volume-up';
        }
    });
}

// 为故事卡片添加语音播放按钮
function addSpeechButtonsToStoryCards() {
    // 等待故事数据加载完成
    setTimeout(() => {
        const storyCards = document.querySelectorAll('.story-card');
        storyCards.forEach((card, index) => {
            // 获取故事标题和内容
            const title = card.querySelector('h3').textContent;
            const contentPreview = card.querySelector('p').textContent;
            
            // 创建语音播放按钮
            const speechBtn = document.createElement('button');
            speechBtn.className = 'absolute top-4 right-4 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors';
            speechBtn.innerHTML = '<i class="fa fa-volume-up"></i>';
            speechBtn.title = '播放故事';
            
            // 添加点击事件
            speechBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // 获取完整故事内容
                const dynasty = card.closest('.dynasty-stories').id.replace('-stories', '');
                const storyIndex = Array.from(card.parentElement.children).indexOf(card);
                
                if (storyData[dynasty] && storyData[dynasty][storyIndex]) {
                    const story = storyData[dynasty][storyIndex];
                    const fullText = `${story.title}。${story.content}`;
                    
                    // 播放语音
                    speakText(fullText, story.title, '历史小故事');
                } else {
                    // 如果没有完整数据，使用预览文本
                    speakText(`${title}。${contentPreview}`, title, '历史小故事');
                }
            });
            
            // 添加按钮到卡片
            card.style.position = 'relative';
            card.appendChild(speechBtn);
        });
    }, 1000);
}

// 为朝代详情模态框添加语音播放按钮
function addSpeechButtonToDynastyModal() {
    const modalContent = document.getElementById('modal-content');
    
    // 创建语音播放按钮容器
    const speechBtnContainer = document.createElement('div');
    speechBtnContainer.className = 'absolute top-6 right-6';
    
    // 创建语音播放按钮
    const speechBtn = document.createElement('button');
    speechBtn.id = 'dynasty-modal-speech-btn';
    speechBtn.className = 'w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors';
    speechBtn.innerHTML = '<i class="fa fa-volume-up"></i>';
    speechBtn.title = '播放朝代介绍';
    
    // 添加点击事件
    speechBtn.addEventListener('click', () => {
        const title = document.getElementById('modal-title').textContent;
        const description = modalContent.querySelector('p').textContent;
        
        // 获取主要成就
        const achievements = [];
        modalContent.querySelectorAll('ul.list-disc li').forEach(item => {
            achievements.push(item.textContent);
        });
        
        // 构建完整文本
        const fullText = `${title}。${description}。主要成就有：${achievements.join('。')}。`;
        
        // 播放语音
        speakText(fullText, title, '朝代介绍');
    });
    
    speechBtnContainer.appendChild(speechBtn);
    
    // 添加按钮到模态框
    const modalHeader = document.querySelector('#dynasty-modal .modal-header');
    modalHeader.style.position = 'relative';
    modalHeader.appendChild(speechBtnContainer);
}

// 为故事详情模态框添加语音播放按钮
function addSpeechButtonToStoryModal() {
    const modalContent = document.getElementById('story-modal-content');
    
    // 创建语音播放按钮容器
    const speechBtnContainer = document.createElement('div');
    speechBtnContainer.className = 'absolute top-6 right-6';
    
    // 创建语音播放按钮
    const speechBtn = document.createElement('button');
    speechBtn.id = 'story-modal-speech-btn';
    speechBtn.className = 'w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors';
    speechBtn.innerHTML = '<i class="fa fa-volume-up"></i>';
    speechBtn.title = '播放故事';
    
    // 添加点击事件
    speechBtn.addEventListener('click', () => {
        const title = document.getElementById('story-modal-title').textContent;
        const content = modalContent.querySelector('p').textContent;
        const moral = modalContent.querySelectorAll('p')[1].textContent;
        
        // 构建完整文本
        const fullText = `${title}。${content}。这个故事的寓意是：${moral}。`;
        
        // 播放语音
        speakText(fullText, title, '历史小故事');
    });
    
    speechBtnContainer.appendChild(speechBtn);
    
    // 添加按钮到模态框
    const modalHeader = document.querySelector('#story-modal .modal-header');
    modalHeader.style.position = 'relative';
    modalHeader.appendChild(speechBtnContainer);
}

// 为AI问答添加语音播放按钮
function addSpeechButtonToAIAnswers() {
    // 监听AI回答添加事件
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.querySelector('.bg-blue-100')) {
                        // 找到最新的AI回答
                        const aiMessage = node.querySelector('.bg-blue-100');
                        if (aiMessage && !aiMessage.querySelector('.speech-btn')) {
                            // 创建语音播放按钮
                            const speechBtn = document.createElement('button');
                            speechBtn.className = 'speech-btn absolute top-2 right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow hover:bg-blue-700 transition-colors';
                            speechBtn.innerHTML = `
                                <img src="https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/d90af2d8fe4c425fac96e28590cdd2fe~tplv-a9rns2rl98-image.image?rcl=202511281112269ED8EEFEF12CC9B49178&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1766891734&x-signature=F2o3097mV6hhtyoeBE7aqnNwqyw%3D" 
                                     alt="播放" class="w-4 h-4">
                            `;
                            speechBtn.title = '播放回答';
                            
                            // 添加点击事件
                            speechBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                
                                // 获取回答文本
                                const paragraphs = aiMessage.querySelectorAll('p');
                                const text = Array.from(paragraphs).map(p => p.textContent).join('。');
                                
                                // 播放语音
                                speakText(text, 'AI回答', '历史问答');
                            });
                            
                            // 添加按钮到AI回答
                            aiMessage.style.position = 'relative';
                            aiMessage.appendChild(speechBtn);
                        }
                    }
                });
            });
        });
        
        observer.observe(chatContainer, { childList: true, subtree: true });
    }
}

// 播放文本
function speakText(text, title, subtitle) {
    console.log('播放语音:', title, text);
    
    // 停止当前播放
    stopSpeech();
    
    // 创建语音合成对象
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9; // 语速稍慢，适合学习
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // 存储额外信息
    utterance.title = title || '朗读';
    utterance.subtitle = subtitle || '文本朗读';
    utterance.text = text;
    
    // 保存当前语音对象
    currentUtterance = utterance;
    
    // 更新音频控制栏
    document.getElementById('current-text-title').textContent = title || '朗读';
    document.getElementById('current-text-subtitle').textContent = subtitle || '文本朗读';
    document.getElementById('progress-bar').style.width = '0%';
    
    // 显示音频控制栏
    document.getElementById('audio-control-bar').classList.remove('hidden');
    
    // 更新播放/暂停按钮
    updatePlayPauseButton(true);
    
    // 设置播放状态
    isPlaying = true;
    
    // 估算总时长（假设平均语速为每分钟150字）
    const estimatedDuration = (text.length / 150) * 60;
    document.getElementById('total-time').textContent = formatTime(estimatedDuration);
    
    // 更新进度条
    let startTime = Date.now();
    const progressInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(progressInterval);
            return;
        }
        
        const elapsedTime = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsedTime / estimatedDuration, 1);
        
        document.getElementById('progress-bar').style.width = `${progress * 100}%`;
        document.getElementById('current-time').textContent = formatTime(elapsedTime);
        
        if (progress >= 1) {
            clearInterval(progressInterval);
        }
    }, 500);
    
    // 添加事件监听器
    utterance.onend = () => {
        console.log('语音播放结束');
        isPlaying = false;
        currentUtterance = null;
        updatePlayPauseButton(false);
        clearInterval(progressInterval);
    };
    
    utterance.onerror = (event) => {
        console.error('语音播放错误:', event.error);
        isPlaying = false;
        currentUtterance = null;
        updatePlayPauseButton(false);
        clearInterval(progressInterval);
        
        // 显示错误提示
        alert('语音播放失败，请稍后再试');
    };
    
    // 开始播放
    synth.speak(utterance);
}

// 切换播放/暂停
function togglePlayPause() {
    if (isPlaying) {
        pauseSpeech();
    } else if (currentUtterance) {
        resumeSpeech();
    }
}

// 暂停播放
function pauseSpeech() {
    if (synth && isPlaying) {
        synth.pause();
        isPlaying = false;
        updatePlayPauseButton(false);
    }
}

// 恢复播放
function resumeSpeech() {
    if (synth && currentUtterance && !isPlaying) {
        synth.resume();
        isPlaying = true;
        updatePlayPauseButton(true);
    }
}

// 停止播放
function stopSpeech() {
    if (synth) {
        synth.cancel();
        isPlaying = false;
        currentUtterance = null;
        updatePlayPauseButton(false);
        
        // 隐藏音频控制栏
        document.getElementById('audio-control-bar').classList.add('hidden');
    }
}

// 更新播放/暂停按钮
function updatePlayPauseButton(isPlaying) {
    const btn = document.getElementById('play-pause-btn');
    const icon = btn.querySelector('i');
    
    if (isPlaying) {
        icon.className = 'fa fa-pause';
    } else {
        icon.className = 'fa fa-play';
    }
}

// 格式化时间
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// 测试数据加载
function testDataLoading() {
    console.log('=== 测试数据加载 ===');
    console.log('dynastyData 是否存在:', typeof dynastyData !== 'undefined');
    console.log('storyData 是否存在:', typeof storyData !== 'undefined');
    
    if (typeof dynastyData !== 'undefined') {
        console.log('dynastyData 包含的朝代:', Object.keys(dynastyData));
        
        // 检查第一个朝代是否有事件数据
        const firstDynasty = Object.keys(dynastyData)[0];
        if (firstDynasty) {
            const firstDynastyData = dynastyData[firstDynasty];
            console.log(`第一个朝代 ${firstDynasty} 的数据:`, firstDynastyData);
            
            if (firstDynastyData && firstDynastyData.events) {
                console.log(`第一个朝代 ${firstDynasty} 有 ${firstDynastyData.events.length} 个事件`);
            } else {
                console.log(`第一个朝代 ${firstDynasty} 没有事件数据`);
            }
        }
    }
    
    if (typeof storyData !== 'undefined') {
        console.log('storyData 包含的朝代:', Object.keys(storyData));
        
        // 检查第一个朝代是否有故事数据
        const firstDynasty = Object.keys(storyData)[0];
        if (firstDynasty) {
            const firstDynastyStories = storyData[firstDynasty];
            console.log(`第一个朝代 ${firstDynasty} 的故事数据:`, firstDynastyStories);
            
            if (firstDynastyStories && firstDynastyStories.length > 0) {
                console.log(`第一个朝代 ${firstDynasty} 有 ${firstDynastyStories.length} 个故事`);
            } else {
                console.log(`第一个朝代 ${firstDynasty} 没有故事数据`);
            }
        }
    }
    
    console.log('=== 测试 DOM 元素 ===');
    console.log('朝代大事纪页面元素:', document.getElementById('dynasty-events'));
    console.log('历史小故事页面元素:', document.getElementById('historical-stories'));
    
    // 检查朝代事件容器
    if (typeof dynastyData !== 'undefined') {
        const firstDynasty = Object.keys(dynastyData)[0];
        if (firstDynasty) {
            const eventsContainer = document.getElementById(`${firstDynasty}-events`);
            console.log(`第一个朝代 ${firstDynasty} 的事件容器:`, eventsContainer);
            
            if (eventsContainer) {
                console.log(`事件容器 ${firstDynasty}-events 的内容:`, eventsContainer.innerHTML);
            }
        }
    }
    
    // 检查故事容器
    if (typeof storyData !== 'undefined') {
        const firstDynasty = Object.keys(storyData)[0];
        if (firstDynasty) {
            const storiesContainer = document.getElementById(`${firstDynasty}-stories`);
            console.log(`第一个朝代 ${firstDynasty} 的故事容器:`, storiesContainer);
            
            if (storiesContainer) {
                console.log(`故事容器 ${firstDynasty}-stories 的内容:`, storiesContainer.innerHTML);
            }
        }
    }
}

// 页面加载完成后延迟执行测试
setTimeout(testDataLoading, 1000);
    // 为朝代传承卡片添加 AI讲帝王传承 按钮
    addLineageButtonsToDynastyCards();
function addLineageButtonsToDynastyCards() {
    document.querySelectorAll('.dynasty-card').forEach(card => {
        const dynasty = card.getAttribute('data-dynasty');
        if (!dynasty) return;
        const container = card.querySelector('.p-6');
        if (!container) return;
        if (container.querySelector('.ai-lineage-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'ai-lineage-btn w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors';
        btn.innerHTML = '<i class="fa fa-volume-up"></i>';
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            speakLineage(dynasty);
        });
        const titleEl = container.querySelector('h3');
        container.classList.add('relative');
        const holder = document.createElement('div');
        holder.className = 'absolute top-4 right-4';
        holder.appendChild(btn);
        container.appendChild(holder);
    });
}

async function aiTellLineage(dynasty) {
    const data = (typeof dynastyData !== 'undefined') ? dynastyData[dynasty] : null;
    let text = '';
    let title = '';
    if (data) {
        title = data.title || dynasty;
        const base = [
            data.title || '',
            data.period ? `时期：${data.period}` : '',
            data.duration ? `历时：${data.duration}` : '',
            data.capital ? `都城：${data.capital}` : '',
            data.founder ? `开国皇帝：${data.founder}` : ''
        ].filter(Boolean).join('。');
        let figures = '';
        if (Array.isArray(data.figures) && data.figures.length > 0) {
            const names = data.figures.map(f => f.name).filter(Boolean).join('、');
            figures = names ? `重要历史人物：${names}` : '';
        }
        let events = '';
        if (Array.isArray(data.events) && data.events.length > 0) {
            const brief = data.events.slice(0, 6).map(ev => `${ev.year}年：${ev.event}`).join('；');
            events = brief ? `主要事件脉络：${brief}` : '';
        }
        text = [base, figures, events, '请以帝王传承的视角，串联该朝代自创立到终结的传承与更替，并以故事化口吻讲述。'].filter(Boolean).join('。');
    } else {
        title = dynasty;
        text = `请讲述${dynasty}的帝王传承`;
    }
    await sendToDoubao(text, { dynasty, type: 'lineage', title });
}

function speakLineage(dynasty) {
    const data = (typeof dynastyData !== 'undefined') ? dynastyData[dynasty] : null;
    let text = '';
    let title = '';
    if (data) {
        title = data.title || dynasty;
        const base = [
            data.title || '',
            data.period ? `时期：${data.period}` : '',
            data.duration ? `历时：${data.duration}` : '',
            data.capital ? `都城：${data.capital}` : '',
            data.founder ? `开国皇帝：${data.founder}` : ''
        ].filter(Boolean).join('。');
        let figures = '';
        if (Array.isArray(data.figures) && data.figures.length > 0) {
            const names = data.figures.map(f => f.name).filter(Boolean).join('、');
            figures = names ? `重要历史人物：${names}` : '';
        }
        let events = '';
        if (Array.isArray(data.events) && data.events.length > 0) {
            const brief = data.events.slice(0, 6).map(ev => `${ev.year}年：${ev.event}`).join('；');
            events = brief ? `主要事件脉络：${brief}` : '';
        }
        text = [base, figures, events, '以下为帝王传承的故事化讲述。'].filter(Boolean).join('。');
    } else {
        title = dynasty;
        text = `请讲述${dynasty}的帝王传承`;
    }
    speakText(text, title, '帝王传承');
}
    // 默认展开所有子菜单
    expandAllSubmenus();
function expandAllSubmenus() {
    const ids = ['basic-study', 'china-study', 'interactive-exercise'];
    ids.forEach(id => {
        const submenu = document.getElementById(`${id}-submenu`);
        const arrow = document.getElementById(`${id}-arrow`);
        if (submenu) submenu.classList.remove('hidden');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    });
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.add('sidebar-expanded');
        sidebar.classList.remove('sidebar-collapsed');
    }
}
