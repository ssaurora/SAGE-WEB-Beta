先给一句总判断：

**你现在不是“不会改”，而是“改到一半开始心软”。**  
壳层已经收了，Workbench 和 Governance 也已经开始有“状态 / 决策 / 证据”的意识，但现在最大的问题是：**你还没有把次要信息真正赶出首屏。**

---

# 一、Workbench 第二刀整改清单

你当前 Workbench 已经形成：

- 顶部 `Current State`
    
- 左侧 `Inputs / Layers`
    
- 中部 `State Focus / Map Canvas`
    
- 右侧 `Analysis / Context / Object Inspector`
    

这比旧版强，但还不够。第二刀的目标不是再排版，而是：

> **让状态真正决定谁能留在首屏，谁必须后退。**

---

## 1. 顶部 Current State：保留，但必须收权

当前顶部把这些信息并列摆在一起：

- 状态
    
- Role
    
- Required Ready
    
- Missing
    
- Invalid
    
- Visible Layers
    
- Open Governance
    
- Open Results
    
- 主按钮
    

### 你要改什么

#### 必改 1：只保留一个主动作

顶部右侧不能同时高调出现：

- Open Governance
    
- Open Results
    
- 主动作按钮
    

这会直接稀释“下一步动作唯一性”。

### 改法

按状态切换：

- `Waiting for Required Input / Action Required / Failed`：只突出 `Fix and Resume` 或修复类主动作，Governance 作为弱链接
    
- `Running / Queued / Processing Results`：只突出 `Open Governance`
    
- `Completed`：只突出 `View Results`
    

#### 必改 2：缩掉“Visible Layers”

`Visible Layers` 不该和 `Missing / Invalid` 同级。  
它是图层操作信息，不是任务决策信息。

#### 必改 3：Role 降级

`Role: {role}` 现在仍然占据顶部状态行的一席之地  
这在首屏里权重过高。  
应降到 hover、tooltip，或者只在只读态时用一句提示替代。

---

## 2. Navigation Context：不许再独占一张 Card

你现在左上角仍保留 `Navigation Context` 独立卡片

### 问题

这是典型的“因为有用，所以给一整块”的旧习惯。  
它有信息价值，但没有首屏决策价值。

### 改法

改成下面二选一：

- 放进顶部 Current State 下方一行弱说明
    
- 做成 breadcrumb / 轻量上下文条
    

**禁止继续独立成 Card。**

---

## 3. Inputs 区：保留，但必须成为“输入控制区”，不是“资料展示区”

当前 `Inputs` 还是一个完整 Card，里面塞了整个 `InputsPanelInteractive`

### 问题

在 `Running / Completed` 态，这块虽然只读，但仍然占据高权重首屏空间。  
这说明状态还没真正接管布局。

### 改法

#### 当 `Waiting for Required Input / Action Required / Failed`

- Inputs 保持首要位置
    
- 显示缺失项、异常绑定、绑定入口
    
- 地图退为辅助
    

#### 当 `Running / Queued / Processing Results`

- Inputs 自动折叠为摘要条
    
- 只显示 `Required Ready / Missing / Invalid`
    
- 点击后再展开
    

#### 当 `Completed`

- Inputs 默认折叠
    
- 不再以完整面板常驻首屏
    

---

## 4. Layers 区：必须进一步降级

你现在 `Layers` 仍然是左侧一个完整大块，里面还有：

- visible count
    
- reset
    
- input layers
    
- result layers
    
- reorder / hide / show / opacity
    

### 问题

这块太像传统 GIS 操作面板了。  
而你的 Workbench 不是通用 GIS 客户端，是任务工作台。

### 改法

#### 必改

- 默认只显示“当前激活图层数 + 图层入口”
    
- 图层详细控制收成抽屉或折叠面板
    
- `Opacity / Move Up / Move Down` 这类精细控制默认隐藏到二级操作
    

### 判断标准

首屏里用户应该先看到“任务是否能继续”，  
不是先看到“图层能不能上移一位”。

---

## 5. State Focus：方向对，但还不够强

你已经加了 `State Focus`，并按状态显示：

- Input / Recovery Focus
    
- Runtime Progress
    
- Result Ready
    
- 只读提示
    

### 问题

