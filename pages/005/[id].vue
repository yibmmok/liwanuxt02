<script setup lang="ts">
	/*********************************************************
	prog name: 公告明細CRUD, author: James Lin, date: 2022/08/02
	To Do: 發佈日期與下架日期改格式
	**********************************************************/
	import { ref, toRefs, onMounted, computed } from "vue"
	import { useFetch, createFetch, useTitle } from "@vueuse/core"
	import banner from "../../components/banner"
	import liwaMsg from "../../components/liwaMsg.vue"
	import liwaConfig from "../../components/liwaConfig.vue"
	import TinyMceEditor from "@tinymce/tinymce-vue"

	const mainID = ref('')
	const progName = ref('公告列表')
	const proglink = ref('/005')
	const detailFlg = ref(true)
	const detailName = ref('')
	const uGroups = ref([])
	const tmpData = ref({})
	const liwaData = ref({})
	const liwaDetail1 = ref([])
	const stitle = ref('')
	const submitted = ref(false)
	const sContent = ref('')
	const liwaEditor = ref(null)
	const isEditor = ref(true)

	const imgInput = ref(null)
	const InitVal = ref({
		height: 400,
		language:"zh_TW",
		menubar: true,
		content_style:"../../assets/css/tinyMCE.css",
	    plugins: [
	    	'emoticons', 'fullscreen', 'lists', 'link', 'image', 'help', 'wordcount'
	    ],
	    fullscreen_native: true,
	    toolbar: 'fullscreen | undo redo | blocks |  forecolor backcolor | indent outdent | emoticons | link image | bold italic | help',
	    file_picker_callback: function(callback, value, meta) {
		  	if (meta.filetype == 'image') {
		  // 		const imgInput = document.createElement('input')
				// imgInput.setAttribute('type', 'file');
				// imgInput.setAttribute('accept', 'image/*');
				imgInput.value.addEventListener('change', (e) => {
					const file = e.target.files[0]
					const reader = new FileReader()
					reader.onload = (e) => {
						callback(e.target.result, { alt: ''})
					}
					reader.readAsDataURL(file)
				})
				imgInput.value.click()
			}
		},
	})	

	const loadData = async () => {
		let url= window.sessionStorage.getItem('liwaAPIsvr') + "/005_haveDetail.php?siteID=" + window.sessionStorage.getItem('liwaSiteID') + "&mainID=" + mainID.value
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL[0]
		liwaData.value.action = 'edit'
		liwaData.value.mainID = mainID.value
		liwaData.value.siteID = window.sessionStorage.getItem('liwaSiteID')
		liwaData.value.userID = window.sessionStorage.getItem('liwaUserID')
		liwaData.value.makerName = window.sessionStorage.getItem('liwaUserName')
		detailName.value = liwaData.value.shortItems
		stitle.value = detailName.value 
		sContent.value = liwaData.value.items
	}	

	const loadDetail1 = async () => {
		// 取得公告類別列表
		let url1 = window.sessionStorage.getItem('liwaAPIsvr') + "/005_haveItemType.php?siteID="+window.sessionStorage.getItem('liwaSiteID')
		const detail1 = await useFetch(url1, {method: 'GET'}, {refetch: true}).get().json()
		let arrDetail1 = detail1.data.value.arrSQL
		let arrTmp = []
		for (let i=0; i<arrDetail1.length; i++) {

			let objItem = {
				label:arrDetail1[i].itemType,
				value:arrDetail1[i].itemTypeID,
				iAuth:arrDetail1[i].iAuth
			}
			arrTmp.push(objItem)
		}
		liwaDetail1.value = arrTmp
	}

	const saveData = async () => {
		liwaData.value.isTop = bTop.value
		liwaData.value.items = tinymce.activeEditor.getContent({format: 'html'})
		let datastr = JSON.stringify(liwaData.value)
		console.log('datastr =', datastr)
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
	    const { data } = await useMyFetch('005_edit.php').post().json()
	    if (liwaData.value.action == 'add') {
	    	mainID.value = data.value.key
	    	window.location.href = '/005/' + mainID.value 
	    }
	    // window.location.href = '/005/' + mainID.value 
	}

	const bTop = computed(() => {
		return (liwaData.value.isTop == 0)? false: true
	})

	onMounted(() => {
    	const title = useTitle(`公告明細`)
		// 取得 mainID, 由mainID取得
		const route = useRoute()
		mainID.value = route.params.id
		//	由 mainID 取得資料
		loadDetail1()
		if (mainID.value !== 'add') {
			loadData() 
		} else {
			// clearData()
		}

	})

	definePageMeta({
	  title: '公告明細',
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
		<div class="w-1/3 flex flex-row">
			<div class="top-icon add ml-4 -mt-1" @click="jumpAdd()">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="#fee" viewBox="-1 -1 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke="#fee" stroke-linejoin="round" stroke-width="6" d="M12 4v16m8-8H4" />
				</svg>
			</div>
		</div>
		<div class="w-1/3 text-center">
			{{ stitle }}
		</div>
		<div class="w-1/3 flex flex-row justify-end">
            <div class="top-icon config -mt-1 mr-4"
                 @click="showConfig()"
            >
				<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="-1 -1 20 20" fill="#ffeeee">
					<g style="">
					<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM7 13a4 4 0 100-6 4 4 0 000 6z" clip-rule="evenodd" />
					</g>
				</svg>             
            </div>			
		</div>
	</div>
	<div class="w-full lg:w-[1024px] lg:max-w-[1024px]">
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
		        <FormKit
		          name="shortItems"
		          label="標題*"
		          type="text"
		          placeholder="請輸入標題"
		          help="輸入公告的標題(字數限制150字)"
		          validation="required"
		        />
		        <div class="w-full flex flex-col lg:flex-row mb-4">
		        	<div class="w-full lg:w-1/2">
				        <FormKit
				          name="pDate"
				          label="發布日期*"
				          type="datetime-local"
				          placeholder="請設定發布日期"
				          help="請設定發布日期"
				          validation="required"
				        />
		        	</div>
		        	<div class="w-full lg:w-1/2">
				        <FormKit
				          name="offDate"
				          label="下架日期*"
				          type="datetime-local"
				          placeholder="請設定下架日期"
				          help="請設定下架日期"
				          validation="required"
				        />
		        	</div>
		        </div>
		        <FormKit
		          v-model="bTop"
		          name="isTop"
		          label=""
		          :options="['置頂']"
		          type="checkbox"
		          help="勾選此選項會設定置頂此公告"
		        />		        		        	        
		        <FormKit
		          name="itemTypeID"
		          label="公告類別"
		          type="select"
		          :options="liwaDetail1"
		        />
				<div class="w-full h-[450px]">
					<div class="w-full h-8 text-sm font-bold text-slate-800">公告內容</div>
					<div class="w-full h-full">
						<TinyMceEditor api-key="fkoaqldrjeuygn6wbe51uchydhzrhufgs8a9tt6yehn106uo" 
						:init="InitVal"
						ref="liwaEditor"
						v-model="sContent"
						@change="handleOnChange"/>						
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