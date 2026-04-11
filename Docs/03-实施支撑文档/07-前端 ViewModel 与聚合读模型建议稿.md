## 1. 文档目的

本文不定义真实后端接口字段，也不假设具体 DTO/VO 命名，而是从前端页面与组件需要的数据出发，提出一套**前端 ViewModel / 聚合读模型建议**。

目标是回答以下问题：

1. 页面真正需要哪些数据块。
    
2. 哪些数据适合由后端直接聚合提供。
    
3. 哪些数据可以由前端基于原始字段派生。
    
4. 哪些对象应成为页面级 ViewModel，而不是让组件直接读取底层接口碎片。
    

本文用于指导：

- 前后端接口设计讨论
    
- 前端状态管理设计
    
- 页面级读模型聚合设计
    
- BFF / 网关层聚合设计（如采用）
    

---

## 2. 设计原则

### 2.1 页面消费 ViewModel，不直接消费底层碎片对象

前端页面应尽量面向：

- `SceneListItemViewModel`
    
- `WorkbenchViewModel`
    
- `TaskDetailViewModel`
    
- `ReportDetailViewModel`
    

而不是在页面中自行拼接大量分散对象。

### 2.2 权威事实与建议性信息分层

所有 ViewModel 应明确区分：

- `facts`：权威事实
    
- `suggestions`：建议性说明
    
- `explanations`：可解释性文本/摘要
    

### 2.3 用户侧 ViewModel 优先使用产品术语

ViewModel 字段命名应尽量围绕以下术语：

- scene
    
- analysis type
    
- model
    
- required inputs
    
- current state
    
- suggested fix
    
- manifest summary
    
- result summary
    

避免让前端页面长期依赖内部实现术语作为主对象。

### 2.4 一个页面一个主 ViewModel

建议每个页面定义一个顶层 ViewModel，再拆成子 ViewModel。

例如：

- `WorkbenchPageViewModel`
    
    - `WorkbenchHeaderViewModel`
        
    - `InputBindingViewModel`
        
    - `AnalysisAssistantViewModel`
        
    - `TaskFactsViewModel`
        
    - `ContextSummaryViewModel`
        
    - `MapViewModel`
        

---

## 3. 页面级读模型建议

## 3.1 Scenes 页面

### 顶层对象

`ScenesPageViewModel`

### 建议结构

```text
ScenesPageViewModel
- page_title
- scene_items[]: SceneListItemViewModel
- filter_state
- sort_state
- empty_state
```

### SceneListItemViewModel

```text
SceneListItemViewModel
- scene_id
- scene_name
- description
- analysis_theme
- latest_task_state
- pending_item_count
- updated_at
- quick_actions
```

### 建议由后端直接聚合提供的内容

- `latest_task_state`
    
- `pending_item_count`
    
- `analysis_theme`
    

不建议前端自己从多个 task 记录实时拼出这些摘要。

---

## 3.2 Scene Overview 页面

### 顶层对象

`SceneOverviewPageViewModel`

### 建议结构

```text
SceneOverviewPageViewModel
- scene_meta: SceneMetaViewModel
- scene_summary: SceneSummaryViewModel
- latest_task_summary
- latest_result_summary
- pending_actions[]
- map_preview
- recent_activities[]
```

### 说明

该页面重点是“摘要化”，适合后端直接提供聚合结果，而不是让前端自己遍历 tasks / results / assets。

---

## 3.3 Scene Workbench 页面

### 顶层对象

`WorkbenchPageViewModel`

### 建议结构

```text
WorkbenchPageViewModel
- scene_meta
- current_task_summary
- header: WorkbenchHeaderViewModel
- inputs_panel: InputBindingsPanelViewModel
- layers_panel: LayerPanelViewModel
- map: MapViewModel
- analysis_panel: AnalysisAssistantViewModel
- task_panel: TaskFactsViewModel
- context_panel: ContextSummaryViewModel
- page_state
```

### 3.3.1 WorkbenchHeaderViewModel

```text
WorkbenchHeaderViewModel
- scene_name
- analysis_type
- model_name
- current_state
- required_inputs_ready_text
- primary_action
- secondary_actions[]
- banner_message
```

### 建议后端直接提供

- `analysis_type`
    
- `model_name`
    
- `current_state`
    
- `required_inputs_ready_text` 或用于生成它的聚合字段
    

### 3.3.2 InputBindingsPanelViewModel

```text
InputBindingsPanelViewModel
- required_inputs[]
- optional_inputs[]
- uploaded_unbound_assets[]
- validation_summary
```

#### InputBindingItemViewModel

```text
InputBindingItemViewModel
- role_key
- display_name
- expected_type
- binding_status
- bound_asset_summary
- available_actions[]
- issue_summary
```