它现在还是“中间多出来的一张状态卡”，  
而不是“真正压过其他区块的主中心”。

### 改法

#### 必改 1：在不同状态下改变中区高度分配

不是所有状态都 `State Focus + Map Canvas` 平分注意力。

建议：

- `Waiting / Failed / Action Required`：State Focus 占中区上半甚至 2/3，地图缩小
    
- `Running`：State Focus 保持明显可见，地图作为背景画布
    
- `Completed`：State Focus 退化成结果摘要条，地图与结果联动成为中心
    

#### 必改 2：把 `State Focus` 和主按钮绑定

现在主按钮在顶部，State Focus 在中区，它们割裂。  
这会削弱行动压强。

更合理的是：

- 当前阶段主按钮应出现在 State Focus 里
    
- 顶部只保留状态摘要
    

---

## 6. Map Canvas：别动掉，但必须允许“让位”

当前地图仍然是中间主块之一，这没有错  
但你现在的问题是：**地图还没学会在不该当主角的时候退后。**

### 改法

#### `Waiting / Failed / Action Required`

地图只承担：

- 空间上下文
    
- 输入位置确认
    
- 可选对象检查
    

不承担主视觉。

#### `Running`

地图可作为“观察画布”，但不可和进度信息抢中心。

#### `Completed`

地图才重新上升为结果主画布。

---

## 7. Analysis / Context：这块必须拆

现在这个块里还是三类东西混在一起：

- Suggested Next Steps
    
- contextSummary
    
- lifecycleSummary
    

### 问题

这仍然是大杂烩。  
你只是换了名字，没有拆语义。

### 改法

必须拆成两个层级：

#### A. Next Step 区

只保留 1–3 条真正有行动含义的建议。  
这块可留首屏。

#### B. Context Summary / Lifecycle Summary

统一下沉到“Execution Context”折叠区。  
不许再首屏常驻两块大文字框。

---

## 8. Object Inspector：必须抽屉化或条件化

现在它还是右下角一整张完整 Card，且长期常驻

### 这是 Workbench 当前最该挨刀的模块之一

### 改法

#### 必改 1：默认折叠

未选中对象时，不许占完整大块。  
只保留一句轻提示或一个“Object Inspector”入口。

#### 必改 2：选中对象后以抽屉 / 浮层形式展开

不是固定占右侧常驻面积。

#### 必改 3：把“Open Task Governance / Open Result Detail”保留为对象级动作

这个是有价值的，因为它是空间对象索引到治理和结果的桥梁。  
但动作应该跟随对象出现，而不是绑定在一个永驻大面板上。

---

# 二、Governance 第二刀整改清单

你现在 Governance 页已经有：

- 顶部状态卡 + Next Action
    
- RecoveryPanel
    
- Decision Zone
    
- Evidence Zone 标题
    
- Governance Panel / Missing Inputs / Artifacts
    
- Manifest Snapshot
    
- Lifecycle Events / Audit Summary
    

问题是：

> **你现在已经有“决策区 / 证据区”的概念，但结构还没真正合拢。**

---

## 1. 顶部状态卡、RecoveryPanel、Decision Zone：必须合并成一个“首屏决策中心”

这是 Governance 最大的问题。

当前首屏决策信息被拆成三块：

- 顶部卡里的 `Next Action`
    
- `GovernanceRecoveryPanel`
    
- `Decision Zone` 里的 `Why this status / Primary decision`
    

### 问题

用户仍然需要自己拼：

- 状态是什么
    
- 原因是什么
    
- 动作在哪
    
- 是否可恢复
    

### 改法

把这三块合并成一个真正的 **Decision Center**：

#### 统一容纳

- 当前状态
    
- 是否可恢复 / 可取消 / 结果可用
    
- Why this status
    
- Primary decision
    
- 主按钮
    
- 次级动作
    

### 要求

用户首屏不应扫描三个块后才知道下一步。

---

## 2. Evidence Zone 不能只是一个标题卡

你现在单独放了一个 `Evidence Zone` Card，但里面没有真正的交互分层，只是下面继续铺内容

### 问题

这属于“概念先到，结构没到”。

### 改法

Evidence Zone 必须真的接管下面的内容组织。建议做成 tab：

- Required Actions / Fixes
    
- Inputs / Bindings
    
- Manifest
    
