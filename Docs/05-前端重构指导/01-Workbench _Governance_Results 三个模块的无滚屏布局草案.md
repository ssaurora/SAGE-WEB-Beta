可以。下面我直接给你一版**Workbench / Governance / Results 三个模块的无整页长滚动布局草案**。
目标很明确：

**模块内首屏闭环，次级信息局部滚动，整页不靠上下长滚动取信息。**

我会沿用你现在仓库里已经表达出来的语义，不推翻内容，只重构布局承载方式。当前三个模块的内容来源分别能在现有实现里看到：Workbench 的输入、地图、图层、对象详情、执行上下文等，Governance 的恢复动作、证据、manifest、生命周期等，Results 的推荐结果、结果列表、结果消费链路等。

---

# 总体布局原则

## 1. 每个模块都采用同一种骨架

统一成：

* 固定顶部状态栏
* 固定高度主体区
* 主体区横向分栏
* 侧栏内部滚动
* 底部抽屉承载日志/证据/明细

不要再用“上面一个卡片、下面一个卡片、再下面一个卡片”的长文档结构。

## 2. 整页尽量不滚

允许滚动的只有：

* 左栏列表
* 右栏详情
* 底部抽屉
* Tab 面板内部

不允许用户为了看关键状态去整页往下翻。

## 3. 状态变化不改变骨架，只改变局部内容

比如 Workbench 现在会切 `input-recovery / runtime-monitoring / result-transition` 三种布局模式。
我建议保留这个“状态驱动”的思想，但不要再切整页布局，而是：

* 骨架固定
* 左右面板内容和优先级变化
* 主按钮变化
* 局部高亮变化

---

# 一、Workbench 布局草案

你现在 Workbench 里的内容很多，但本质上可以收束成四类：

* 状态与主动作
* 输入与图层
* 地图主画布
* 对象/任务详情

这些都已经在现有 `SceneWorkbenchPage` 和 `WorkbenchMapInteractive` 里出现了 。

---

## Workbench 推荐骨架

### 顶部固定状态条，高度 64–80px

内容：

* Scene 名称
* Analysis Type
* Model Name
* Current State
* Required Inputs Ready
* Primary Action Button

把你现在这些内容从单独卡片里抽出来，收进一条固定条里：

* `sceneName`
* `analysisType`
* `modelName`
* `currentState`
* `requiredInputsReady` 

### 主体区：三栏布局

建议比例：

* 左栏：320px
* 中栏：自适应
* 右栏：360px

主体区高度固定为：
`calc(100vh - topbar - app header - optional footer)`

---

## 左栏：Inputs + Layers

左栏用 Tab 切两块：

### Tab 1: Inputs

显示：

* Required Inputs
* Optional Inputs
* Upload Assets
* Binding 状态
* Invalid / Missing 数量

这里对应你现在的 `InputsPanelInteractive`、`requiredInputs`、`optionalInputs`、`uploadedAssets`。

要求：

* 左栏内部滚动
* 不要再把 Inputs 作为主页面大卡片平铺
* 必需输入缺失时，左栏顶部显示红/黄状态提示

### Tab 2: Layers

显示：

* Input Layers
* Result Layers
* Visible/Hidden
* Opacity
* Zoom to Layer
* Reorder

对应你现在的 `Layers` 控制区。

要求：

* 分组折叠保留
* 但不要出现在地图下方
* 永远固定在左栏中

---

## 中栏：Map Canvas

中间永远只做一件事：

**地图主画布。**

保留你现有 MapLibre 组件方向，因为地图本来就应该是 workbench 的主舞台。

中栏只包含：

* 地图
* 顶部悬浮工具条
* 底部坐标/比例尺状态条
* 少量悬浮筛选控件

不要在地图上下再堆其它卡片。

### 地图顶部悬浮工具条

建议包含：

* Reset View
* Active Layer
* Visible Layer Count
* Quick Toggle: Inputs / Results / All
* Enter Fullscreen

### 地图底部状态条

保留你现在这些信息即可：

* Lng / Lat
* Zoom
* Scale
* CRS
* Active Layer 

---

## 右栏：Inspector / Task / Guidance

右栏不要再拆很多独立卡片，直接做三个 Tab：

### Tab 1: Inspector