### 建议后端直接提供

- `binding_status`
    
- `issue_summary`
    
- `expected_type`
    

不建议前端自行根据多个底层字段推理 `missing / invalid / bound`。

### 3.3.3 AnalysisAssistantViewModel

```text
AnalysisAssistantViewModel
- user_intent_summary
- analysis_type
- model_name
- confidence_label
- planning_summary
- missing_inputs[]
- suggested_next_steps[]
- chat_messages[]
- input_box_state
```

### 建议后端直接提供

- `user_intent_summary`
    
- `planning_summary`
    
- `suggested_next_steps`
    

### 3.3.4 TaskFactsViewModel

```text
TaskFactsViewModel
- current_state
- current_workflow_stage
- task_id
- can_resume
- missing_required_inputs[]
- invalid_bindings[]
- required_user_actions[]
- suggested_fix_summary
```

### 说明

这是 Workbench 中最关键的治理对象之一，适合后端直接聚合，不建议前端自己从 waiting_context、validation、task_state 碎片拼接。

### 3.3.5 ContextSummaryViewModel

```text
ContextSummaryViewModel
- scene_facts
- bound_inputs[]
- execution_context_summary
- manifest_summary
```

#### SceneFactsViewModel

```text
SceneFactsViewModel
- scene_name
- region_label
- crs_label
- spatial_extent_summary
- last_updated
```

#### BoundInputSummaryViewModel

```text
BoundInputSummaryViewModel
- role_name
- asset_name
- asset_type
- binding_state
```

#### ExecutionContextSummaryViewModel

```text
ExecutionContextSummaryViewModel
- model_name
- execution_mode_label
- runtime_profile_label
- workflow_label_optional
```

#### ManifestSummaryViewModel

```text
ManifestSummaryViewModel
- manifest_status
- planning_revision_label
- validation_status
- bound_inputs_count
- runtime_checks_summary
- analysis_signature
```

### 3.3.6 MapViewModel

```text
MapViewModel
- scene_extent
- active_layer_id
- active_layer_label
- basemap_options[]
- input_layers[]
- output_layers[]
- context_layers[]
- map_status
- status_bar
```

#### LayerItemViewModel

```text
LayerItemViewModel
- layer_id
- layer_name
- layer_group
- visible
- selectable
- zoomable
- info_available
- is_result_layer
```

---

## 3.4 Tasks 页面

### 顶层对象

`TasksPageViewModel`

### 建议结构

```text
TasksPageViewModel
- filters
- status_tabs
- task_items[]: TaskListItemViewModel
- empty_state
```

### TaskListItemViewModel

```text
TaskListItemViewModel
- task_id
- scene_name
- analysis_type
- model_name
- current_state
- updated_at
- can_resume
- result_available
```

### 建议后端直接提供

- `can_resume`
    
- `result_available`
    

不建议前端自己从多个 task / result 状态交叉判断。

---

## 3.5 Task Detail / Governance 页面

### 顶层对象

`TaskDetailPageViewModel`

### 建议结构

```text
TaskDetailPageViewModel
- top_summary
- lifecycle
- governance
- events
- manifest
- audit
- result_bundle
- artifacts
- optional_explanation_summary
```

### 3.5.1 TaskTopSummaryViewModel

```text
TaskTopSummaryViewModel
- task_id
- scene_name
- analysis_type
- model_name
- current_state
- created_at
- updated_at
- planning_revision_label
- checkpoint_version_label
- latest_result_bundle_id
```

### 3.5.2 LifecycleViewModel

```text
LifecycleViewModel
- current_state
- steps[]
- current_stage_detail
```

#### LifecycleStepViewModel

```text
LifecycleStepViewModel
- step_key
- display_name
- step_status
- timestamp_optional
```

### 3.5.3 GovernanceViewModel

```text
GovernanceViewModel
- current_state
- waiting_context_summary
- missing_inputs[]
- invalid_bindings[]
- required_actions[]
- can_resume
- suggested_fix
- resume_entry_enabled
```

### 3.5.4 EventsViewModel

```text
EventsViewModel
- event_items[]
- filter_state
```

#### EventItemViewModel

```text
EventItemViewModel
- event_time
- event_type
- event_summary
- related_state
- expandable_detail_optional
```

### 3.5.5 TaskManifestViewModel

```text
TaskManifestViewModel
- manifest_status
- planning_revision_label
- validation_status
- bound_inputs_summary[]
- runtime_checks_summary
- analysis_signature
- advanced_available
```

### 3.5.6 AuditViewModel

```text
AuditViewModel
- audit_items[]
- filter_state
```

