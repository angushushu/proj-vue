<template>
    <div class="container">
        <!-- 修改科别 -->
        <el-dialog
        v-model="editDialogVisible"
        title="科别详情"
        width="30%"
        center
        :destroy-on-close="true"
        :before-close="editDiagClose"
        >
            <el-form>
                <el-form-item label="值" style="margin-bottom:.5rem !important;">
                    <el-input v-model="tempSpData.value" style="margin-left: 1rem !important"></el-input>
                </el-form-item>
                <el-form-item label="名称" style="margin-bottom:.5rem !important">
                    <el-input v-model="tempSpData.label"></el-input>
                </el-form-item>
                <el-form-item label="描述" style="margin-bottom:.5rem !important">
                    <el-input v-model="tempSpData.description" :autosize="{ minRows: 3, maxRows:6 }" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            
            <!-- <span>
                It should be noted that the content will not be aligned in center by default
            </span> -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDiagClose">取消</el-button>
                    <el-button type="primary" @click="editSp" v-loading.fullscreen.lock="loading">
                        修改
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 添加科别 -->
        <el-dialog
        v-model="addDialogVisible"
        title="添加科别"
        width="30%"
        center
        :destroy-on-close="true"
        :before-close="addDiagClose"
        >
            <el-form>
                <el-form-item label="值" style="margin-bottom:.5rem !important;">
                    <el-input v-model="tempSpData.value" style="margin-left: 1rem !important"></el-input>
                </el-form-item>
                <el-form-item label="名称" style="margin-bottom:.5rem !important">
                    <el-input v-model="tempSpData.label"></el-input>
                </el-form-item>
                <el-form-item label="描述" style="margin-bottom:.5rem !important">
                    <el-input v-model="tempSpData.description" :autosize="{ minRows: 3, maxRows:6 }" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            
            <!-- <span>
                It should be noted that the content will not be aligned in center by default
            </span> -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addDiagClose">取消</el-button>
                    <el-button type="primary" @click="addSp" v-loading.fullscreen.lock="loading">
                        添加
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <el-row justify="space-between">
            <span style="margin-top:1rem">
                <el-button class="rename-spstd" @click="rename()">{{name}}</el-button>
            </span>
            <span>
                <el-button class="add-sp1" @click="append(data)">添加科别</el-button>
                <el-button class="add-sp1" @click="applySpStd(id)">应用</el-button>
                <el-button class="remove-spstd" @click="removeSpStd(id)">删除</el-button>
            </span>
            
        </el-row>
        <el-tree
        :data="list"
        :props="defaultProps"
        v-model="list"
        node-key="value"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
        >
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                    <span style="padding-top:2px">
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            placement="right"
                            :show-after="600"
                        >
                            <template #content>值: {{data.value}}<br>描述: {{data.description}}</template>
                            <el-button class="check-node" @click="handleSpClick(data)">{{ node.label }}</el-button>
                        </el-tooltip>
                    </span>
                    <span>
                        <circle-plus-filled
                        v-if="isNotSp3(node)"
                        class="add-node"
                        @click="append(data)"
                        ></circle-plus-filled>
                        <circle-close-filled
                        class="remove-node"
                        @click="removeNode(node,data)"
                        v-loading.fullscreen.lock="loading"
                        ></circle-close-filled>
                    </span>
                </span>
            </template>
        </el-tree>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import axios from "axios"
import { onUnmounted, reactive, ref, watch } from "vue"
import { onMounted } from "vue-demi"
import { useRoute } from "vue-router"
import { CirclePlusFilled, CircleCloseFilled } from "@element-plus/icons-vue"

const router = useRoute()
const route = useRoute()
let list = ref([])
const loading = ref(false)

let editingSpData = ref(null)
let tempSpData = ref(null)
let appendData = ref(null)

let id = ref(router.params.id)
let name = ref('')
const emit = defineEmits(['list-change'])
let editDialogVisible = ref(false)
let addDialogVisible = ref(false)

