<script setup lang="ts">
	/*********************************************************
	prog name: 使用者列表, author: James Lin, date: 2020/04/19

	**********************************************************/
	import type { Ref } from "vue"
	import { ref, reactive, onMounted } from "vue"
	import { useFetch, createFetch, useStorage, useTitle } from "@vueuse/core"
	import banner from "../../components/banner"
	import liwaMsg from "../../components/liwaMsg.vue"

	const error = ref('')
	const liwaData = ref({})
	const progName = ref('使用者群組列表')
	const proglink = ref('/003')
	const detailFlg = ref(false)
	const detailName = ref('')
	const siteID = ref('')
	const mainID = ref('')
	const action = ref('')
	const itemIcon = ref('')
	const arrChklist = ref([])
	const arrChklistIndex = ref([])
	const nuUGroupName = ref('')
	// liwaMsg 初始值
	const isMsg = ref(false)
	const objMsg = reactive({
		title: '',
		body: '',
		modalType: 1
	})

	const fetchData = async () => {
		siteID.value = window.sessionStorage.getItem('liwaSiteID')
		let APIsvr = window.sessionStorage.getItem('liwaAPIsvr')
		let url = `${APIsvr}/003_havelist.php?siteID=${siteID.value}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL
	}

	const setMainID = (sID) => {
		let makerID = window.sessionStorage.getItem('liwaUserID');
		if (sID !== makerID) window.location.href = `${proglink.value}/${sID}`
	}

	const addNewGroup = () => {
		let keydata = {
			'uGroupID': '',
			'uGroupName': '新使用者群組',
			'isChecked': '0',
			'bEdit': '1'
		}
		liwaData.value.push(keydata)
		action.value = 'add'
	}

	const toggleEdit = (sID) => {
		// 先取消所有 liwaData 的 bEdit
		liwaData.value.forEach((obj) => {
			obj.bEdit = '0'
		})
		let res = liwaData.value.filter((n) => n.uGroupID == sID)
		res[0].bEdit = '1'
		nuUGroupName.value = res[0].uGroupName
		action.value = 'edit'
	}

	const cancelEdit = () => {
		liwaData.value.forEach((obj) => {
			obj.bEdit = '0'
		})
		action.value = ''
	}

	const toggleChecked = (idx) => {
		let iListIndex = liwaData.value.findIndex((m) => m.uGroupID == idx)
		let res = liwaData.value.filter((n) => n.uGroupID == idx)
		let iCheck = (res[0].isChecked == '1')? '0': '1'
		res[0].isChecked = iCheck
		let iCount = 0
		// 若 iCheck == 1(代表已被選), 將 idx加入 arrChklist內, 否則從 arrChklist移除
		if (iCheck == 1) {
			arrChklist.value.push(idx)
			arrChklistIndex.value.push(iListIndex)
			// 檢查是否已全選, 若是, isChkAllMode = 1
			iCount = 0
			arrChklist.value.forEach((n1) => {
				// 逐筆檢查, 若已全選, isChkAllMode = 1
				let res1 = liwaData.value.filter((m1) => m1.uGroupID == n1)
				// 若在liwaData內找到 iCount +1
				if (res1[0].length > 0) iCount += 1
			})
		} else {
			// unChecked
			let iIndex0 = arrChklistIndex.value.indexOf(iListIndex)
			arrChklistIndex.value.splice(iIndex0, 1)
			let iIndex = arrChklist.value.indexOf(idx)
			arrChklist.value.splice(iIndex, 1)
			iCount = 0
			arrChklist.value.forEach((n2) => {
				// 逐筆檢查, 若非全選, isChkAllMode = 0
				let res2 = liwaData.value.filter((m2) => m2.uGroupID == n2)
				// 若在liwaData內找到 iCount +1
				if (res2[0].length > 0) iCount += 1
			})
		}
	}

	const changeUGroupName = async (sID) => {
		// 改名: 1 先變更data, 若成功, 則2A. 改名, bEdit='0', 否則不變
		let uGroupID = ''
		let res = liwaData.value.filter((n) => n.uGroupID == sID)
		// if (action.value == 'edit') {
		// 	let res = liwaData.value.filter((n) => n.uGroupID == sID)
		// } 
		
		let keydata = {
			'siteID': window.sessionStorage.getItem('liwaSiteID'),
			'uGroupID': (action.value == 'add')?'':res[0].uGroupID,
			'uGroupName': nuUGroupName.value,
			'action': action.value
		}
		let datastr = JSON.stringify(keydata)
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
	    const { data } = await useMyFetch('003_edit.php').post().json()
	    if (!data.value.message)	{
	    	if (action.value == 'edit') {
		    	res[0].uGroupName = nuUGroupName.value
		    	res[0].bEdit = '0'
	    	} else {
	    		fetchData()
	    		nuUGroupName.value = ''
	    	}
	    } else {

	    }
	    action.value = ''
	}

	const deleteData = async () => {
		let arrSel = []
		liwaData.value.forEach((obj) => {
			if (obj.isChecked == '1') {
				arrSel.push(obj.uGroupID)
			}
		})
		let details = arrSel.toString()
		let keydata = {
			'siteID': window.sessionStorage.getItem('liwaSiteID'),
			'details': details,
			'action': 'delete'
		}
		let datastr = JSON.stringify(keydata)
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
	    const { data } = await useMyFetch('003_edit.php').post().json()
	    if (!data.value.message) {
	    	arrChklistIndex.value.sort().reverse().forEach((n1) => {
	    		liwaData.value.splice(n1, 1)
	    	})
	    } else {
	    	showMsg('刪除群組錯誤', data.value.message, 1)
	    }
	}

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
    	let imgsvr = window.sessionStorage.getItem('liwaImgsvr')
    	itemIcon.value = imgsvr + '/syspics/groups.png'
    	// 取得列表資料
		fetchData()
	})	

	definePageMeta({
	  title: 'LiwaSite 使用者群組管理',
	  layout: "default",
	})		
</script>

<template>
<banner
	:progname="progName"
	:proglink="proglink"
	:detailflg="detailFlg"
	:detailName="detailName"
></banner>
<div v-if="error">{{ error }}</div>
<div class="w-full bg-slate-200 px-4 py-2">
	<div class="barPanel h-12 rounded-3xl ml-4 mb-2 px-1">
		<div class="top-icon add ml-2 -mt-1" @click="addNewGroup()">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="#fee" viewBox="-1 -1 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke="#fee" stroke-linejoin="round" stroke-width="6" d="M12 4v16m8-8H4" />
			</svg>
		</div>
		<div class="top-icon ml-2 -mt-1" @click="deleteData()">
			<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 458.5 458.5" style="enable-background:new 0 0 458.5 458.5;" xml:space="preserve" width="30px" height="30px">
				<g class="" style="fill:#FFF;stroke:#FFF;stroke-width:12px;stroke-linecap:round;stroke-linejoin:round;">
					<path d="M382.078,57.069h-89.78C289.128,25.075,262.064,0,229.249,0S169.37,25.075,166.2,57.069H76.421c-26.938,0-48.854,21.916-48.854,48.854c0,26.125,20.613,47.524,46.429,48.793V399.5c0,32.533,26.467,59,59,59h192.508c32.533,0,59-26.467,59-59V154.717c25.816-1.269,46.429-22.668,46.429-48.793C430.933,78.985,409.017,57.069,382.078,57.069z M229.249,30c16.244,0,29.807,11.673,32.76,27.069h-65.52C199.442,41.673,213.005,30,229.249,30z M354.503,399.501c0,15.991-13.009,29-29,29H132.995c-15.991,0-29-13.009-29-29V154.778c12.244,0,240.932,0,250.508,0V399.501z M382.078,124.778c-3.127,0-302.998,0-305.657,0c-10.396,0-18.854-8.458-18.854-18.854S66.025,87.07,76.421,87.07h305.657c10.396,0,18.854,8.458,18.854,18.854S392.475,124.778,382.078,124.778z"/>
					<path d="M229.249,392.323c8.284,0,15-6.716,15-15V203.618c0-8.284-6.715-15-15-15c-8.284,0-15,6.716-15,15v173.705	C214.249,385.607,220.965,392.323,229.249,392.323z"/>
					<path d="M306.671,392.323c8.284,0,15-6.716,15-15V203.618c0-8.284-6.716-15-15-15s-15,6.716-15,15v173.705	C291.671,385.607,298.387,392.323,306.671,392.323z"/>
					<path d="M151.828,392.323c8.284,0,15-6.716,15-15V203.618c0-8.284-6.716-15-15-15c-8.284,0-15,6.716-15,15v173.705	C136.828,385.607,143.544,392.323,151.828,392.323z"/>
				</g>
			</svg>
		</div>		
	</div>
	<div v-if="liwaData.length" class="mx-auto my-0 p-2 border-2 relative">
		<div class="w-full flex flex-col">
	    	<div class="w-[97%] sm:h-96 md:h-[36rem] lg:h-[42rem] min-h-full -my-2 overflow-x-hidden overflow-y-auto sm:-mx-6 lg:mx-8 bg-white">
	    		<div class="w-full flex flex-row justify-items-center">
					<div v-for="(uGroup, index) in liwaData" :key="index" :data-id="uGroup.uGroupID" 
						class="w-24 h-32 mx-2 my-1 bg-neutral-300 text-xl text-center rounded cursor-pointer flex flex-row justify-between relative"
						>
						<div class="flex flex-col">
							<div class="w-full h-24"
								@click.prevent="setMainID(uGroup.uGroupID)"
							>
								<img :src="itemIcon" width="80" class="mt-4"/>
							</div>
							<div class="w-full h-8 text-center ml-2">
								<div v-if="uGroup.bEdit=='0'" class="text-center text-sm" @click.stop="toggleEdit(uGroup.uGroupID)">{{ uGroup.uGroupName }}</div>
								<div v-else class="w-20 h-8 -ml-1 mb-2">
									<input type="text" class="w-[5.5rem] h-6 border-0 bg-white text-center text-sm" placeholder="輸入群組名稱" v-model="nuUGroupName" @keyup.enter.stop="changeUGroupName(uGroup.uGroupID)" @keyup.esc.stop="cancelEdit()"/>
								</div>
							</div>

						</div>
						<div class="absolute w-6 h-6 top-1 left-1 border-2 border-slate-700" @click.prevent="toggleChecked(uGroup.uGroupID)">
							<div v-if="uGroup.isChecked=='1'" class="mt-1 ml-1">
								<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="12px" viewBox="-20 50 405.272 405.272" style="enable-background:new -20 50 405.272 405.272;"
									 xml:space="preserve">
									<g style="fill:#4338ca;stroke:#4338ca;stroke-width:12px;stroke-linecap:round;stroke-linejoin:round;">
										<path d="M393.401,124.425L179.603,338.208c-15.832,15.835-41.514,15.835-57.361,0L11.878,227.836
											c-15.838-15.835-15.838-41.52,0-57.358c15.841-15.841,41.521-15.841,57.355-0.006l81.698,81.699L336.037,67.064
											c15.841-15.841,41.523-15.829,57.358,0C409.23,82.902,409.23,108.578,393.401,124.425z"/>
									</g>
								</svg>
							</div>								
						</div>						
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