import lazyLoading from './lazyLoading.js'

export default {
  name: 'tables',
  meta: {
    title: 'Collections',
    iconClass: 'vuestic-icon vuestic-icon-extras'
  },
  path: '/tables',
  component: lazyLoading('tables/Table')
}
