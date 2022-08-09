<script setup lang="ts">
	/*********************************************************
	prog name: 關於我, author: James Lin, date: 2020/04/19

	**********************************************************/
	import { ref, reactive, onMounted, computed } from "vue"
	import { useFetch, createFetch, useTitle } from "@vueuse/core"
	import banner from "../components/banner"
	import liwaMsg from "../components/liwaMsg.vue"
	
	const mainID = ref('')
	const progName = ref('關於我')
	const proglink = ref('/A04')
	const detailFlg = ref(false)
	const detailName = ref('關於我')

	const liwaData = ref({})
	const submitted = ref(false)
	const imgInput = ref(null)
	const gender1 = ref('')

	// 圖檔處理 starts
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
			liwaData.value.picpath = e.target.result
		}
		reader.readAsDataURL(fileObject)
	}	

	const iconSrc = computed(() => {
		let AA = ''
		if (liwaData.value.picpath !== undefined) {
			let iconHead = liwaData.value.picpath.substr(0, 5)
			AA = liwaData.value.picpath
			if (iconHead !== 'data:') {
				AA = (liwaData.value.gender == '先生') ? window.sessionStorage.getItem('liwaImgsvr') + '/syspics/man-icon.png': window.sessionStorage.getItem('liwaImgsvr') + '/syspics/woman-icon.png'
				liwaData.value.picpath = AA
			}
		}
		return AA
	})
	// 圖檔處理 ends

	const loadData = async () => {
		let siteID = window.sessionStorage.getItem('liwaSiteID')
		let url = window.sessionStorage.getItem('liwaAPIsvr') + `/A04_haveDetail.php?siteID=${siteID}&userID=${mainID.value}`	
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL[0]
		liwaData.value.action = 'edit'
		liwaData.value.mainID = mainID.value
		liwaData.value.siteID = siteID
		liwaData.value.userID = window.sessionStorage.getItem('liwaUserID')
		liwaData.value.makerName = window.sessionStorage.getItem('liwaUserName')
		let sIconPath = liwaData.value.picpath
		liwaData.value.picpath = window.sessionStorage.getItem('liwaImgsvr') + sIconPath

	}

	const saveData = async () => {
		let datastr = JSON.stringify(liwaData.value)
		console.log('datastr =', datastr)
/*
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
	    const { data } = await useMyFetch('A04_edit.php').post().json()	
*/	    	
	}

	// 訊息對話盒及設定對話盒相關 starts
	const isMsg = ref(false)
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
	// 訊息對話盒及設定對話盒相關 ends

	onMounted(() => {
		mainID.value = window.sessionStorage.getItem('liwaUserID')
		loadData()
	})

	definePageMeta({
	  title: '關於我',
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
			<div class="top-icon ml-4 -mt-1 pl-1 pt-1" @click="">
				<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="3px" y="3px" width="25px" height="25px" viewBox="0 0 245.667 245.667" style="enable-background:new 0 0 245.667 245.667;" xml:space="preserve">
					<path d="M122.833,0C84.677,0,53.635,31.042,53.635,69.198c0,27.932,16.695,52.866,42.067,63.658v97.949 c0,3.126,1.939,5.925,4.867,7.022l19.631,7.362c0.849,0.318,1.741,0.478,2.633,0.478s1.785-0.159,2.633-0.478l19.631-7.362 c2.927-1.098,4.867-3.896,4.867-7.022v-10.867c0-1.989-0.79-3.897-2.197-5.303l-10.122-10.121l10.122-10.122 c1.407-1.406,2.197-3.314,2.197-5.303v-8.413c0-1.989-0.79-3.897-2.197-5.303l-10.122-10.122l10.122-10.121 c1.407-1.406,2.197-3.314,2.197-5.303v-16.97c25.372-10.792,42.067-35.726,42.067-63.658C192.031,31.042,160.99,0,122.833,0z  M122.833,60.997c-9.782,0-17.74-7.958-17.74-17.74c0-9.782,7.958-17.74,17.74-17.74s17.74,7.958,17.74,17.74 C140.573,53.039,132.615,60.997,122.833,60.997z"/>
				</svg>				
			</div>
		</div>
		<div class="w-1/3 text-center">我的基本資料</div>
		<div class="w-1/3"></div>
	</div>
	<div class="w-full lg:max-w-[900px]">
		<div class="bg-white m-2 rounded-xl py-1">
			<FormKit 
			form-class="px-4 py-2 bg-yellow-200 rounded-2xl w-11/12"
			type="form"
			v-model="liwaData"
			:form-class="submitted? 'hidden': 'block'"
			style="margin: 1rem auto;"
			submit-label="存檔"
			@submit="saveData()"
			>
				<div class="w-full h-[200px] mb-8">
					<img 
						class="mx-auto border-2 w-[200px] h-full"
						:src="iconSrc" 
						width="200" 
						:alt="liwaData.username" 
						@click="callDialog"
					/>	
					<p class="w-full text-center text-red-600">頭像: 請上傳 200 X 200 px照片</p>				
				</div>
				<div class="w-full flex flex-col lg:flex-row">
					<div class="w-full lg:w-1/2">
						<FormKit
				          name="username"
				          label="姓名*"
				          type="text"
				          placeholder="請輸入姓名"
				          help="可輸入中英文名字(字數限制100字)"
				          validation="required"
				        />							
					</div>
					<div class="w-full lg:w-1/2 ml-8 mt-8">
						<span>{{ liwaData.gender }}</span>
					</div>				
				</div>
		        <FormKit
		          name="nickname"
		          label="暱稱*"
		          type="text"
		          placeholder="請設定暱稱"
		          help="可輸入中英文名字(字數限制100字)"
		          validation="required"
		        />
		        <div class="w-full my-4">
		        	<span class="mr-4 font-bold text-sm text-slate-700">所屬群組</span>
		        	<span class="text-lg">{{ liwaData.uGroupName }}</span>
		        </div>
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
		        <FormKit
		          name="mobile"
		          label="手機"
		          type="tel"
		          placeholder="xxxx-xxxxxx"
		          help="手機格式範例:0912-123456"
		          validation="matches:/^[0-9]{4}-[0-9]{6}$/"
		        />
		        <div class="w-full my-4">
		        	<span class="mr-4 font-bold text-sm text-slate-700">會員資格</span>
		        	<span class="text-lg">{{ liwaData.roles }}</span>
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
</template>