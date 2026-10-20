/**
 * 侧边栏菜单配置。
 *
 * permission：与后端权限点(perm_code)一一对应，没有该权限点的用户看不到这一项；
 *             留空表示所有登录用户可见。
 * prefixes：  用于路由高亮匹配，详情页等子路径也能高亮到所属菜单。
 * children：  有子项时渲染为二级菜单；父级本身不配 path/permission，有任一子项可见则显示。
 */
export const menus = [
  {
    index: 'ad-data',
    title: '广告数据',
    icon: 'el-icon-s-data',
    path: '/ad_data',
    permission: 'ad_data:list',
    prefixes: ['/', '/ad_data']
  },
  {
    index: 'ad-link',
    title: '链接',
    icon: 'el-icon-link',
    path: '/ad_link/list',
    permission: 'adv_link:list',
    prefixes: ['/ad_link']
  },
  {
    index: 'ad-channel',
    title: '渠道信息',
    icon: 'el-icon-share',
    path: '/ad_channel',
    permission: 'channel:list',
    prefixes: ['/ad_channel']
  },
  {
    index: 'base-config',
    title: '基础配置',
    icon: 'el-icon-setting',
    children: [
      {
        index: 'adv-media-list',
        title: '预算媒体管理',
        path: '/adv_media_list',
        permission: 'adv_media:list',
        prefixes: ['/adv_media_list']
      },
      {
        index: 'adv-channel-up-down-list',
        title: '渠道上下游',
        path: '/adv_channel_up_down_list',
        permission: 'up_down_info:list',
        prefixes: ['/adv_channel_up_down_list']
      },
      {
        index: 'adv-channel-action-list',
        title: '转化配置',
        path: '/adv_channel_action_list',
        permission: 'up_down_action:list',
        prefixes: ['/adv_channel_action_list']
      }
    ]
  },
  {
    index: 'link-config',
    title: '链接配置',
    icon: 'el-icon-link',
    children: [
      {
        index: 'adv-budget-link-list',
        title: '预算链接',
        path: '/adv_budget_link_list',
        permission: 'adv_link:list',
        prefixes: ['/adv_budget_link_list']
      },
      {
        index: 'adv-media-link-list',
        title: '媒体链接',
        path: '/adv_media_link_list',
        permission: 'media_link:list',
        prefixes: ['/adv_media_link_list', '/adv_media_link_debug']
      }
    ]
  },
  {
    index: 'biz-tools',
    title: '业务工具',
    icon: 'el-icon-s-cooperation',
    children: [
      {
        index: 'media-flow-allocate-list',
        title: '流量分配',
        path: '/media_flow_allocate_list',
        permission: 'flow:list',
        prefixes: ['/media_flow_allocate_list']
      },
      {
        index: 'app-show-data-supply-list',
        title: '曝光补充',
        path: '/app_show_data_supply_list',
        permission: 'app_show:list',
        prefixes: ['/app_show_data_supply_list']
      },
      {
        index: 'honor-supplement',
        title: '荣耀补回传',
        path: '/honor_supplement',
        permission: 'honor_supplement:list',
        prefixes: ['/honor_supplement']
      }
    ]
  },
  {
    index: 'user-permission',
    title: '用户权限',
    icon: 'el-icon-user',
    path: '/user_permission',
    permission: 'user:list',
    prefixes: ['/user_permission']
  }
]

export default menus