const handleNodeClick = () => {
  console.log('clicked node')
    // centerDialogVisible = ref(true)
}
const handleSpClick = (data)=>{
    tempSpData.value = Object.assign({},data)
    editingSpData.value = data
    
    console.log('tempSpData')
    console.log(tempSpData)
    editDialogVisible.value = true
}
const updateData = async ()=>{
    if(router.path==='/edit-standards/upload-json-sp') // 不知道为啥路由变了还会运行
        return
    id.value = router.params.id
    console.log(router.path)
    console.log('这里是'+id.value)
    await axios
        .get('/api/v1/get-spstd/',{params:{id:id.value}})
        .then(
            response=>{
                name.value = response.data.spstd.name
                list.value.length=0
                response.data.spstd.specialty1.forEach(sp1=>{
                    // console.log(sp1)
                    sp1.children = sp1.specialty2
                    sp1.children.forEach(sp2=>{
                        // console.log(sp2)
                        sp2.children = sp2.specialty3
                    })
                    list.value.push(sp1)
                })
            // console.log(response.data)
        })
        .catch(error=>{
            console.log(error)
        })
}
const defaultProps = {
  children: 'children',
  label: 'label',
}
const isNotSp3 = (node)=>{
    if(node.parent&&node.parent.data===list.value) {
        return true
    } else if(node.parent.parent&&node.parent.parent.data===list.value) {
        return true
    } else {
        return false
    }
}
const append = (data) => {
    tempSpData.value = {value:'',label:'',description:''}
    addDialogVisible.value = true
    console.log('tempSpData:',tempSpData)
    appendData = data
    console.log('appendData:',appendData)
}
const rename = async ()=>{
    await ElMessageBox.prompt('请输入标准新名称', '重命名', {
        confirmButtonText: '修改',
        cancelButtonText: '取消',
        inputErrorMessage: '你有问题啊',
        inputValue: name.value,
    })
    .then(({ value }) => {
        ElMessage({
            type: 'success',
            message: `重命名为:${value}`,
        })
        // console.log('现在的名字：',name.value)
        name.value = value
        console.log('现在的名字：',name.value)
        updateSps()
    })
    .catch(() => {
        ElMessage({
            type: 'info',
            message: '动作已取消',
        })
    })
}
const updateSps = async () => {
    console.log('when updating, name:',name.value)
    loading.value = true
    await axios.post('api/v1/update-standard/specialty/',{'id':id.value,'name':name.value,'specialty1':list.value})
        .then(response=>{
            console.log('submitted and got response:')
            console.log(response)
            emit('list-change','stay')
        })
        .catch(error=>{
            console.log(error)
        })
    loading.value = false
    
}
const removeNode = async (node, data) => {
    loading.value = true
    node.remove()
    console.log('new list:')
    console.log(list)
    await updateSps()
}
const applySpStd = async(id) => {
    console.log('applying '+id)
    await ElMessageBox.confirm(
        '这将改变病案首页的科别标准，你确定吗？',
        '警告！',
        {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        }
    ).then(() => {
        loading.value = true
        axios.post('api/v1/set-standard/specialty/',{id:id})
            .then(response=>{
                console.log(response)
                emit('list-change','stay')
            })
            .catch(error=>{
                console.log(error)
            })
        loading.value = false
        ElMessage({
            type: 'success',
            message: '标准更改成功',
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '动作已取消',
        })
    })
    
}
const removeSpStd = async (id) => {
    console.log('removing '+id)
    await axios.post('api/v1/remove-spstd',{id:id})
        .then(response=>{
            console.log(response)
            emit('list-change','111')
        })
        .catch(error=>{
            console.log(error)
        })
}

