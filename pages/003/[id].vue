<script setup lang="ts">
	/*********************************************************
	prog name: 使用者群組明細CRUD, author: James Lin, date: 2020/06/08

	**********************************************************/	
	import { ref, reactive, onMounted, computed } from "vue"
	import { useFetch, createFetch, useTitle } from "@vueuse/core"
	import banner from "../../components/banner"
	import liwaMsg from "../../components/liwaMsg.vue"
	import liwaConfig from "../../components/liwaConfig.vue"

	const mainID = ref('')
	const progName = ref('使用者群組列表')
	const proglink = ref('/003')
	const detailFlg = ref(true)
	const detailName = ref('')
	const liwaData = ref({progName:'', iAuth:0})
	const liwaD1 = ref({})
	const liwaChild = ref({})
	const bEditBox = ref(0)
	const stitle = ref('')
	const submitted = ref(false)
	const liwaSel1 = ref([])
	const action = ref('')
	const actvKeyID = ref('')
	const actvProgName = ref('')
	const actvAuth = ref(1)
	const actvIndex = ref(0)
	// liwaMsg 初始值
	const isMsg = ref(false)
	const objMsg = reactive({
		title: '',
		body: '',
		modalType: 1
	})

	const loadData = async () => {
		let siteID = window.sessionStorage.getItem('liwaSiteID')
		let url = window.sessionStorage.getItem('liwaAPIsvr') + "/003_haveD1.php?siteID=" + siteID + '&uGroupID=' + mainID.value 
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		detailName.value = data.data.value.uGroupName
		liwaData.value = data.data.value.arrSQL
	// console.log('liwaData =', liwaData.value)
		liwaData.value.action = 'edit'
		liwaData.value.mainID = mainID.value
		liwaData.value.siteID = window.sessionStorage.getItem('liwaSiteID')
		liwaData.value.userID = window.sessionStorage.getItem('liwaUserID')
		liwaData.value.makerName = window.sessionStorage.getItem('liwaUserName')
		stitle.value = '使  用  者  群  組  - ' + detailName.value
		liwaChild.value.siteID = window.sessionStorage.getItem('liwaSiteID')
		liwaChild.value.uGroupID = mainID.value
		liwaChild.value.uGroupName = detailName.value	
	}

	const loadD1 = async () => {
		let siteID = window.sessionStorage.getItem('liwaSiteID')
		let url = window.sessionStorage.getItem('liwaAPIsvr') + "/003_haveUGprog.php?siteID=" + siteID + "&uGroupID=" + mainID.value
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaD1.value = data.data.value.arrSQL
		liwaD1.value.forEach((n1) => {
			if (n1.bUsed == '0') {
				liwaSel1.value.push({'label': n1.LMName, 'value':n1.progID})				
			}
		})
	}

	const setProgID = (sID) => {
		actvIndex.value = liwaData.value.findIndex((m) => m.progID == sID)
		let res = liwaData.value.filter((n) => n.progID == sID)
		res[0].isShow = '1'
		bEditBox.value = 1
		actvKeyID.value = res[0].progID
		actvAuth.value = res[0].iAuth
		actvProgName.value = res[0].progName
		liwaChild.value.LMID = res[0].LMID
		action.value = 'edit'
	}

	const addD1 = () => {
		// 在 liwaData 新增一筆
		let keydata = {
			'LMID': '',
			'LMName': '',
			'authLimit': '',
			'groupName': '',
			'iAuth': 9,
			'isShow': '1',
			'lang': 'tw',
			'progID': '',
			'progName': '',
			'slink': ''
		}
		liwaData.value.push(keydata)
		bEditBox.value = 1
		action.value = 'add'
		actvIndex.value = liwaData.value.length + 1
	}

	const closeBox = (idx) => {
		if (action.value !== 'add') {
			let res = liwaData.value.filter((n) => n.progID == idx)
			bEditBox.value = 0
			res[0].isShow = '0'			
		} else {
			// 刪除 liwaData最後一筆
			liwaData.value.pop()
		}
	}

	const saveD1 = async () => {
		liwaChild.value.iAuth = actvAuth.value
		liwaChild.value.action = action.value
		let actvLMID = liwaChild.value.LMID
		let datastr = JSON.stringify(liwaChild.value)
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
	    const { data } = await useMyFetch('003_editD1.php').post().json()
	    if (!data.value.message) {
	    	if (action.value == 'edit') {
	    		// 編輯模式, 將liwaChild.value 設到 liwaData.value
	    		let nuLMID = liwaChild.value.uGroupID + liwaChild.value.progID
	    		liwaData.value[actvIndex.value].LMID = nuLMID
	    	} 
	    	liwaData.value[actvIndex.value].LMName = liwaChild.value.LMName
	    	liwaData.value[actvIndex.value].authLimit = liwaChild.value.authLimit
	    	liwaData.value[actvIndex.value].groupName = liwaChild.value.groupName
	    	liwaData.value[actvIndex.value].iAuth = liwaChild.value.iAuth
	    	liwaData.value[actvIndex.value].isShow ="0"
	    	liwaData.value[actvIndex.value].lang = "tw"
	    	liwaData.value[actvIndex.value].progID = liwaChild.value.progID
	    	liwaData.value[actvIndex.value].progName = liwaChild.value.progName
	    	liwaData.value[actvIndex.value].slink = liwaChild.value.slink
	    	// window.location.href = '/003/' + mainID.value
	    } else {
	    	// 先關閉 editBox
	    	bEditBox.value = 0
			liwaData.value[actvIndex.value].isShow = '0'
			showMsg('存檔錯誤', data.value.message, 1)
	    } 
	    action.value = ''  		
	}

	const delD1 = async (sID) => {
		actvIndex.value = liwaData.value.findIndex((m) => m.LMID == sID)
		liwaChild.value.LMID = sID
		liwaChild.value.action = 'delete'
		let datastr = JSON.stringify(liwaChild.value)
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
	    const { data } = await useMyFetch('003_editD1.php').post().json()
	    if (!data.value.message) {
	    	liwaData.value.splice(actvIndex.value, 1)
	    } else {
	    	// 顯示錯誤訊息
			showMsg('刪除錯誤', data.value.message, 1)
	    } 
	    action.value = ''  	    
	}

	const nuProgName = computed(() => {
		// 先取得 liwaChild.value.progID
		let Ans = ''
		let res = liwaD1.value.filter((n) => (n.progID == actvKeyID.value) && (n.bUsed == 0))
		if (res.length > 0) {
			actvProgName.value = res[0].progName
			liwaChild.value.progID = actvKeyID.value
			liwaChild.value.progName = res[0].progName
			liwaChild.value.LMName = res[0].LMName
			liwaChild.value.iAuth = actvAuth.value
			liwaChild.value.authLimit = res[0].authLimit
			liwaChild.value.groupName = res[0].groupName
			liwaChild.value.slink = res[0].slink
			Ans = res[0].LMName
		} else {
			Ans = actvProgName.value
		}	
		return Ans
	})

	const showMsg = (sTitle, sBody, iType = 1) => {
		objMsg.title = sTitle
		objMsg.body = sBody
		objMsg.modalType = iType
		isMsg.value = true
	}

	const hideMsg = () => {
		isMsg.value = false
	}

	const confirmOK = () => {
		isMsg.value = false
	}

	onMounted(() => {
    	let compName = window.sessionStorage.getItem('liwaSiteName')
    	const title = useTitle(compName+`- 使用者群組列表`)
    	const route = useRoute()
    	mainID.value = route.params.id
		// 設定載入的資料
		loadData()
		loadD1()	
	})

	definePageMeta({
	  title: 'LiwaSite 使用者群組管理',
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
<div v-if="error">{{ error }}</div>
<div class="w-full bg-slate-300 px-4 py-2">
	<div class="barPanel h-12 rounded-3xl ml-4 mb-2 px-1 flex flex-row justify-between">
		<div class="w-1/3 h-12">
			<div class="top-icon add ml-2 -mt-1" @click="">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="#fee" viewBox="-1 -1 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke="#fee" stroke-linejoin="round" stroke-width="6" d="M12 4v16m8-8H4" />
				</svg>
			</div>
		</div>
		<div class="w-1/3 h-12 text-center">{{ stitle }}</div>
		<div class="w-1/3 h-12"></div>
	</div>
	<div v-if="liwaData.length" class="w-full lg:max-w-4xl lg:mx-auto my-0 p-2 border-2 relative">
		<div class="barPanel w-full h-12 rounded-3xl mt-2 mb-2 px-1 flex flex-row justify-between">
			<div class="w-1/3 h-12">
				<div class="top-icon Dadd ml-2 -mt-1 mr-4 bg-white"
                 @click="addD1()"
            	>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="-1 -1 24 24">
						<g style="fill:#000;stroke:#000;stroke-width:6px;stroke-linecap:round;stroke-linejoin:round;">
							<path d="M12 4v16m8-8H4" />
						</g>
					</svg>            		
            	</div>
			</div>
			<div class="w-1/3 h-12 text-center">程式列表及設定</div>
			<div class="w-1/3 h-12"></div>
		</div>
		<div class="w-full flex flex-row mt-4">
			<div class="w-full sm:h-96 md:h-[36rem] lg:h-[44rem] min-h-full -my-2 overflow-auto sm:-mx-6 lg:-mx-2">
				<div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
					<div class="shadow border-b border-gray-500 bg-white">
						<table class="min-w-full divide-x divide-y divide-gray-200 bg-white">
							<thead class="bg-gray-50">
								<tr class="bg-emerald-300">
									<th scope="col" class="thPanel w-3/7">程式名稱</th>
									<th scope="col" class="thPanel w-2/7">自訂名稱</th>
									<th scope="col" class="thPanel w-2/7">權限</th>
								</tr>
							</thead>
							<tbody class="w-full bg-white ring-1 ring-gray-50">
								<tr 
									class="h-20 relative odd:bg-white even:bg-slate-200"
									v-for="(prog, index) in liwaData"
									:key="index"
									:data-id="prog.LMID"
								>
									<td scope="col" class="tdPanel w-3/7" @click.stop.prevent="setProgID(prog.progID)">{{ prog.progName }}</td>
									<td scope="col" class="tdPanel w-2/7" @click.stop.prevent="setProgID(prog.progID)">{{ prog.LMName }}</td>
									<td scope="col" class="tdPanel w-2/7" @click.stop.prevent="setProgID(prog.progID)">
										<div class="w-full h-full flex flex-row">
											<div class="w-3/4 pl-4">
												{{ prog.iAuth }}
											</div>
											<div class="w-1/4 pl-4 relative" @click="delD1(prog.LMID)">
												<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 458.5 458.5" style="enable-background:new 0 0 458.5 458.5;" xml:space="preserve" width="30px" height="30px">
													<g class="" style="fill:#F33;stroke:#F33;stroke-width:12px;stroke-linecap:round;stroke-linejoin:round;">
														<path d="M382.078,57.069h-89.78C289.128,25.075,262.064,0,229.249,0S169.37,25.075,166.2,57.069H76.421c-26.938,0-48.854,21.916-48.854,48.854c0,26.125,20.613,47.524,46.429,48.793V399.5c0,32.533,26.467,59,59,59h192.508c32.533,0,59-26.467,59-59V154.717c25.816-1.269,46.429-22.668,46.429-48.793C430.933,78.985,409.017,57.069,382.078,57.069z M229.249,30c16.244,0,29.807,11.673,32.76,27.069h-65.52C199.442,41.673,213.005,30,229.249,30z M354.503,399.501c0,15.991-13.009,29-29,29H132.995c-15.991,0-29-13.009-29-29V154.778c12.244,0,240.932,0,250.508,0V399.501z M382.078,124.778c-3.127,0-302.998,0-305.657,0c-10.396,0-18.854-8.458-18.854-18.854S66.025,87.07,76.421,87.07h305.657c10.396,0,18.854,8.458,18.854,18.854S392.475,124.778,382.078,124.778z"/>
														<path d="M229.249,392.323c8.284,0,15-6.716,15-15V203.618c0-8.284-6.715-15-15-15c-8.284,0-15,6.716-15,15v173.705	C214.249,385.607,220.965,392.323,229.249,392.323z"/>
														<path d="M306.671,392.323c8.284,0,15-6.716,15-15V203.618c0-8.284-6.716-15-15-15s-15,6.716-15,15v173.705	C291.671,385.607,298.387,392.323,306.671,392.323z"/>
														<path d="M151.828,392.323c8.284,0,15-6.716,15-15V203.618c0-8.284-6.716-15-15-15c-8.284,0-15,6.716-15,15v173.705	C136.828,385.607,143.544,392.323,151.828,392.323z"/>
													</g>
												</svg>
											</div>
										</div>
									</td>
									<div 
										v-if="prog.isShow!=='0'"
										class="absolute w-full h-40 top-0 left-0 bg-white z-50"
									>
										<div class="w-full h-full bg-yellow-200">
											<div v-if="bEditBox!==0" 
											class="w-full h-20 flex flex-row"
											>
												<div class="w-2/5 h-20 pl-2 relative">
													<FormKit
														type="liwaDrop"
														name="progID"
														label="程式名稱"
														inner-class="border-0 rounded-none"
														v-model="actvKeyID"
														help="請設定程式名稱"
														:sVal="actvProgName"
														:arrOption="liwaSel1"
													/>				
												</div>
												<div class="w-2/5 h-20 flex flex-col">
													<div class="w-full h-8 text-center font-bold text-sm mt-1">自訂名稱</div>
													<div class="w-full h-8 text-center">{{ nuProgName }}</div>
												</div>
												<div class="w-1/5 h-20">
													<FormKit
														name="iAuth"
														outer-class="w-32 h-8"
														inner-class="h-8"
														v-model="actvAuth"
														label="權限"
														type="text"
														help="請輸入權限(1-9)"
														validation="required|number|between:1,9"
													/>				
												</div>
											</div>
											<div class="w-full h-20 relative -mt-2 pt-8 pl-2">
												<FormKit
													type="submit"
													label="儲存"
													@click="saveD1"
												></FormKit>
												<div class="w-20 h-20 bg-transparent absolute left-24 -bottom-11"
												>
													<svg
													  class="w-6 h-6 float-left"
													  fill="red"
													  stroke="red"
													  viewBox="0 0 24 24"
													  xmlns="http://www.w3.org/2000/svg"
													  @click.prevent.stop="closeBox(prog.progID)"
													>
														<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="5"
														d="M6 18L18 6M6 6l12 12"
														></path>
													</svg>					
												</div>			
											</div>

										</div>
									</div>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
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