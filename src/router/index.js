import Vue from 'vue'
import Router from 'vue-router'
import Room from '@/components/Room'
import Computer from '@/components/Computer'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Room',
      name: 'Room',
      component: Room
    },
    {
      path: '/computer',
      name: 'Computer',
      component: Computer
    }
  ]
})
