<script setup lang="ts">
	/*********************************************************
	prog name: 使用者明細CRUD, author: James Lin, date: 2020/04/19

	**********************************************************/
	import { ref, reactive, onMounted, computed } from "vue"
	import { useFetch, createFetch, useTitle } from "@vueuse/core"
	import banner from "../../components/banner"
	import liwaMsg from "../../components/liwaMsg.vue"
	import { IconPlusLg } from '@iconify-prerendered/vue-bi'

	const mainID = ref('')
	const progName = ref('使用者列表')
	const proglink = ref('/002')
	const detailFlg = ref(true)
	const detailName = ref('')
	const siteID = ref('')
	const liwaData = ref({})
	const liwaDetail1 = ref([])
	const stitle = ref('')
	const submitted = ref(false)
	const imgInput = ref(null)
	const isMsg = ref(false)
	const isConfig = ref(false)	

	const loadData = async () => {
		let url= window.sessionStorage.getItem('liwaAPIsvr') + "/002_haveDetail.php?siteID="+siteID.value+"&mainID=" + mainID.value
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL[0]
		liwaData.value.action = 'edit'
		liwaData.value.mainID = mainID.value
		liwaData.value.siteID = window.sessionStorage.getItem('liwaSiteID')
		liwaData.value.userID = window.sessionStorage.getItem('liwaUserID')
		liwaData.value.makerName = window.sessionStorage.getItem('liwaUserName')
		let sIconPath = liwaData.value.iconPath
		liwaData.value.iconPath = window.sessionStorage.getItem('liwaImgsvr') + sIconPath
		liwaData.value.picpath = window.sessionStorage.getItem('liwaImgsvr') + sIconPath
		detailName.value = liwaData.value.username
		stitle.value = detailName.value + ' 的資料'
	}

	const loadDetail1 = async () => {
		// 取得使用者群組列表
		let url1 = window.sessionStorage.getItem('liwaAPIsvr') + "/002_haveGroup.php?siteID="+window.sessionStorage.getItem('liwaSiteID')
		const detail1 = await useFetch(url1, {method: 'GET'}, {refetch: true}).get().json()
		let arrDetail1 = detail1.data.value.arrSQL
		let arrTmp = []
		for (let i=0; i<arrDetail1.length; i++) {

			let objItem = {
				label:arrDetail1[i].uGroupName,
				value:arrDetail1[i].uGroupID,
			}
			arrTmp.push(objItem)
		}
		liwaDetail1.value = arrTmp
	}

	const callDialog = () => {
		imgInput.value.click()
	}	

	const handleImage = (e) => {
		const selectedImage = e.target.files[0]
		createBase64Image(selectedImage)
	}

	const createBase64Image = (fileObject) => {
		const reader = new FileReader()

		reader.onload = (e) => {
			liwaData.value.iconPath = e.target.result
		}
		reader.readAsDataURL(fileObject)
	}

	const jumpAdd = () => {
		window.location.href = '/002/add'
	}

	const clearData = () => {
		let tmpData = {
			'action':'add',
			'siteID': window.sessionStorage.getItem('liwaSiteID'),
			'userID': window.sessionStorage.getItem('liwaUserID'),
			'makerName':window.sessionStorage.getItem('liwaUserName'),
			'mainID': '',
			'username': '',
			'nickname': '',
			'gender': '先生',
			'uGroupID': '',
			'uGroupName': '',
			'iAuth': 1,
			'isTop': 0,
			'usermail': '',
			'birthday': '',
			'zip': '',
			'addr': '',
			'phone': '',
			'mobile': '',
			'originSiteID': window.sessionStorage.getItem('liwaSiteID'),
			'picpath': '../static/man-icon.png',
			'iconPath': '../static/man-icon.png',
			'roles': '正式成員',
			'iSites': 0,
			'iStatus': 0
		}
		detailName.value = '新增使用者'
		stitle.value = '新增使用者'
		liwaData.value = tmpData
	}

	const saveData = async () => {
		let datastr = JSON.stringify(liwaData.value)
	// console.log('datastr =', datastr)
	    const useMyFetch = createFetch({
	      baseUrl: window.sessionStorage.getItem('liwaAPIsvr'),
	      fetchOptions: {
	        mode: 'cors',
	        headers: new Headers({
	          'Content-Type': 'application/json; charset=utf-8'
	        }),
	        body: datastr
	      }
	    })
	    const { data } = await useMyFetch('002_edit.php').post().json()
	    if (!data.value.message) {
		    mainID.value = data.value.key
		    if (liwaData.value.action == 'add') {
		    	window.location.href = '/002/' + mainID.value
		    }
		    liwaData.value.action = 'view'	
	    } else {
	    	showMsg('存檔錯誤', data.value.message, 1)
	    }
	}

	// 訊息對話盒及設定對話盒相關 starts	
	const objMsg = ref({
		title: '',
		body: '',
		modalType: ''
	})

	const showMsg = (sTitle, sBody, iType = 1) => {
  		objMsg.value.title = sTitle
  		objMsg.value.body = sBody
  		objMsg.value.modalType = iType
  		isMsg.value = true
	}

	const hideMsg = () => {
		isMsg.value = false
	}

	const confirmOK = () => {
		alert("Press the Confirm button")
		isMsg.value = false
	}
	
	const showConfig = () => {
		isConfig.value = true
	}

	const hideConfig = () => {
		isConfig.value = false
	}
	// 訊息對話盒及設定對話盒相關 ends
	const iconSrc = computed(() => {
		let iconHead = liwaData.value.iconPath.substr(0, 5)
		let AA = liwaData.value.iconPath
		if (iconHead !== 'data:') {
			AA = (liwaData.value.gender == '先生') ? window.sessionStorage.getItem('liwaImgsvr') + '/syspics/man-icon.png': window.sessionStorage.getItem('liwaImgsvr') + '/syspics/woman-icon.png'
			liwaData.value.iconPath = AA
		}
		return AA
	})

	// 訊息對話盒及設定對話盒相關 ends

	onMounted(() => {
		siteID.value = window.sessionStorage.getItem('liwaSiteID')
    	let compName = window.sessionStorage.getItem('liwaSiteName')
    	const title = useTitle(compName+`- 使用者明細`)
		// 取得 mainID, 由mainID取得
		const route = useRoute()
		mainID.value = route.params.id
		//	由 mainID 取得資料
		loadDetail1()
		if (mainID.value !== 'add') {
			loadData() 
		} else {
			clearData()
		}

	})

	definePageMeta({
	  title: '使用者明細',
	  layout: "default",
	})		

