// 朝代数据
const dynastyData = {
    tang: {
        title: '唐朝 (618年-907年)',
        period: '中古时期',
        duration: '289年',
        founder: '李渊',
        capital: '长安（今西安）',
        description: '唐朝是中国历史上最强盛的朝代之一，文化艺术高度发达，对外交流频繁，是中国封建社会的鼎盛时期。唐朝国力强盛，疆域辽阔，经济繁荣，文化昌盛，对外交流活跃，是中国封建社会的鼎盛时期。',
        achievements: [
            '政治上实行三省六部制，科举制度完善',
            '经济繁荣，商业发达，丝绸之路畅通',
            '文化艺术高度发达，诗歌达到巅峰',
            '对外交流频繁，与亚洲各国友好往来',
            '科技进步，发明了雕版印刷术'
        ],
        figures: [
            { name: '李世民', title: '唐太宗', description: '唐朝第二位皇帝，开创贞观之治' },
            { name: '武则天', title: '武周皇帝', description: '中国历史上唯一的女皇帝' },
            { name: '唐玄宗', title: '李隆基', description: '开创开元盛世，后期发生安史之乱' },
            { name: '李白', title: '诗人', description: '唐代伟大的浪漫主义诗人' },
            { name: '杜甫', title: '诗人', description: '唐代伟大的现实主义诗人' }
        ],
        events: [
            { year: '618年', event: '李渊建立唐朝' },
            { year: '626年', event: '玄武门之变，李世民即位' },
            { year: '627年-649年', event: '贞观之治' },
            { year: '641年', event: '文成公主嫁给吐蕃的松赞干布' },
            { year: '690年', event: '武则天称帝，改国号为周' },
            { year: '705年', event: '神龙革命，唐中宗复位' },
            { year: '712年', event: '唐玄宗即位，开创开元盛世' },
            { year: '755年-763年', event: '安史之乱' },
            { year: '780年', event: '唐朝实行两税法' },
            { year: '821年', event: '唐蕃会盟' },
            { year: '835年', event: '甘露之变' },
            { year: '875年-884年', event: '黄巢起义' },
            { year: '907年', event: '朱温篡唐，唐朝灭亡' }
        ]
    },
    han: {
        title: '汉朝 (前202年-220年)',
        period: '古代时期',
        duration: '405年',
        founder: '刘邦',
        capital: '长安（西汉）、洛阳（东汉）',
        description: '汉朝是中国历史上继秦朝之后的大一统王朝，分为西汉和东汉两个时期，是中国历史上最强盛的时期之一。汉朝开创了丝绸之路，促进了东西方文化交流，确立了儒家思想的正统地位。',
        achievements: [
            '政治上实行郡国并行制，后改为郡县制',
            '经济上轻徭薄赋，休养生息',
            '文化上独尊儒术，设立太学',
            '军事上击败匈奴，开通丝绸之路',
            '科技上发明了造纸术'
        ],
        figures: [
            { name: '刘邦', title: '汉高祖', description: '汉朝开国皇帝' },
            { name: '汉武帝', title: '刘彻', description: '西汉最著名的皇帝，开创汉武盛世' },
            { name: '司马迁', title: '史学家', description: '著有《史记》' },
            { name: '张骞', title: '外交家', description: '两次出使西域，开通丝绸之路' },
            { name: '蔡伦', title: '发明家', description: '改进造纸术' }
        ],
        events: [
            { year: '前202年', event: '刘邦建立汉朝，定都长安' },
            { year: '前200年', event: '白登之围，汉高祖被匈奴围困' },
            { year: '前195年', event: '刘邦去世，汉惠帝即位' },
            { year: '前179年-前157年', event: '汉文帝刘恒在位，开创文景之治' },
            { year: '前156年-前141年', event: '汉景帝刘启在位，继续推行休养生息政策' },
            { year: '前141年-前87年', event: '汉武帝时期，国力鼎盛' },
            { year: '前138年-前126年', event: '张骞第一次出使西域' },
            { year: '前127年', event: '汉武帝颁布推恩令' },
            { year: '前119年', event: '卫青、霍去病北击匈奴' },
            { year: '前60年', event: '汉朝设置西域都护府' },
            { year: '8年', event: '王莽篡汉，建立新朝' },
            { year: '25年', event: '刘秀建立东汉，定都洛阳' },
            { year: '73年', event: '班超出使西域' },
            { year: '184年', event: '黄巾起义' },
            { year: '220年', event: '曹丕篡汉，东汉灭亡' }
        ]
    },
    song: {
        title: '宋朝 (960年-1279年)',
        period: '中古时期',
        duration: '319年',
        founder: '赵匡胤',
        capital: '开封（北宋）、临安（南宋）',
        description: '宋朝分为北宋和南宋两个阶段，是中国历史上经济、科技、文化高度发达的时期，商品经济繁荣。宋朝重文轻武，科举制度完善，文人地位提高，科技发明频出。',
        achievements: [
            '经济上商品经济繁荣，城市发展',
            '科技上发明了活字印刷术、指南针、火药等',
            '文化上文人画兴起，宋词发展',
            '农业上推广占城稻，粮食产量提高',
            '海外贸易发达，与东南亚、阿拉伯等地区有频繁往来'
        ],
        figures: [
            { name: '赵匡胤', title: '宋太祖', description: '宋朝开国皇帝，发动陈桥兵变' },
            { name: '王安石', title: '政治家', description: '推行王安石变法' },
            { name: '苏轼', title: '文学家', description: '北宋著名文学家、书画家' },
            { name: '岳飞', title: '军事家', description: '南宋抗金名将' },
            { name: '文天祥', title: '政治家', description: '南宋末年抗元英雄' }
        ],
        events: [
            { year: '960年', event: '赵匡胤发动陈桥兵变，建立宋朝' },
            { year: '979年', event: '宋灭北汉，统一中原' },
            { year: '993年-995年', event: '王小波、李顺起义' },
            { year: '1023年', event: '交子在四川发行，这是世界上最早的纸币' },
            { year: '1069年-1085年', event: '王安石变法' },
            { year: '1120年-1121年', event: '方腊起义' },
            { year: '1125年', event: '金兵南下' },
            { year: '1127年', event: '靖康之变，北宋灭亡' },
            { year: '1127年', event: '赵构建立南宋' },
            { year: '1140年', event: '岳飞北伐' },
            { year: '1141年', event: '宋金议和，岳飞被害' },
            { year: '1206年', event: '韩侂胄北伐' },
            { year: '1234年', event: '宋蒙联合灭金' },
            { year: '1279年', event: '元灭南宋，宋朝灭亡' }
        ]
    },
    yuan: {
        title: '元朝 (1271年-1368年)',
        period: '近世时期',
        duration: '97年',
        founder: '忽必烈',
        capital: '大都（今北京）',
        description: '元朝是中国历史上第一个由少数民族建立的大一统王朝，疆域辽阔，促进了亚欧文化交流。元朝实行民族等级制度，社会矛盾尖锐，但在文化艺术方面仍有成就。',
        achievements: [
            '疆域辽阔，是中国历史上疆域最大的朝代之一',
            '促进了亚欧文化交流，丝绸之路繁荣',
            '戏曲发展，元曲兴起',
            '天文历法改革，郭守敬编著《授时历》',
            '海外贸易发达'
        ],
        figures: [
            { name: '成吉思汗', title: '蒙古帝国奠基者', description: '统一蒙古各部，建立蒙古帝国' },
            { name: '忽必烈', title: '元世祖', description: '元朝开国皇帝，定都大都' },
            { name: '郭守敬', title: '天文学家', description: '编著《授时历》' },
            { name: '关汉卿', title: '戏曲家', description: '元曲四大家之一，著有《窦娥冤》' },
            { name: '马可·波罗', title: '旅行家', description: '意大利旅行家，曾在元朝为官' }
        ],
        events: [
            { year: '1206年', event: '成吉思汗统一蒙古各部' },
            { year: '1219年-1225年', event: '成吉思汗第一次西征' },
            { year: '1227年', event: '蒙古灭西夏' },
            { year: '1234年', event: '蒙古灭金' },
            { year: '1253年-1259年', event: '旭烈兀第三次西征' },
            { year: '1260年', event: '忽必烈即位' },
            { year: '1271年', event: '忽必烈改国号为元' },
            { year: '1279年', event: '元灭南宋，统一中国' },
            { year: '1291年', event: '元朝颁布《至元新格》' },
            { year: '1313年', event: '元朝恢复科举制度' },
            { year: '1325年', event: '河南赵丑厮起义' },
            { year: '1351年', event: '红巾军起义' },
            { year: '1368年', event: '朱元璋建立明朝，元朝灭亡' }
        ]
    },
    ming: {
        title: '明朝 (1368年-1644年)',
        period: '近世时期',
        duration: '276年',
        founder: '朱元璋',
        capital: '南京、北京',
        description: '明朝是中国历史上最后一个由汉族建立的大一统王朝，前期国力强盛，后期逐渐衰落。明朝实行海禁政策，但郑和七下西洋促进了海外交流。',
        achievements: [
            '政治上废除丞相制度，加强中央集权',
            '经济上农业、手工业发达，资本主义萌芽',
            '文化上小说发展，《四大奇书》问世',
            '科技上《本草纲目》、《天工开物》等著作问世',
            '郑和七下西洋，促进海外交流'
        ],
        figures: [
            { name: '朱元璋', title: '明太祖', description: '明朝开国皇帝' },
            { name: '郑和', title: '航海家', description: '七下西洋，促进海外交流' },
            { name: '李时珍', title: '医学家', description: '著有《本草纲目》' },
            { name: '王阳明', title: '思想家', description: '心学的集大成者' },
            { name: '崇祯皇帝', title: '明思宗', description: '明朝最后一位皇帝' }
        ],
        events: [
            { year: '1368年', event: '朱元璋建立明朝，定都南京' },
            { year: '1380年', event: '朱元璋废除丞相制度' },
            { year: '1398年', event: '朱元璋去世，建文帝即位' },
            { year: '1399年-1402年', event: '靖难之役' },
            { year: '1402年', event: '朱棣即位，即明成祖' },
            { year: '1405年-1433年', event: '郑和七下西洋' },
            { year: '1421年', event: '明成祖迁都北京' },
            { year: '1449年', event: '土木堡之变，明英宗被俘' },
            { year: '1457年', event: '夺门之变，明英宗复辟' },
            { year: '1565年', event: '戚继光、俞大猷平定倭寇' },
            { year: '1581年', event: '张居正推行一条鞭法' },
            { year: '1627年', event: '明末农民起义爆发' },
            { year: '1644年', event: '李自成攻入北京，崇祯皇帝自缢，明朝灭亡' }
        ]
    },
    qing: {
        title: '清朝 (1644年-1912年)',
        period: '近世时期',
        duration: '268年',
        founder: '皇太极',
        capital: '北京',
        description: '清朝是中国历史上最后一个封建王朝，由满族建立，前期国力强盛，后期逐渐衰落，最终被辛亥革命推翻。清朝前期康熙、雍正、乾隆三代开创盛世，后期面临西方列强入侵。',
        achievements: [
            '政治上设立军机处，加强中央集权',
            '经济上农业、手工业发达，商业繁荣',
            '文化上《四库全书》编纂完成',
            '疆域辽阔，统一多民族国家巩固',
            '科技上翻译西方科技著作'
        ],
        figures: [
            { name: '皇太极', title: '清太宗', description: '改国号为清' },
            { name: '康熙帝', title: '玄烨', description: '清朝第二位皇帝，开创康熙盛世' },
            { name: '雍正帝', title: '胤禛', description: '清朝第三位皇帝，推行摊丁入亩等改革' },
            { name: '乾隆帝', title: '弘历', description: '清朝第四位皇帝，开创乾隆盛世' },
            { name: '曾国藩', title: '政治家', description: '镇压太平天国运动' }
        ],
        events: [
            { year: '1644年', event: '清军入关，定都北京' },
            { year: '1661年', event: '康熙帝即位' },
            { year: '1661年-1722年', event: '康熙统治时期' },
            { year: '1683年', event: '清朝统一台湾' },
            { year: '1689年', event: '中俄签订《尼布楚条约》' },
            { year: '1723年-1735年', event: '雍正统治时期' },
            { year: '1736年-1795年', event: '乾隆统治时期' },
            { year: '1793年', event: '英国马戛尔尼使团访华' },
            { year: '1840年-1842年', event: '第一次鸦片战争' },
            { year: '1842年', event: '中英签订《南京条约》' },
            { year: '1860年', event: '英法联军火烧圆明园' },
            { year: '1894年-1895年', event: '甲午中日战争' },
            { year: '1900年', event: '八国联军侵华' },
            { year: '1911年', event: '辛亥革命爆发' },
            { year: '1912年', event: '清朝灭亡，中华民国成立' }
        ]
    },
    xia: {
        title: '夏朝 (约前2070年-前1600年)',
        period: '远古时期',
        duration: '约470年',
        founder: '禹',
        capital: '阳城（今河南登封）',
        description: '夏朝是中国历史上第一个世袭制朝代，由禹建立。夏朝的建立，标志着中国进入了奴隶社会。',
        achievements: [
            '建立了世袭制度',
            '发明了历法',
            '青铜器开始使用',
            '农业生产有了较大发展',
            '形成了初步的国家机构'
        ],
        figures: [
            { name: '大禹', title: '夏禹', description: '夏朝建立者，传说中的治水英雄' },
            { name: '启', title: '夏启', description: '大禹之子，废除禅让制，开创世袭制' },
            { name: '太康', title: '夏王', description: '夏朝第三位君主，太康失国' },
            { name: '少康', title: '夏王', description: '中兴夏朝，少康中兴' },
            { name: '桀', title: '夏桀', description: '夏朝末代君主，暴虐无道，导致夏朝灭亡' }
        ],
        events: [
            { year: '约前2070年', event: '大禹建立夏朝' },
            { year: '约前2050年', event: '大禹巡狩会稽，会诸侯' },
            { year: '约前2000年', event: '太康失国' },
            { year: '约前1980年', event: '后羿篡夏' },
            { year: '约前1960年', event: '寒浞杀后羿，篡夺王位' },
            { year: '约前1900年', event: '少康中兴' },
            { year: '约前1800年', event: '杼发明甲和矛，征伐东夷' },
            { year: '约前1650年', event: '孔甲乱夏' },
            { year: '约前1620年', event: '履癸即位，即夏桀' },
            { year: '约前1600年', event: '夏桀暴虐无道，商汤灭夏' }
        ]
    },
    shang: {
        title: '商朝 (约前1600年-前1046年)',
        period: '远古时期',
        duration: '约554年',
        founder: '商汤',
        capital: '殷（今河南安阳）',
        description: '商朝是中国历史上第二个朝代，由商汤灭夏建立。商朝时期，青铜器制作技术达到了很高的水平，甲骨文的使用标志着中国文字的正式形成。',
        achievements: [
            '青铜器制作技术达到很高水平',
            '甲骨文的使用，中国文字正式形成',
            '天文历法有了较大发展',
            '形成了完整的礼制',
            '农业生产工具改进，农业生产力提高'
        ],
        figures: [
            { name: '商汤', title: '商太祖', description: '商朝建立者，灭夏建商' },
            { name: '盘庚', title: '商王', description: '迁都殷地，史称殷商' },
            { name: '武丁', title: '商王', description: '开创武丁盛世' },
            { name: '妇好', title: '王后', description: '武丁的妻子，中国历史上第一位女将军' },
            { name: '纣', title: '商纣王', description: '商朝末代君主，暴虐无道，导致商朝灭亡' }
        ],
        events: [
            { year: '约前1600年', event: '商汤灭夏，建立商朝' },
            { year: '约前1550年', event: '太甲复位，伊尹辅政' },
            { year: '约前1450年', event: '仲丁迁都于嚣' },
            { year: '约前1300年', event: '盘庚迁都殷地' },
            { year: '约前1250年', event: '武丁即位' },
            { year: '约前1250年-前1192年', event: '武丁盛世' },
            { year: '约前1200年', event: '妇好率军征伐羌方' },
            { year: '约前1150年', event: '祖甲改革礼制' },
            { year: '约前1075年', event: '帝乙即位' },
            { year: '约前1046年', event: '牧野之战，周武王灭商' }
        ]
    },
    zhou: {
        title: '周朝 (前1046年-前256年)',
        period: '古代时期',
        duration: '约790年',
        founder: '周武王姬发',
        capital: '镐京（西周）、洛邑（东周）',
        description: '周朝是中国历史上最长的朝代，分为西周和东周两个时期。东周又分为春秋和战国两个阶段。周朝时期，封建制度确立，礼乐文化发达。',
        achievements: [
            '确立了封建制度',
            '礼乐文化发达',
            '《诗经》、《尚书》等经典著作问世',
            '铁器开始使用',
            '诸子百家思想兴起'
        ],
        figures: [
            { name: '周武王', title: '姬发', description: '周朝建立者，灭商建周' },
            { name: '周公旦', title: '周公', description: '辅佐成王，制礼作乐' },
            { name: '周幽王', title: '姬宫湦', description: '西周末代君主，烽火戏诸侯' },
            { name: '周平王', title: '姬宜臼', description: '东周首位君主，迁都洛邑' },
            { name: '孔子', title: '思想家', description: '儒家学派创始人' }
        ],
        events: [
            { year: '前1046年', event: '周武王灭商，建立周朝' },
            { year: '前1043年', event: '周武王去世，周成王即位，周公旦辅政' },
            { year: '前1040年', event: '周公旦制礼作乐' },
            { year: '前841年', event: '国人暴动，周厉王被逐' },
            { year: '前841年-前828年', event: '共和行政' },
            { year: '前771年', event: '犬戎攻入镐京，西周灭亡' },
            { year: '前770年', event: '周平王东迁，东周开始' },
            { year: '前770年-前476年', event: '春秋时期' },
            { year: '前685年', event: '齐桓公即位，任用管仲改革' },
            { year: '前636年', event: '晋文公即位，开创晋国霸业' },
            { year: '前594年', event: '鲁国实行初税亩' },
            { year: '前475年-前221年', event: '战国时期' },
            { year: '前356年', event: '商鞅在秦国开始变法' },
            { year: '前256年', event: '秦灭东周，周朝灭亡' }
        ]
    },
    qin: {
        title: '秦朝 (前221年-前207年)',
        period: '古代时期',
        duration: '15年',
        founder: '秦始皇嬴政',
        capital: '咸阳（今陕西咸阳）',
        description: '秦朝是中国历史上第一个统一的多民族的中央集权的封建国家，由秦王嬴政（秦始皇）建立。秦朝虽然短暂，但对中国历史产生了深远影响。',
        achievements: [
            '统一六国，建立中央集权制度',
            '统一文字、货币、度量衡',
            '修建长城，抵御匈奴',
            '修建灵渠，沟通长江和珠江水系',
            '实行郡县制'
        ],
        figures: [
            { name: '秦始皇', title: '嬴政', description: '秦朝建立者，中国历史上第一位皇帝' },
            { name: '李斯', title: '丞相', description: '辅佐秦始皇统一文字、度量衡' },
            { name: '蒙恬', title: '将军', description: '北击匈奴，修建长城' },
            { name: '赵高', title: '宦官', description: '秦二世时期权臣，秦末大乱的主要推手' },
            { name: '扶苏', title: '太子', description: '秦始皇长子，被赵高、李斯害死' }
        ],
        events: [
            { year: '前221年', event: '秦统一六国，建立秦朝' },
            { year: '前221年', event: '秦始皇统一文字、货币、度量衡' },
            { year: '前220年', event: '秦始皇巡游全国' },
            { year: '前219年', event: '秦始皇派徐福入海求仙药' },
            { year: '前214年', event: '修筑长城' },
            { year: '前214年', event: '开凿灵渠' },
            { year: '前213年', event: '焚书坑儒' },
            { year: '前210年', event: '秦始皇驾崩，胡亥即位为秦二世' },
            { year: '前209年', event: '陈胜吴广起义' },
            { year: '前208年', event: '赵高李斯伪造遗诏，赐死扶苏' },
            { year: '前207年', event: '项羽破釜沉舟，在巨鹿之战大败秦军' },
            { year: '前207年', event: '秦朝灭亡' }
        ]
    },
    three_kingdoms: {
        title: '三国 (220年-280年)',
        period: '古代时期',
        duration: '60年',
        founder: '曹丕、刘备、孙权',
        capital: '洛阳（魏）、成都（蜀）、建业（吴）',
        description: '三国时期是中国历史上魏、蜀、吴三个国家鼎立的时期。这个时期英雄辈出，军事谋略层出不穷，是中国历史上最为精彩的时期之一。',
        achievements: [
            '军事谋略发展到很高水平',
            '科技发明频出，如诸葛亮发明木牛流马',
            '医学发展，华佗发明麻沸散',
            '水利工程建设',
            '文学艺术发展，建安文学兴起'
        ],
        figures: [
            { name: '曹操', title: '魏武帝', description: '魏国奠基者，政治家、军事家、文学家' },
            { name: '刘备', title: '汉昭烈帝', description: '蜀汉开国皇帝' },
            { name: '孙权', title: '吴大帝', description: '吴国开国皇帝' },
            { name: '诸葛亮', title: '丞相', description: '蜀汉丞相，杰出的政治家、军事家' },
            { name: '周瑜', title: '大都督', description: '吴国大都督，赤壁之战的主要指挥者' }
        ],
        events: [
            { year: '208年', event: '赤壁之战，孙刘联军大败曹操' },
            { year: '214年', event: '刘备占领益州' },
            { year: '220年', event: '曹丕篡汉，建立魏国' },
            { year: '221年', event: '刘备建立蜀汉' },
            { year: '222年', event: '孙权建立吴国' },
            { year: '222年', event: '夷陵之战，吴国大败蜀汉' },
            { year: '223年', event: '刘备驾崩，诸葛亮辅佐刘禅' },
            { year: '225年', event: '诸葛亮七擒孟获' },
            { year: '228年-234年', event: '诸葛亮六出祁山' },
            { year: '234年', event: '诸葛亮病逝五丈原' },
            { year: '249年', event: '司马懿发动高平陵之变' },
            { year: '263年', event: '魏灭蜀' },
            { year: '265年', event: '司马炎篡魏，建立西晋' },
            { year: '280年', event: '西晋灭吴，统一三国' }
        ]
    },
    jin: {
        title: '晋朝 (265年-420年)',
        period: '古代时期',
        duration: '155年',
        founder: '司马炎',
        capital: '洛阳（西晋）、建康（东晋）',
        description: '晋朝分为西晋和东晋两个时期。西晋短暂统一了中国，但后期因八王之乱和五胡乱华而灭亡。东晋偏安江南，北方进入十六国时期。',
        achievements: [
            '短暂统一中国',
            '玄学兴起',
            '书法艺术发展',
            '陶瓷技术进步',
            '文学艺术发展'
        ],
        figures: [
            { name: '司马炎', title: '晋武帝', description: '晋朝建立者，统一三国' },
            { name: '司马睿', title: '晋元帝', description: '东晋建立者' },
            { name: '王羲之', title: '书法家', description: '书圣，代表作《兰亭序》' },
            { name: '陶渊明', title: '文学家', description: '田园诗派创始人' },
            { name: '谢安', title: '政治家', description: '东晋名臣，淝水之战的主要指挥者' }
        ],
        events: [
            { year: '265年', event: '司马炎篡魏，建立西晋' },
            { year: '280年', event: '西晋灭吴，统一中国' },
            { year: '280年', event: '西晋颁布户调式' },
            { year: '290年', event: '晋武帝去世，晋惠帝即位' },
            { year: '291年-306年', event: '八王之乱' },
            { year: '304年', event: '李特、李雄在四川建立成汉政权' },
            { year: '304年', event: '刘渊在山西建立汉赵政权' },
            { year: '311年', event: '永嘉之乱，匈奴攻陷洛阳' },
            { year: '316年', event: '匈奴攻入长安，西晋灭亡' },
            { year: '317年', event: '司马睿建立东晋' },
            { year: '322年', event: '王敦之乱' },
            { year: '354年', event: '桓温北伐' },
            { year: '383年', event: '淝水之战，东晋大败前秦' },
            { year: '403年', event: '桓玄篡晋，建立桓楚政权' },
            { year: '420年', event: '刘裕篡晋，建立宋朝，东晋灭亡' }
        ]
    },
    southern_northern: {
        title: '南北朝 (420年-589年)',
        period: '古代时期',
        duration: '169年',
        founder: '刘裕、拓跋珪',
        capital: '建康（南朝）、平城/洛阳（北朝）',
        description: '南北朝是中国历史上南方与北方各自政权并立的时期。南朝包括宋、齐、梁、陈四个朝代，北朝包括北魏、东魏、西魏、北齐、北周五个朝代。',
        achievements: [
            '佛教兴盛',
            '石窟艺术发展',
            '文学艺术南北风格各异',
            '科技发展',
            '民族融合'
        ],
        figures: [
            { name: '刘裕', title: '宋武帝', description: '南朝宋建立者' },
            { name: '拓跋珪', title: '北魏道武帝', description: '北魏建立者' },
            { name: '魏孝文帝', title: '拓跋宏', description: '北魏皇帝，推行汉化改革' },
            { name: '梁武帝', title: '萧衍', description: '南朝梁建立者，笃信佛教' },
            { name: '陶渊明', title: '文学家', description: '田园诗派创始人' }
        ],
        events: [
            { year: '420年', event: '刘裕建立宋朝，南朝开始' },
            { year: '439年', event: '北魏统一北方，北朝开始' },
            { year: '450年', event: '北魏太武帝拓跋焘南征' },
            { year: '466年', event: '宋明帝刘彧即位' },
            { year: '471年-499年', event: '魏孝文帝改革' },
            { year: '494年', event: '魏孝文帝迁都洛阳' },
            { year: '502年', event: '萧衍建立梁朝' },
            { year: '523年', event: '北魏六镇起义' },
            { year: '534年', event: '北魏分裂为东魏和西魏' },
            { year: '548年-552年', event: '侯景之乱' },
            { year: '550年', event: '东魏改为北齐' },
            { year: '557年', event: '西魏改为北周' },
            { year: '557年', event: '陈霸先建立陈朝' },
            { year: '577年', event: '北周灭北齐，统一北方' },
            { year: '581年', event: '杨坚建立隋朝' },
            { year: '589年', event: '隋灭陈，统一中国，南北朝结束' }
        ]
    },
    sui: {
        title: '隋朝 (581年-618年)',
        period: '古代时期',
        duration: '37年',
        founder: '杨坚',
        capital: '大兴城（今西安）、洛阳',
        description: '隋朝是中国历史上继秦、汉之后的又一个统一的多民族的中央集权的封建国家，由杨坚建立。隋朝虽然短暂，但对中国历史产生了深远影响。',
        achievements: [
            '统一中国，结束南北分裂局面',
            '开创科举制度',
            '修建大运河',
            '改革官制',
            '统一度量衡'
        ],
        figures: [
            { name: '杨坚', title: '隋文帝', description: '隋朝建立者，统一中国' },
            { name: '杨广', title: '隋炀帝', description: '隋朝第二位皇帝，修建大运河' },
            { name: '杨素', title: '大臣', description: '隋朝名将' },
            { name: '李春', title: '工匠', description: '设计建造赵州桥' },
            { name: '李密', title: '瓦岗军领袖', description: '隋末农民起义领袖' }
        ],
        events: [
            { year: '581年', event: '杨坚建立隋朝' },
            { year: '583年', event: '隋朝迁都大兴城' },
            { year: '585年', event: '隋朝推行输籍法' },
            { year: '589年', event: '隋灭陈，统一中国' },
            { year: '590年', event: '隋朝改革官制' },
            { year: '594年', event: '隋朝颁布均田令' },
            { year: '604年', event: '隋文帝去世，隋炀帝即位' },
            { year: '605年', event: '隋炀帝营建东都洛阳' },
            { year: '605年-610年', event: '修建大运河' },
            { year: '607年', event: '隋炀帝派裴矩经营西域' },
            { year: '608年', event: '隋朝开凿永济渠' },
            { year: '611年', event: '隋末农民起义爆发' },
            { year: '616年', event: '隋炀帝逃往江都' },
            { year: '618年', event: '隋炀帝被杀，隋朝灭亡' }
        ]
    },
    five_dynasties: {
        title: '五代十国 (907年-979年)',
        period: '中古时期',
        duration: '72年',
        founder: '朱温、李存勖等',
        capital: '开封、洛阳等',
        description: '五代十国是中国历史上的一个分裂时期，中原地区先后出现了后梁、后唐、后晋、后汉、后周五个朝代，南方和边缘地区出现了十个割据政权。',
        achievements: [
            '军事技术发展',
            '文学艺术发展',
            '陶瓷技术进步',
            '商业发展',
            '民族融合'
        ],
        figures: [
            { name: '朱温', title: '后梁太祖', description: '五代第一个朝代后梁的建立者' },
            { name: '李存勖', title: '后唐庄宗', description: '后唐建立者' },
            { name: '石敬瑭', title: '后晋高祖', description: '后晋建立者，割让燕云十六州' },
            { name: '刘知远', title: '后汉高祖', description: '后汉建立者' },
            { name: '郭威', title: '后周太祖', description: '后周建立者' }
        ],
        events: [
            { year: '907年', event: '朱温篡唐，建立后梁，五代开始' },
            { year: '917年', event: '刘䶮在广州建立南汉' },
            { year: '923年', event: '李存勖灭后梁，建立后唐' },
            { year: '925年', event: '后唐灭前蜀' },
            { year: '934年', event: '孟知祥在成都建立后蜀' },
            { year: '936年', event: '石敬瑭建立后晋，割让燕云十六州' },
            { year: '937年', event: '徐知诰建立南唐' },
            { year: '947年', event: '契丹灭后晋' },
            { year: '947年', event: '刘知远建立后汉' },
            { year: '951年', event: '郭威建立后周' },
            { year: '951年', event: '刘崇在太原建立北汉' },
            { year: '954年', event: '高平之战，后周大败北汉' },
            { year: '960年', event: '赵匡胤发动陈桥兵变，建立宋朝' },
            { year: '979年', event: '宋灭北汉，十国结束' }
        ]
    },
    modern: {
        title: '近现代 (1912年-至今)',
        period: '近现代',
        duration: '100多年',
        founder: '孙中山等',
        capital: '南京、北京',
        description: '近现代是中国历史上从清朝灭亡到现在的时期，包括中华民国和中华人民共和国两个阶段。这个时期中国经历了巨大的社会变革和现代化进程。',
        achievements: [
            '辛亥革命推翻封建帝制',
            '新文化运动促进思想解放',
            '抗日战争胜利',
            '中华人民共和国成立',
            '改革开放促进经济发展'
        ],
        figures: [
            { name: '孙中山', title: '革命先行者', description: '中华民国创始人' },
            { name: '毛泽东', title: '无产阶级革命家', description: '中华人民共和国主要缔造者' },
            { name: '周恩来', title: '无产阶级革命家', description: '中华人民共和国总理' },
            { name: '邓小平', title: '无产阶级革命家', description: '中国改革开放的总设计师' },
            { name: '鲁迅', title: '文学家', description: '中国现代文学的奠基人' }
        ],
        events: [
            { year: '1911年', event: '辛亥革命爆发' },
            { year: '1912年', event: '中华民国成立' },
            { year: '1915年', event: '新文化运动开始' },
            { year: '1919年', event: '五四运动' },
            { year: '1921年', event: '中国共产党成立' },
            { year: '1924年', event: '第一次国共合作' },
            { year: '1927年', event: '南昌起义' },
            { year: '1934年-1936年', event: '红军长征' },
            { year: '1937年-1945年', event: '抗日战争' },
            { year: '1945年', event: '抗日战争胜利' },
            { year: '1946年-1949年', event: '解放战争' },
            { year: '1949年', event: '中华人民共和国成立' },
            { year: '1950年-1953年', event: '抗美援朝战争' },
            { year: '1956年', event: '社会主义改造基本完成' },
            { year: '1978年', event: '改革开放开始' },
            { year: '1997年', event: '香港回归' },
            { year: '1999年', event: '澳门回归' },
            { year: '2008年', event: '北京奥运会举办' }
        ]
    }
};
