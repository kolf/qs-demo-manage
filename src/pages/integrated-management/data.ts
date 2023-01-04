// 预警类型
export let earlyWarningType = [
  {
    title: '预警总数',
    key: 'warSum',
    count: 0,
  },
  {
    title: '已关闭预警',
    key: 'warClose',
    count: 0,
  },
  {
    title: '待处理预警',
    key: 'pending',
    count: 0,
  },
  {
    title: '正在处理预警',
    key: 'processing',
    count: 0,
  },
]

// 工单相关
export let workOrderType = [
  {
    title: '工单总数',
    key: 'workSum',
    count: 0,
  },
  {
    title: '我创建的',
    key: 'createSum',
    count: 0,
  },
  {
    title: '我相关的',
    key: 'relatedSum',
    count: 0,
  },
  // {
  //   title: '我的待办',
  //   key: 'backlogSum',
  //   count: 0,
  // },
]

// 工单标签
export let workOrderTabs = [
  {
    label: '所有工单',
    icon: 'satellite',
    key: 1,
  },
  // {
  //   label: '我的代办',
  //   icon: 'tab2_icon',
  //   key: 2,
  // },
]   