const addDiagClose = ()=>{
    addDialogVisible.value = false
    // editingSpData.value = null
    console.log('addDiagClose()')
    console.log(addDialogVisible)
}
const addSp = async ()=>{
    console.log('addSp()')
    await ElMessageBox.confirm(
        '这样做将增加一个科别，你确定吗',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(() => {
        console.log('确认了')
        const newChild = { 
            value: tempSpData.value.value, 
            label: tempSpData.value.label, 
            description: tempSpData.value.description, 
            // children: [] 
        }
        console.log('newChild:', newChild)
        if(!appendData){
            list.value.push(newChild)
        } else {
            if(!appendData.children) {
                appendData.children = []
            }
            console.log('tempSpData:',tempSpData)
            appendData.children.push(newChild)
        }
        console.log('pushed appendData:', appendData)
        list.value = [...list.value]
        console.log('list:', list.value)
        ElMessage({
            type: 'success',
            message: '修改成功',
        })
        updateSps()
        addDiagClose()
    })
    .catch(() => {
        console.log('取消了')
        ElMessage({
            type: 'info',
            message: '已取消',
        })
    })
}
const editDiagClose = ()=>{
    editDialogVisible.value = false
    // editingSpData.value = null
    console.log('editDiagClose()')
    console.log(editDialogVisible)
}
const editSp = async ()=>{
    await ElMessageBox.confirm(
        '这样做将改变标准内容，你确定吗',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(() => {
        console.log('确认了')
        editingSpData.value.value = tempSpData.value.value // 检查value是否重复？
        editingSpData.value.label = tempSpData.value.label
        editingSpData.value.description = tempSpData.value.description
        console.log('list')
        console.log(list)
        ElMessage({
            type: 'success',
            message: '修改成功',
        })
        updateSps()
        editDiagClose()
    })
    .catch(() => {
        console.log('取消了')
        ElMessage({
            type: 'info',
            message: '已取消',
        })
    })
}
// reactive(()=>updateData())
watch(
    ()=>route.path,
    (current, previous)=>{
        console.log(previous+'->'+current)
        updateData()
    }
)
onMounted(updateData)
</script>

<style>
.container {
    padding-left: 5rem;
    padding-right: 5rem;
}
.el-button.remove-spstd {
    margin: 1rem 0 1rem 1rem;
    border: 1px solid rgb(219, 219, 219) !important;
    background-color: rgb(219, 219, 219) !important;
    /* border-radius: 1rem !important; */
}
.el-button.remove-spstd:hover {
    color: rgb(255, 255, 255) !important;
    border: 1px solid rgb(201, 45, 45) !important;
    background-color: rgb(201, 45, 45) !important;
}
.el-button.add-sp1 {
    margin: 1rem 0 1rem 1rem;
    /* border-radius: 1rem !important; */
}
.custom-tree-node {
    /* height: 80%; */
    width:100%;
    display:flex;
    justify-content:space-between;
}
.add-node {
    width: 1em;
    margin-right: 8px;
    padding-top:9px;
    color: rgb(197, 197, 197) !important;
}
.add-node:hover {
    color: rgb(100, 100, 100) !important;
}
.remove-node {
    width: 1em;
    margin-right: 8px;
    padding-top:9px;
    color: rgb(197, 197, 197) !important;
}
.remove-node:hover {
    color: rgb(201, 45, 45) !important;
}
.rename-spstd {
    font-size: 150%;
    font-weight: bold;
    padding-left: 0%;
    border: 0px !important;
    background-color: transparent !important;
}
.rename-spstd:hover {
    font-weight: bold;
    color: rgb(0, 133, 133) !important;
    padding-left: 0%;
    border: 0px !important;
    background-color: transparent !important;
}
.check-node {
    border: 0ch !important;
    background-color: transparent !important;
}
.check-node:hover {
    border: 0ch !important;
    background-color: transparent !important;
    color: rgb(0, 133, 133) !important;
    font-weight: bold;
}
.el-dialog--center .el-dialog__body {
    padding: 0rem 1rem 1rem 1rem !important;
}
.el-textarea__inner {
    top:5px !important;
}
</style>