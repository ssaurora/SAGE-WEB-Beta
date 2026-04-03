## 1. 文档目的

本文用于把既有前端设计中的风格原则，进一步压缩为可执行的视觉系统规范。

目标是回答：

1. 这个产品整体应呈现怎样的视觉气质。
    
2. 各类页面、面板、地图、状态控件应遵循什么样的层级关系。
    
3. 如何通过 Token、组件样式和状态映射保持一致性。
    
4. 如何避免把产品做成营销化、科幻化或纯聊天化界面。
    

本文适用于：

- 视觉设计师
    
- 产品设计师
    
- 前端样式实现
    
- 设计系统建设
    

---

## 2. 总体视觉定位

本产品的视觉定位应稳定保持为：

- 企业级 B 端
    
- GIS-first
    
- 冷静、可信、克制
    
- 信息密度高但分层清楚
    
- 地图主导而非聊天主导
    
- AI 辅助而非 AI 主角化
    

### 2.1 不应出现的风格倾向

必须避免：

- 营销风首页式强装饰
    
- 赛博/科幻/发光边框风格
    
- 过重渐变和氛围背景
    
- 为了“AI 感”而过度强调会话气质
    
- 大面积留白导致工作台稀疏空洞
    

---

## 3. 设计系统总体原则

### 3.1 层级优先于装饰

UI 的信息层级要通过以下方式建立：

- 排版层级
    
- 面板分组
    
- 边界线与背景层次
    
- 状态色
    
- 控件密度
    

而不是依赖夸张阴影或装饰图形。

### 3.2 工作台优先于页面美观

对于 Workbench / Governance / Report Detail：

- 首先保证信息可读
    
- 其次保证操作路径清晰
    
- 最后才考虑视觉点缀
    

### 3.3 地图是中心视觉对象

在 Workbench 中：

- 地图必须是主视觉核心
    
- 左右面板不能把地图压缩成附属区域
    
- 地图背景和图层表现不应被花哨 UI 抢走注意力
    

---

## 4. 基础 Token 建议

## 4.1 色彩角色（Color Roles）

建议使用“角色化色彩”而不是按页面随意配色。

|Token 角色|含义|用途|
|---|---|---|
|`bg.base`|全局背景色|页面整体背景|
|`bg.surface`|面板背景色|卡片、Panel、Tab 内容区|
|`bg.subtle`|次级背景色|次级摘要区、筛选区、辅助说明|
|`border.default`|默认边框色|面板、表格、输入区|
|`text.primary`|主文本色|标题、正文|
|`text.secondary`|次文本色|说明、标签|
|`text.muted`|弱化文本色|占位、空状态辅助信息|
|`accent.primary`|主要强调色|主按钮、可执行操作|
|`status.info`|信息状态色|queued / running / processing|
|`status.success`|成功状态色|completed|
|`status.warning`|警示状态色|waiting input / action required|
|`status.error`|错误状态色|failed / terminal failure|

### 4.1.1 色彩策略建议

- 整体基调采用浅色主题
    
- 状态色只在状态对象中高亮，不大面积铺满页面
    
- 地图区域色彩优先服务于图层可读性，不与 UI 状态色冲突
    

---

## 4.2 间距系统（Spacing Scale）

建议采用统一间距尺度，例如：

- `space.2`：极小内部间距
    
- `space.4`：紧凑控件间距
    
- `space.8`：标准组件内部间距
    
- `space.12`：面板内部主要分区间距
    
- `space.16`：主要模块分隔间距
    
- `space.24`：页面级区块分隔
    

### 4.2.1 间距使用原则

- 面板内部宜紧凑，不宜过于松散
    
- 页面级区块要清楚分隔
    
- Workbench 左右侧面板需比营销产品更密一些
    

---

## 4.3 圆角系统（Radius Scale）

建议：

- `radius.sm`：输入框、小按钮、badge
    
- `radius.md`：卡片、面板、列表项
    