### 3.5.7 ResultBundleViewModel

```text
ResultBundleViewModel
- bundle_status
- primary_outputs[]
- quality_flags[]
- failure_summary_optional
- log_refs_optional
```

### 3.5.8 ArtifactListViewModel

```text
ArtifactListViewModel
- artifact_items[]
```

#### ArtifactItemViewModel

```text
ArtifactItemViewModel
- artifact_name
- artifact_type
- artifact_source
- preview_available
- download_available
```

---

## 3.6 Assets 页面

### 顶层对象

`AssetsPageViewModel`

### 建议结构

```text
AssetsPageViewModel
- asset_items[]
- filters
- empty_state
```

### AssetListItemViewModel

```text
AssetListItemViewModel
- asset_id
- asset_name
- asset_type
- format
- status
- used_by_scenes_count
- used_by_tasks_count
- uploaded_at
```

### AssetDetailPageViewModel

```text
AssetDetailPageViewModel
- asset_meta
- preview_map
- usage_relations[]
- binding_history[]
```

---

## 3.7 Results 页面

### 顶层对象

`ResultsPageViewModel`

### 建议结构

```text
ResultsPageViewModel
- filters
- result_items[]
- empty_state
```

### ResultListItemViewModel

```text
ResultListItemViewModel
- result_id
- scene_name
- analysis_type
- model_name
- result_summary
- generated_at
- export_available
```

### ResultDetailPageViewModel

```text
ResultDetailPageViewModel
- result_summary
- result_map
- metrics
- explanation
- related_task
- related_scene
- related_manifest_summary
- exports[]
```

#### ResultSummaryViewModel

```text
ResultSummaryViewModel
- analysis_type
- model_name
- key_parameter_summary
- result_summary_text
- quality_summary
```

#### MetricCardViewModel

```text
MetricCardViewModel
- metric_name
- metric_value
- metric_unit_optional
- metric_summary_optional
```

---

## 4. 哪些数据应由后端直接聚合

前端不应承担以下聚合责任，建议后端或 BFF 直接提供：

1. `required_inputs_ready_text` / 就绪比例
    
2. `missing_required_inputs[]`
    
3. `invalid_bindings[]`
    
4. `suggested_fix_summary`
    
5. `can_resume`
    
6. `result_available`
    
7. `latest_task_state`
    
8. `latest_result_summary`
    
9. `manifest_summary`
    
10. `result_bundle_summary`
    

原因是这些对象都属于“多源事实归并后的用户侧投影”，不适合让前端在页面层自行推理。

---

## 5. 哪些数据可由前端派生

前端可以安全派生的内容包括：

1. 纯展示文案拼接
    
2. 轻量状态标签映射
    
3. 列表排序与筛选显示状态
    
4. Tab 可见性
    
5. 空状态提示文案
    
6. `x/y` 这类纯数字展示（如果已给底层计数）
    

前端不应自行派生的内容包括：

1. 可恢复性判断
    
2. 缺失输入判断
    
3. 无效绑定判断
    
4. 结果是否可用判断
    
5. Manifest 是否处于可执行态判断
    
6. 任务主状态归因
    

---

## 6. 状态管理建议

### 6.1 页面级状态建议

建议按页面维护页面级 ViewModel，而不是让页面直接依赖十几个独立 store。

### 6.2 局部组件状态建议

组件本地仅维护：

- 展开/收起
    
- 当前 tab
    
- 轻量输入框内容
    
- modal / drawer 开关
    

业务事实状态应放在页面级 ViewModel 或全局任务/场景 store 中。

---

## 7. 读模型拆分建议

如后端允许，建议形成以下聚合读模型接口方向：

- Scene list summary
    
- Scene overview summary
    
- Workbench page aggregate
    
- Task detail aggregate
    
- Asset detail aggregate
    
- Report detail aggregate
    

相比大量碎片接口，这更适合你的产品形态。

---

## 8. 最小落地顺序

1. 先定义 `WorkbenchPageViewModel`
    
2. 再定义 `TaskDetailPageViewModel`
    
3. 再定义 `ReportDetailPageViewModel`
    
4. 然后补齐 Scene / Assets / Reports 列表级对象
    
5. 最后再扩展高级模式与审计模式字段
    

---

## 9. 输出给团队的使用建议

### 给前端

- 以页面级 ViewModel 为核心组织数据
    
- 不要在组件里自行做复杂业务推理
    

### 给后端

- 优先提供用户侧聚合摘要对象
    
- 不要把所有用户侧投影责任下放给前端
    

### 给产品 / 架构

- 把 ViewModel 当作“用户视图契约”讨论
    
- 不要只讨论底层实体对象