对应你现在的 `Object Inspector`。

显示：

* Object Name
* Object Type
* Status
* Updated At
* Coordinates
* Related Task
* Related Result

### Tab 2: Task

对应你现在 scattered 的：

* Current State
* State Focus
* Context Summary
* Lifecycle Summary 

显示：

* Current Task State
* State Hint
* Runtime Progress
* Current Blocking Issue
* Lifecycle Summary
* Open Governance

### Tab 3: Guidance

对应你现在的：

* Next Steps
* Suggested Next Steps
* Context Summary 

显示：

* Suggested Next Steps
* Recommended Fixes
* Why this matters
* One-click action links

---

## 底部抽屉：Execution / Audit / Manifest

当前 Workbench 里不适合首屏常驻的内容，统一收进底部抽屉：

* Execution Context
* Audit Snippets
* Latest Lifecycle Events
* Manifest Snapshot

你现在的 `Execution Context` 明显不该继续占主页面块位。

---

## Workbench 首屏闭环要求

用户进入后，不滚动，必须一眼看到：

* 当前状态
* 当前缺什么
* 地图上有什么
* 我下一步点哪里

只要这四个问题仍需要往下滑，布局就没合格。

---

# 二、Governance 布局草案

你现在 Governance 的语义是对的，但形式还是纵向长页：顶部摘要、恢复区、证据区往下串。
它应该变成一个**治理控制台**。

---

## Governance 推荐骨架

### 顶部固定决策栏

内容：

* Task ID
* Scene ID
* Current State
* Stage State
* Can Resume
* Can Cancel
* Result Available
* Primary Action

这些内容都已经在现有页面里有了。

### 主体区：左右双栏

建议比例：

* 左栏：420px
* 右栏：自适应

---

## 左栏：Recovery Console

左边只放“我现在该怎么处理”。

区域分为四块：

### 1. Current Decision

显示：

* Decision Status
* Decision Outcome
* Next Action Text

### 2. Blocking Issues

显示：

* Missing Required Inputs
* Invalid Bindings
* Failure Summary
* Required Actions

### 3. Suggested Fix

显示：

* Suggested Fixes
* One recommended fix
* Fix confidence / priority

### 4. Action Buttons

显示：

* Fix and Resume
* Cancel Task
* Re-run Analysis
* Open Workbench

这其实就是你现在 `GovernanceRecoveryPanel` 的重组，只是不要再在纵向页面里占一整大片。

---

## 右栏：Evidence Console

右边只做证据查看，用 Tab。

### Tab 1: Evidence

* Failure Evidence
* Missing Inputs Evidence
* Required Actions Evidence
* Suggested Fix Rationale

### Tab 2: Manifest

* Analysis Type
* Model Name
* Required Inputs Ready
* Runtime Profile
* Manifest Summary

### Tab 3: Lifecycle

* Lifecycle Events
* Stage transitions
* Resume points
* Failure point

### Tab 4: Audit

* Audit Summary
* Artifacts
* Indexed evidence
* Download links

这些都已经在 `GovernanceEvidenceTabs` 的语义里存在。

---

## Governance 页面必须避免的事

不要再让用户这样操作：

1. 先看状态卡
2. 往下滚看恢复面板
3. 再往下看 evidence
4. 再切到 manifest
5. 再找 artifacts

这就是现在你最不满意的“上下长滚动获取信息”的本质来源。

---

## Governance 首屏闭环要求

不滚动必须看到：

* 为什么停在这里
* 是否可恢复
* 该执行哪个动作
* 证据入口在哪

---

# 三、Results 布局草案

你现在 Results 页已经在表达“结果消费”而不是“下载中心”了，这个方向很好。
但问题是仍然是纵向阅读页。

它应该改成一个**结果浏览与解释工作台**。

---

## Results 推荐骨架

### 顶部固定结果状态条

内容：

* Scene ID
* Latest State
* Recommended Result
* Decision Hint
* Primary Action

对应你现在的：

* Decision Status
* Decision Target
* Recommended Target
* Decision Rationale
* Primary Decision Action 

---

## 主体区：三栏布局

建议比例：

* 左栏：320px
* 中栏：自适应
* 右栏：360px

---

## 左栏：Results List

显示：