- `radius.lg`：主要页面级面板（适度）
    

原则：

- 保持稳重，不要使用过度圆润的大圆角
    
- 面板圆角应服务于层次，不应制造“玩具感”
    

---

## 4.4 阴影系统（Shadow Scale）

建议：

- 仅使用非常轻的阴影
    
- 主要依赖边框、背景层差和分组建立结构
    
- 避免发光感、悬浮感过强的阴影
    

Workbench 和 Governance 页面尤其应控制阴影，保持克制。

---

## 5. 排版系统规范

## 5.1 字体层级

建议最少建立以下文本层级：

|层级|用途|
|---|---|
|`title.page`|页面标题|
|`title.section`|面板标题|
|`title.card`|卡片/子区块标题|
|`text.body`|正文|
|`text.label`|字段标签|
|`text.meta`|次级说明、时间、状态补充|
|`text.mono`（可选）|标识符、技术摘要|

## 5.2 排版原则

- 标题层级不宜过多
    
- 正文优先清晰、克制，不追求过度品牌风格
    
- 表格、卡片、状态标签文字必须可快速扫描
    

---

## 6. 页面级视觉规范

## 6.1 Scenes / List 页

风格重点：

- 清晰列表/卡片结构
    
- 状态摘要可快速扫描
    
- 不需要地图抢主视觉
    

建议：

- SceneCard 采用规整卡片
    
- 每张卡片包含有限状态标签和次级摘要
    
- 禁止卡片内部堆叠过多技术字段
    

## 6.2 Scene Workbench

风格重点：

- 地图为中心
    
- 左右面板规整、清晰、可折叠
    
- 信息密度高但分组明确
    

建议：

- 左右侧面板使用统一 panel 样式
    
- Tab 栏简洁克制
    
- 地图区与面板区通过边界和背景层次区分
    
- Header 应更像任务状态条，而不是营销 banner
    

## 6.3 Task Governance

风格重点：

- 强治理感
    
- 明确状态链路
    
- Facts 与 Suggestions 分区明显
    

建议：

- Lifecycle 使用强结构化 stepper
    
- Governance Panel 和 Events / Manifest / Audit 分区清晰
    
- Warning / Error 状态要醒目但不能全页泛红
    

## 6.4 Report Detail

风格重点：

- 结果消费导向
    
- 地图 + 指标 + 解释三者平衡
    
- 结构化摘要优先
    

建议：

- Metric Card 区整洁规整
    
- Explanation 区克制，避免做成聊天记录流
    
- 导出区明确但不喧宾夺主
    

---

## 7. 核心组件视觉规范

## 7.1 Panel

适用对象：

- Inputs Tab 内容区
    
- Task Facts 区
    
- Context Summary 区
    
- Manifest Summary 区
    
- Governance Facts 区
    

样式建议：

- 使用统一背景色与边框
    
- 标题区、内容区、底部操作区分层明确
    
- 面板内 section 使用稳定间距切分
    

## 7.2 Table

适用对象：

- Tasks 列表
    
- Audit 表格
    
- Assets 列表
    
- Reports 列表
    

规范建议：

- 行高稳定，适合高密度扫描
    
- 头部不宜过重装饰
    
- 状态列与操作列视觉对齐清晰
    

## 7.3 Badge / StatusTag

适用对象：

- Current State
    
- Manifest Status
    
- Runtime Checks Summary
    
- Asset Status
    

规范建议：

- 使用有限状态色集合
    
- 文案短、状态清晰
    
- 不要把 badge 做得像按钮
    

## 7.4 Stepper / Lifecycle

适用对象：

- Task Lifecycle
    
- Stage Progress
    

规范建议：

- 重点突出 current / completed / failed 三种差异
    
- 颜色和图标一致使用
    
- 不用复杂动效表达阶段变化
    

## 7.5 Empty State

规范建议：

- 优先用简洁说明 + 行动入口
    
- 图形占位可有，但必须克制
    
