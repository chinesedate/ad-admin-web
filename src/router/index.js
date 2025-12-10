import Vue from 'vue';
import VueRouter from 'vue-router'
import Layout from '@/layout/index';
import AllWidthLayout from '@/layout/all-width-layout';
import BookLayout from '@/layout/book-layout';
import HomeLayout from '@/layout/home-layout';
import Login from '@/views/login';
import store from "@/store";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'IndexHome',
        component: () => import('@/views/ad/ad_data')
      }
    ]
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index')
      }
    ]
  },
  {
    path: '/ad_data',
    component: Layout,
    children: [
      {
        path: '',
        name: 'AdData',
        component: () => import('@/views/ad/ad_data.vue')
      }
    ],
    props: {
      menuIndex: 'ad-data'
    }
  },
  {
    path: '/ad_channel',
    component: Layout,
    children: [
      {
        path: '',
        name: 'AdChannel',
        component: () => import('@/views/ad/ad_channel.vue')
      }
    ],
    props: {
      menuIndex: 'ad-channel'
    }
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/tool',
  //   children: [
  //     {
  //       path: 'tool',
  //       name: 'Tool',
  //       components: {
  //         default: () => import('@/views/tool/tool'),
  //         footer: () => import('@/components/brief-footer-page')
  //       }
  //     }
  //   ]
  // },
  {
    path: '/qa-info-audit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'QaInfoAudit',
        component: () => import('@/views/audit/qa-info-audit')
      }
    ]
  },
  {
    path: '/qa-answer-audit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'QaAnswerAudit',
        component: () => import('@/views/audit/qa-answer-audit')
      }
    ]
  },
  {
    path: '/qa-tab-audit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'QaTabAudit',
        component: () => import('@/views/audit/qa-tab-audit')
      }
    ]
  },
  {
    path: '/qa-tool-audit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'QaToolAudit',
        component: () => import('@/views/audit/qa-tool-audit')
      }
    ]
  },
  {
    path: '/tool-audit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ToolAudit',
        component: () => import('@/views/audit/tool-audit')
      }
    ]
  },
  {
    path: '/name-manage',
    component: Layout,
    children: [
      {
        path: '',
        name: 'NameManage',
        component: () => import('@/views/audit/name-manage')
      }
    ]
  },
  {
    path: '/modify-data-audit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ModifyDataAudit',
        component: () => import('@/views/audit/modify-data-audit')
      }
    ]
  },
  {
    path: '/user-audit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'UserAudit',
        component: () => import('@/views/audit/user-audit')
      }
    ]
  },
  {
    path: '/tool-edit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ToolEdit',
        component: () => import('@/views/audit/tool-edit')
      }
    ]
  },
  {
    path: '/article-audit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ArticleAudit',
        component: () => import('@/views/article/article-audit')
      }
    ]
  },
  {
    path: '/article-edit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ArticleEdit',
        component: () => import('@/views/article/article-edit')
      }
    ]
  },
  {
    path: '/tool-category-audit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ToolCategoryAudit',
        component: () => import('@/views/audit/tool-category-audit')
      }
    ]
  },
  {
    path: '/tool-category-edit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ToolCategoryEdit',
        component: () => import('@/views/audit/tool-category-edit')
      }
    ]
  },
  {
    path: '/issue-audit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'IssueAudit',
        component: () => import('@/views/issue/issue')
      }
    ]
  },
  {
    path: '/about',
    component: Layout,
    children: [
      {
        path: '',
        name: 'About',
        component: () => import('@/views/others/about')
      }
    ]
  },
  {
    path: '/advertisement',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Advertisement',
        component: () => import('@/views/others/advertisement')
      }
    ]
  },
  {
    path: '/join-us',
    component: Layout,
    children: [
      {
        path: '',
        name: 'JoinUs',
        component: () => import('@/views/others/join-us')
      }
    ]
  },
  {
    path: '/feedback',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Feedback',
        component: () => import('@/views/others/feedback')
      }
    ]
  },
  {
    path: '/add-project',
    component: Layout,
    children: [
      {
        path: '',
        name: 'AddProject',
        component: () => import('@/views/project/add-project')
      }
    ]
  },
  {
    path: '/project/:projectId',
    component: Layout,
    children: [
      {
        path: ':tab',
        name: 'Project',
        props: true,
        component: () => import('@/views/project/project')
      }
    ]
  },
  {
    path: '/add-iteration',
    component: Layout,
    children: [
      {
        path: '',
        name: 'AddIteration',
        component: () => import('@/views/iteration/add-iteration')
      }
    ]
  },
  {
    path: '/add-source',
    component: Layout,
    children: [
      {
        path: '',
        name: 'AddSource',
        component: () => import('@/views/source/add-source')
      }
    ]
  },
  {
    path: '/source/:sourceId',
    component: AllWidthLayout,
    children: [
      {
        path: '',
        name: 'Source',
        props: true,
        component: () => import('@/views/source/api-source')
      }
    ]
  },
  {
    path: '/add-doc',
    component: Layout,
    children: [
      {
        path: '',
        name: 'AddDocumentation',
        component: () => import('@/views/documentation/add-documentation')
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/sign-up',
    component: Layout,
    children: [{
      path: '',
      name: 'SignUp',
      component: () => import('@/views/SignUp')
    }]
  },
  {
    path: '/book',
    component: BookLayout,
    children: [{
      path: '',
      name: 'Book',
      props: (route) => ({id: route.query.bookId}),
      component: () => import('@/views/book/Book')
    }]
  },
  {
    path: '/book/add',
    component: HomeLayout,
    children: [{
      path: '',
      name: 'AddBook',
      components: {
        default: () => import('@/views/book/add-book'),
        footer: () => import('@/components/brief-footer-page')
      }
    }]
  },
  {
    path: '/book/hub',
    component: Layout,
    props: true,
    children: [{
      path: ':bookId',
      name: 'BookHub',
      props: true,
      component: () => import('@/views/book/BookHub')
    }]
  },
  {
    path: '/book/screen',
    component: Layout,
    props: true,
    children: [{
      path: ':content',
      name: 'BookScreen',
      props: true,
      component: () => import('@/views/book/BookScreen')
    }]
  },
  {
    path: '/qa',
    component: Layout,
    children: [
      {
        path: '',
        name: 'QuestionAnswer',
        component: () => import('@/views/question-answer/index')
      },
      {
        path: 'ask',
        name: 'AskQuestion',
        component: () => import('@/views/question-answer/AskQuestion')
      },
      {
        path: 'answer',
        name: 'Answer',
        component: () => import('@/views/question-answer/Answer')
      },
      {
        path: 'question/:questionId',
        name: 'Question',
        props: true,
        component: () => import('@/views/question-answer/Question')
      }
    ]
  },
  {
    path: '/point',
    component: Layout,
    children: [{
      path: '',
      name: 'Point',
      component: () => import('@/views/point/index')
    }]
  },
  {
    path: '/community',
    component: Layout,
    children: [{
      path: '',
      name: 'Community',
      component: () => import('@/views/community/index')
    }]
  },
  {
    path: '/article',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Article',
        component: () => import('@/views/article/index')
      },
      {
        path: 'add',
        name: 'AddArticle',
        component: () => import('@/views/article/AddArticle')
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: ':userId',
        name: 'User',
        props: true,
        component: () => import('@/views/user/index'),
        children: [
          {
            path: 'account',
            name: 'UserAccount',
            component: () => import('@/views/user/info-component/account')
          },
          {
            path: 'contribution',
            name: 'UserContribution',
            component: () => import('@/views/user/info-component/contribution')
          },
          {
            path: 'favorite',
            name: 'UserFavorite',
            component: () => import('@/views/user/info-component/favorite')
          },
          {
            path: 'follow',
            name: 'UserFollow',
            component: () => import('@/views/user/info-component/follow')
          },
          {
            path: 'history',
            name: 'UserHistory',
            component: () => import('@/views/user/info-component/history')
          },
          {
            path: 'honor',
            name: 'UserHonor',
            component: () => import('@/views/user/info-component/honor')
          }, {
            path: 'income',
            name: 'UserIncome',
            component: () => import('@/views/user/info-component/income')
          },
          {
            path: 'security',
            name: 'UserSecurity',
            component: () => import('@/views/user/info-component/security')
          },
          {
            path: 'setting',
            name: 'UserSetting',
            component: () => import('@/views/user/info-component/setting')
          },
          {
            path: 'book',
            name: 'UserBook',
            component: () => import('@/views/user/info-component/book')
          }
        ]
      }
    ]
  }
]

/**
 * 禁止全局路由错误处理打印
 * @param location
 * @param onResolve
 * @param onReject
 * @returns {Promise<Route>|void|Promise<Route>}
 */
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
const createRouter = () => new VueRouter({
  mode: "history",
  // base: '/admin',
  routes,
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
  }
})
const router = createRouter()

router.beforeEach(((to, from, next) => {
  document.title = '管理平台'
  // 检测当前页面是否登录，如果没有登录则跳转到登录页
  if (to.path !== '/login' && !store.getters.token) {
    router.replace({
      path: '/login'
    }).then();
  } else {
    next();
  }
}))

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