- Events
    
- Artifacts
    
- Audit
    

不要再让这些东西全都一屏往下排。

---

## 3. Governance Panel：必须拆成“阻塞项”和“修复建议”

当前 `Governance Panel` 里混着：

- Required Actions
    
- Suggested Fixes
    
- Failure Summary
    

### 问题

这三者不是一个层级：

- Required Actions 是必须做的
    
- Suggested Fixes 是建议性的
    
- Failure Summary 是原因证据
    

### 改法

必须分层：

#### 阻塞项

- Missing inputs
    
- Invalid bindings
    
- Required actions
    

#### 修复建议

- Suggested fixes
    
- 恢复建议
    

#### 失败证据

- Failure summary
    

不能继续塞在一个泛泛的 `Governance Panel` 里。

---

## 4. Missing Required Inputs 和 Artifacts：不要再平级大卡展示

你现在把 `Missing Required Inputs` 和 `Artifacts` 也作为完整 Card 并列展示

### 问题

Artifacts 明显不是当前所有状态都该高权重显示的。  
尤其在待恢复态，它根本不该和缺失输入抢视觉。

### 改法

#### `Missing Required Inputs`

- 在待输入 / 可恢复失败态可前置
    
- 在完成态自动降级
    

#### `Artifacts`

- 一律降到证据区二级 tab
    
- 不许再和缺失输入同级首屏出现
    

---

## 5. Manifest Snapshot：方向对，但阅读方式还太笨

你已经把它包成 `Manifest Snapshot` 了，这一步是对的

### 但还差一步

它现在还是完整大块式阅读。  
这会让用户在 Governance 页里再次进入“看资料”的感觉。

### 改法

- 首屏只显示 manifest 摘要信息
    
- 展开后再看树状详情
    
- 优先显示变更最相关部分：输入、runtime profile、analysis type
    

---

## 6. Lifecycle Events 和 Audit Summary：必须继续收

你已经把它们放到页面更后面，这比之前强了  
但还不够。

### 改法

#### Lifecycle Events

- 首屏只显示最近 3 条关键事件
    
- 全量事件进 timeline drawer / tab
    

#### Audit Summary

- 只保留摘要一句
    
- 点击进入完整审计视图
    

不然 Governance 页还是会慢慢滑回“资料堆叠页”。

---

## 7. Navigation Context：同样必须弱化

Governance 里你还保留了独立 `Navigation Context` Card

### 改法

和 Workbench 一样：

- 降成弱 breadcrumb
    
- 或放入页头轻上下文区
    
- 不准再占完整卡片
    

---

# 三、你下一轮的实施顺序

别同时大改所有页。按这个顺序来：

## 第一步：Workbench 第二刀

优先做：

1. 删掉 Navigation Context 独立 Card
    
2. 折叠 Layers 详细控制
    
3. 拆掉 Analysis / Context 大杂烩
    
4. Object Inspector 抽屉化
    
5. State Focus 绑定唯一主动作
    

## 第二步：Governance 第二刀

优先做：

1. 合并 顶部状态卡 + RecoveryPanel + Decision Zone
    
2. Evidence Zone 真正 tab 化
    
3. Artifacts 下沉
    
4. Events / Audit 进一步后置
    

## 第三步：再动 Results / Overview

因为你现在最大的收益，仍然在 Workbench 和 Governance。

---

# 四、最终验收标准

你下一轮改完后，我会用这 6 条审：

1. **Workbench 首屏是否只剩一个主动作**
    
2. **Waiting / Running / Completed 三种状态下，中区主焦点是否真的不同**
    
3. **Object Inspector 是否已经不再常驻抢权**
    
4. **Governance 首屏是否不需要跨三个卡片拼凑决策**
    
5. **Evidence Zone 是否已经不是“一个标题 + 一堆旧内容”**
    
6. **低价值说明块是否真的被清理，而不是换位置继续活着**
    

---

# 五、一句最直接的批语

你现在最大的问题已经不是“不会设计”，而是：

> **你已经知道谁不重要了，但还没狠下心把它赶出去。**

真正的第二刀，不是重新摆放，  
而是**让不该在首屏的东西，真的消失**。

你要的话，我下一条直接可以继续给你写成 **“可交给前端开发的逐组件整改任务单”**。