- Workbench 中空状态不能让地图完全空白无解释
    

---

## 8. 状态视觉映射规范

## 8.1 状态颜色映射建议

|状态类型|建议色彩角色|
|---|---|
|understanding / queued / running / processing|`status.info`|
|ready / completed|`status.success`|
|waiting input / action required|`status.warning`|
|failed / terminal failure|`status.error`|
|neutral / draft / inactive|`text.secondary` / `bg.subtle`|

## 8.2 状态视觉原则

- 主状态由 Badge + 文案共同表达
    
- 面板级状态用横幅或提示条补充
    
- 不要仅靠颜色表达状态，需配合文本与图标
    

---

## 9. 地图视觉规范

## 9.1 地图与 UI 的关系

- 地图色彩优先服务于图层可读性
    
- UI Panel 不应使用过强颜色压住地图
    
- 地图区的边框和背景应弱于面板区
    

## 9.2 图层视觉建议

- 输入图层：较轻表达，避免与结果争主导
    
- 结果图层：更明确、可聚焦
    
- 选中对象：使用独立高亮层
    
- Scene 边界：清晰但不过强
    

## 9.3 不推荐地图视觉做法

- 过饱和底图
    
- 过多炫光边框和选中动画
    
- 所有图层默认高强度显示
    

---

## 10. AI 区域视觉规范

## 10.1 定位

AI 区域应被设计为：

- 分析协助区
    
- 状态解释区
    
- 追问与结果解释区
    

而不是“整个产品的主视觉中心”。

## 10.2 样式建议

- 保持与其他 Panel 一致的面板风格
    
- 对话消息气质应偏工作型，而非社交聊天型
    
- 输入框应简洁，不做强品牌化装饰
    

## 10.3 不推荐做法

- 把 AI 面板做成整页最亮的区域
    
- 用夸张头像、气泡、光效强调“智能感”
    
- 让对话流视觉上压过地图与任务状态
    

---

## 11. 弹窗 / 抽屉视觉规范

### 11.1 Modal

- 尺寸适中
    
- 标题与操作清晰
    
- 适合短流程确认
    
- 不做复杂嵌套
    

### 11.2 Drawer

- 更适合参数编辑和高级摘要
    
- 应保持与页面主结构视觉一致
    
- 打开后不应让用户完全失去上下文
    

### 11.3 Side Panel

- 适合地图对象详情
    
- 内容结构应简洁，先摘要后详情
    

---

## 12. 响应式视觉降级原则

- 宽屏保留三栏主结构
    
- 中屏折叠侧栏，但保持地图主区
    
- 窄屏切换为分段视图，不强行保留三栏并排
    
- 不要为了适配窄屏而让 AI 区域取代地图区域
    

---

## 13. 设计 Token 输出建议

设计团队后续可将本文进一步沉淀为以下 Token 集合：

- Color Tokens
    
- Spacing Tokens
    
- Radius Tokens
    
- Shadow Tokens
    
- Typography Tokens
    
- State Tokens
    
- Layout Tokens
    

并同步提供：

- Panel 规范
    
- Table 规范
    
- Badge 规范
    
- Stepper 规范
    
- Empty State 规范
    
- Modal / Drawer 规范
    

---

## 14. 实施优先级建议

1. 先统一页面基础背景、Panel、Table、Badge、Button。
    
2. 再统一 Workbench 三栏与地图区视觉结构。
    
3. 再统一 Lifecycle、Manifest、Governance 等治理型组件。
    
4. 最后补细节：弹窗、抽屉、空状态、响应式降级。
    

---

## 15. 给团队的使用建议

### 给视觉设计师

- 用本文定义整体气质与层级
    
- 先做 Workbench / Governance / Report 三大核心页
    

### 给前端

- 先实现 Token 与基础组件
    
- 再拼装页面，而不是每页单独做样式
    

### 给产品 / 架构

- 不要让视觉设计偏离 GIS-first、Task-governed 的产品本质