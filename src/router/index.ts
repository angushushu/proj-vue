import { makeInstaller } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Homepage from '../views/Homepage.vue'
import Success from '../views/Success.vue'
import View from '../views/View.vue'
import UploadJsonSp from '../views/UploadJsonSp.vue'
import UploadXlsSp from '../views/UploadXlsSp.vue'
import UploadJsonDg from '../views/UploadJsonDg.vue'
import UploadXlsDg from '../views/UploadXlsDg.vue'
import UploadJsonG from '../views/UploadJsonG.vue'
import UploadXlsG from '../views/UploadXlsG.vue'
import UploadJsonG2 from '../views/UploadJsonG2.vue'
import UploadXlsG2 from '../views/UploadXlsG2.vue'
import EditStandards from '../views/EditStandards.vue'
import Specialties from '../views/Specialties.vue'
import Diagnoses from '../views/Diagnoses.vue'
import General from '../views/General.vue'
import General2 from '../views/General2.vue'
import Settlement from '../views/Settlement.vue'
import SettleMain from '../views/SettleMain.vue'
import SettleView from '../views/SettleView.vue'

const routes = [
  {
    path: '',
    name: 'Main',
    component: Main
  },
  {
    path: '/homepage',
    name: 'Homepage',
    component: Homepage
  },
  {
    path: '/success',
    name: 'Success',
    component: Success
  },
  {
    path: '/homepage/:id',
    name: 'View',
    component: View
  },
  {
    path: '/edit-standards',
    component: EditStandards,
    children:[
      {
        path:'specialties/:id',
        component:Specialties,
      },
      {
        path:'upload-json-sp',
        component:UploadJsonSp,
      },
      {
        path:'upload-xls-sp',
        component:UploadXlsSp,
      },
      {
        path:'diagnoses/:id',
        component:Diagnoses,
      },
      {
        path:'upload-json-dg',
        component:UploadJsonDg,
      },
      {
        path:'upload-xls-dg',
        component:UploadXlsDg,
      },
      {
        path:'general/:id',
        component:General,
      },
      {
        path:'upload-json-g/:type',
        component:UploadJsonG,
      },
      {
        path:'upload-xls-g/:type',
        component:UploadXlsG,
      },
      {
        path:'general2/:id',
        component:General2,
      },
      {
        path:'upload-json-g2/:type',
        component:UploadJsonG2,
      },
      {
        path:'upload-xls-g2/:type',
        component:UploadXlsG2,
      },
    ]
  },
  {
    path: '/settle-main',
    name: 'SettleMain',
    component: SettleMain,
  },
  {
    path: '/new-settle/:homepage_id',
    name: 'Settlement',
    component: Settlement,
  },
  {
    path: '/settlement/:homepage_id',
    name: 'SettleView',
    component: SettleView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