</script>

<template>
<banner
	v-if="detailName"
	:progname="progName"
	:proglink="proglink"
	:detailflg="detailFlg"
	:detailName="detailName"
></banner>	
<div class="w-full h-full flex flex-col justify-center items-center bg-slate-200">
	<div class="barPanel w-[95%] h-12 rounded-3xl mt-2 ml-4 mb-2 px-1 flex flex-row justify-between">
		<div class="w-1/3">
			<div class="top-icon add ml-4 -mt-1" @click="jumpAdd()">
				<IconPlusLg class="w-7 h-7 text-white font-bold" />
			</div>			
		</div>
		<div class="w-1/3 text-center">
			{{ stitle }}
		</div>
		<div class="w-1/3 flex flex-row justify-end">
			<!-- 設定按鈕 -->

		</div>
	</div>
	<div class="w-full lg:max-w-lg">
		<div v-if="detailName" class="bg-white m-2 rounded-xl py-1">
			<FormKit 
			form-class="px-4 py-2 bg-yellow-200 rounded-2xl w-11/12"
			type="form"
			v-model="liwaData"
			:form-class="submitted? 'hidden': 'block'"
			style="margin: 1rem auto;"
			submit-label="存檔"
			@submit="saveData()"
			>
				<div class="w-full h-[200px]">
					<img 
					class="mx-auto border-2 w-[200px] h-full"
					:src="iconSrc" 
					width="200" 
					:alt="liwaData.username" 
					@click="callDialog"
					/>
				</div>
		        <FormKit
		          name="username"
		          label="姓名*"
		          type="text"
		          placeholder="請輸入姓名"
		          help="可輸入中英文名字(字數限制100字)"
		          validation="required"
		        />
		        <FormKit
		          name="nickname"
		          label="暱稱*"
		          type="text"
		          placeholder="請設定暱稱"
		          help="可輸入中英文名字(字數限制100字)"
		          validation="required"
		        />
		        <div class="w-full flex flex-row justify-between">
			        <FormKit
			          name="gender"
			          label="性別"
			          type="radio"
			          outer-class="w-[95%]"
			          :options="['先生', '小姐']"
			          help="請選擇性別"
			        />		        	
		        </div>
		        <FormKit
		          name="uGroupID"
		          label="所屬使用者群組"
		          type="select"
		          :options="liwaDetail1"
		        />
		        <FormKit
		          name="usermail"
		          label="Email*"
		          type="email"
		          help="請設定Email"
		          validation="required|email"
		        />
		        <FormKit
		          name="birthday"
		          label="生日"
		          type="date"
		          min="1960-01-01"
		          help="請輸入生日日期"
		        />
		        <div class="flex flex-col lg:flex-row justify-start lg:justify-between">
		        	<div class="w-full lg:w-16">
				        <FormKit
				        	name="zip"
				        	label="郵遞區號"
				        	type="text"
				        />		        		
		        	</div>
			        <div class="w-full lg:w-[calc(100%_-_4rem)]">
				        <FormKit
				        	name="addr"
				        	label="地址"
				        	type="text"
				        />				        	
			        </div>       	
		        </div>
		        <FormKit
		          name="phone"
		          label="市話"
		          type="tel"
		          placeholder="xx-xxxxxx"
		          help="市話格式範例:02-21345678"
		          validation="matches:/^[0-9]{2}-[0-9]{8}$/"
		        />
		        <FormKit
		          name="mobile"
		          label="手機"
		          type="tel"
		          placeholder="xxxx-xxxxxx"
		          help="手機格式範例:0912-123456"
		          validation="matches:/^[0-9]{4}-[0-9]{6}$/"
		        />	
		        <FormKit
		          name="roles"
		          label="會員資格"
		          type="select"
		          :options="['準會員', '正式成員']"
		        />
		        <FormKit
		        	name="iAuth"
		        	label="預設權限*"
		        	type="number"
		        	min="1"
		        	max="9"
		        	validation="required"
		        />			        
		        <div class="flex flex-col lg:flex-row justify-start lg:justify-between">
		        	<div class="w-full lg:w-[50%]">
				        <FormKit
				        	name="siteID"
				        	label="預設雲系統ID"
				        	type="text"
				        />		        		
		        	</div>
			        <div class="w-full lg:w-[50%]">
				        <FormKit
				        	name="iSites"
				        	label="已建雲系統數量"
				        	type="number"
				        	min="0"
				        	max="1"
				        	step="1"
				        />				        	
			        </div>       	
		        </div>		        
			</FormKit>
		</div>
	</div>
</div>
	<div class="invisible">
		<input 
			id="imgInput" 
			ref="imgInput" 
			class="w-11/12 h-8 bg-grey-100 hidden" 
			type="file" 
			accept="image/*" 
			@change.stop="handleImage" 
		/>		
	</div>
	<liwaMsg 
	  	v-if="isMsg"
	  	:msgTitle="objMsg.title"
	  	:msgBody="objMsg.body"
	  	:modalType="objMsg.modalType"
	  	@hideMsg="hideMsg"
	  	@confirmOK="confirmOK"
	/>  
	<liwaConfig
	  	v-if="isConfig"
	  	@hideConfig="hideConfig"
	/>		
</template>