* Result 列表
* Task 过滤
* 时间排序
* explanationReady
* mapLayerReady
* recommended 标记

这里就是你现有 `SceneResultsPanel` 应该承载的内容，但固定在左侧，不再作为整页主体往下铺。

要求：

* 左栏内部滚动
* 支持切换当前选中 result
* 点击后中间主视区更新

---

## 中栏：Result Main View

中间只放当前结果的主视图，优先级如下：

### 情况 A：地图结果可用

显示：

* Result Layer Map
* Key Indicators
* Short Explanation Summary

### 情况 B：地图结果不可用

显示：

* Placeholder + Why unavailable
* Return to Governance / Workbench CTA

### 情况 C：解释未就绪

显示：

* 原始指标
* Input-output mapping
* Raw artifact readiness

你现在结果页里已经有“结果完整就打开，不完整就回治理/工作台”的判断逻辑，这个逻辑可以保留。

---

## 右栏：Result Details

右栏建议做 Tab：

### Tab 1: Explanation

* Full explanation
* Summary
* Analyst notes

### Tab 2: Mapping

* Input → Output mapping
* Source inputs used
* Processing lineage

### Tab 3: Artifacts

* Downloadable artifacts
* Readiness
* Related files

### Tab 4: Related Task

* From task id
* Task state
* Open governance
* Open workbench

这些语义在你 mock 的结果详情里已经很清楚：`explanation / indicators / inputOutputMapping / downloadableArtifacts`。

---

## Results 首屏闭环要求

不滚动必须知道：

* 当前推荐看哪个结果
* 这个结果是否完整
* 中央正在看什么
* 还可以点开什么细节

---

# 四、三个模块的统一交互规范

为了避免又做成三套不同风格，我建议统一以下规范。

## 1. 顶部状态条统一

每个模块顶部都统一成：

* 左：对象上下文（scene/task/result）
* 中：当前状态
* 右：Primary Action

## 2. 主体区高度统一

三个模块都采用：
`height: calc(100vh - globalHeader - localTopbar)`

## 3. 左栏统一承担“列表/资源/输入”

* Workbench：Inputs / Layers
* Governance：Blocking Issues / Recovery Actions
* Results：Result List

## 4. 中栏统一承担“主操作对象”

* Workbench：Map
* Governance：Recovery Console
* Results：Result Main View

## 5. 右栏统一承担“解释/详情/证据”

* Workbench：Inspector / Task / Guidance
* Governance：Evidence / Manifest / Lifecycle / Audit
* Results：Explanation / Mapping / Artifacts / Related Task

## 6. 底部抽屉统一承担长内容

所有长信息都不该挤主视口：

* 日志
* lifecycle 全量
* audit 详单
* manifest 详细字段
* artifact 表格

---

# 五、你现有页面该如何迁移

## Workbench

现有内容迁移关系：

* `Current State` → 顶部状态条
* `Inputs` → 左栏 Inputs Tab
* `Layers` → 左栏 Layers Tab
* `Map Canvas` → 中栏
* `State Focus` → 右栏 Task Tab
* `Next Steps` → 右栏 Guidance Tab
* `Execution Context` → 底部抽屉
* `Object Inspector` → 右栏 Inspector Tab 

## Governance

现有内容迁移关系：

* `Decision Zone` → 顶部决策栏
* `Decision Evidence / Outcome` → 左栏 Current Decision
* `GovernanceRecoveryPanel` → 左栏 Recovery Console
* `GovernanceEvidenceTabs` → 右栏 Evidence Console Tabs 

## Results

现有内容迁移关系：

* `Decision Zone` → 顶部结果状态条
* `Context Notes` → 右栏 Related Task / Context
* `SceneResultsPanel` → 左栏 Result List
* 当前 result 明细 → 中栏 + 右栏详情区 

---

# 六、最关键的一句判断

你现在不是“内容太多”，而是**把适合侧栏、抽屉、Tab 的内容，错误地放进了整页纵向流**。

所以真正要做的不是删内容，而是把模块改造成：

**固定骨架 + 局部滚动 + 信息分层承载。**

---

如果你要，我下一条我可以直接继续给你一版更落地的内容：

**三张页面的线框级原型描述稿**，你可以直接拿去喂给 AI 画图工具或交给前端画原型。
