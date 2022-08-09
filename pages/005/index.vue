<script setup lang="ts">
	/*********************************************************
	prog name: 公告列表, author: James Lin, date: 2020/04/19

	**********************************************************/
	import type { Ref } from "vue"
	import { ref, reactive, onMounted } from "vue"
	import { useFetch, createFetch, useStorage, useTitle } from "@vueuse/core"
	import banner from "../../components/banner"
	import { useShowmode } from "../../composables/use-showmode"
	import liwaPages from "../../components/liwaPages"
	import liwaMsg from "../../components/liwaMsg.vue"

	const error = ref('')
	const liwaData = ref({})
	const progName = ref('公告列表')
	const proglink = ref('/005')
	const detailFlg = ref(false)
	const detailKey = ref('')
	const isFilter = ref(false)
	const filters = ref({})
	const mainID = ref('')
	const orderCol = ref('shortItems')
	const sortDir = ref('asc')
	const arrChklist = ref([])
	const isChkAllMode = ref(-1)

	const router = useRouter()
	// liwaMsg 初始值
	const isMsg = ref(false)
	const objMsg = reactive({
		title: '',
		body: '',
		modalType: 1
	})

	const toggleFilter = () => {
		isFilter.value = !isFilter.value
	}

	const page = ref(1)
	const pageSize = ref(10)
	const totalPage = ref(1)

	/* filterPanel setup starts */
	const rolesOption = ['', '準會員', '正式會員']

	/* filterPanel setup ends */

	const fetchData = async () => {
		let APIsvr = window.sessionStorage.getItem('liwaAPIsvr')
		let url = `${APIsvr}/005_havelist.php?siteID=${filters.value.siteID}&userID=${filters.value.userID}&mainID=${mainID.value}&filterShortItems=${filters.value.shortItems}&filterStartDate=${filters.value.startDate}&filterEndDate=${filters.value.endDate}&filterItemTypeID=${filters.value.itemTypeID}&filterStatus=${filters.value.status}&orderCol=${orderCol.value}&sortDir=${sortDir.value}&page=${page.value}&pageSize=${pageSize.value}`
		const data = await useFetch(url, {method: 'GET'}, {refetch: true}).get().json()
		liwaData.value = data.data.value.arrSQL
		totalPage.value = data.data.value.totalPage
		
		if (arrChklist.value.length > 0) {
			// 將 liwaData 符合的mainID的 isChecked = 1
			arrChklist.value.forEach((n) => {
				let res = liwaData.value.filter((obj) => n == obj.mainID)
				if (res.length > 0) res[0].isChecked = 1	
			})
		}

		// 每次fetchData 後都要把filters存下來
		saveFilters()		
	}

	const reload = () => {
		fetchData()
	}

	const setMainID = (sID) => {
		let makerID = window.sessionStorage.getItem('liwaUserID');
		if (sID !== makerID) window.location.href = `${proglink.value}/${sID}`
	}

	const setChkList = (idx) => {
		let res = liwaData.value.filter((n) => n.mainID == idx)
		let iCheck = (res[0].isChecked == 1)? 0: 1
		res[0].isChecked = iCheck
		let iCount = 0
		// 若 iCheck == 1(代表已被選), 將 idx加入 arrChklist內, 否則從 arrChklist移除
		if (iCheck == 1) {
			arrChklist.value.push(idx)
			if (isChkAllMode.value == -1) isChkAllMode.value = 0
			else {
				// 檢查是否已全選, 若是, isChkAllMode = 1
				iCount = 0
				arrChklist.value.forEach((n1) => {
					// 逐筆檢查, 若已全選, isChkAllMode = 1
					let res1 = liwaData.value.filter((m1) => m1.mainID == n1)
					// 若在liwaData內找到 iCount +1
					if (res1[0].length > 0) iCount += 1
				})
				if (iCount == liwaData.value.length) isChkAllMode.value = 1			
			}
		} else {
			// unChecked
			let iIndex = arrChklist.value.indexOf(idx)
			arrChklist.value.splice(iIndex, 1)
			if (isChkAllMode.value == 1) isChkAllMode.value = 0
			else {
				// 檢查是否已全unChecked, 若是, isChkAllMode = -1
				iCount = 0
				arrChklist.value.forEach((n2) => {
					// 逐筆檢查, 若非全選, isChkAllMode = 0
					let res2 = liwaData.value.filter((m2) => m2.mainID == n2)
					// 若在liwaData內找到 iCount +1
					if (res2[0].length > 0) iCount += 1
				})
			}
			if (liwaData.value.length > iCount) isChkAllMode.value = 0
			else isChkAllMode.value = -1
		}
	}

	const setBM = (idx) => {

	}

	const toggleChkAll = () => {
		if (isChkAllMode.value == -1) {
			// 設為全選
			isChkAllMode.value = 1
			checkAll()
			// 將arrChklist 存到 sessionStorage 內
		} else {
			// 設為全不選
			isChkAllMode.value = -1
			uncheckAll()
		}
	}

	const checkAll = () => {
		liwaData.value.forEach((n) => {
			let iCheck = n.isChecked
			if (iCheck == 0) {
				n.isChecked = 1
				arrChklist.value.push(n.mainID)
			}
		})
	}

	const uncheckAll = () => {
		liwaData.value.forEach((n) => {
			let iCheck = n.isChecked
			let iIndex = arrChklist.value.indexOf(n.mainID)
			if (iCheck == 1) {
				n.isChecked = 0
				arrChklist.value.splice(iIndex, 1)
			}
		})
	}

	const setActvPage = (iPage) => {
		page.value = iPage
		reload()
	}

	const deleteData = async () => {
		let details = arrChklist.value.toString()
		console.log('details =', details)
		let keydata = {			
			'siteID': window.sessionStorage.getItem('liwaSiteID'),
			'userID': window.sessionStorage.getItem('liwaUserID'),
			'makerName':window.sessionStorage.getItem('liwaUserName'),
			'details': details,
			'action':'delete',
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
	    const { data } = await useMyFetch('005_edit.php').post().json()
	    if (!data.value.message) {
	    	// window.location.href = '/005/'
	    } else {
	    	showMsg('', data.value.message, 1)
	    }	
	}

	// 設定 filters 內容 starts
	const saveFilters = () => {
		// 將過濾條件存在storage內
		let datastr = JSON.stringify(filters.value)
		window.sessionStorage.setItem('liwafilter_005', datastr)
	}

	const refetchFilters = () => {
		let tmpFilters = window.sessionStorage.getItem('liwafilter_005')
		let siteID = window.sessionStorage.getItem('liwaSiteID')
		let userID = window.sessionStorage.getItem('liwaUserID')
		if ((tmpFilters == "") || (tmpFilters == null)) {
			// sessionStorage內的liwafilters有值
			filters.value.siteID = siteID
			filters.value.userID = userID
			filters.value.shortItems = ''
			filters.value.itemTypeID = ''
			filters.value.startDate = ''
			filters.value.endDate = ''
			filters.value.status = 0
			filters.value.orderCol = orderCol.value
			filters.value.sortDir = sortDir.value
			filters.value.page = page.value
			filters.value.pageSize = pageSize.value
			let datastr = JSON.stringify(filters.value)
			window.sessionStorage.setItem('liwafilter_005', datastr)
		} else {
			let arrFilters = JSON.parse(tmpFilters)
			filters.value = arrFilters
		}
	}	

	// 設定 filters 內容 ends

	// 設定 liwaMsg starts
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
	// 設定 liwaMsg ends

	onMounted(() => {
    	let compName = window.sessionStorage.getItem('liwaSiteName')
    	const title = useTitle(compName+`- 公告列表`)
		// 先設定filter條件
		refetchFilters()
		fetchData()

	})

	// defineExpose({
	// 	reload,
	// })

	definePageMeta({
	  title: 'LiwaSite 公告管理',
	  layout: "default",
	})	
</script>

<template>
<banner
	:progname="progName"
	:proglink="proglink"
	:detailflg="detailFlg"
	:detailkey="detailKey"
></banner>
<div v-if="error">{{ error }}</div>
<div class="w-full bg-slate-200 px-4 py-2">
	<div class="barPanel h-12 rounded-3xl ml-4 mb-2 px-1">
		<div class="top-icon filter ml-4 -mt-1" @click="toggleFilter()">
			<g class="" style="fill:#FFF;stroke:#FFF;stroke-width:12px;stroke-linecap:round;stroke-linejoin:round;">
				<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					 viewBox="-50 -50 550 550" style="enable-background:new 0 0 487.95 487.95;" xml:space="preserve" width="30px" height="30px">
						<path d="M481.8,453l-140-140.1c27.6-33.1,44.2-75.4,44.2-121.6C386,85.9,299.5,0.2,193.1,0.2S0,86,0,191.4s86.5,191.1,192.9,191.1
							c45.2,0,86.8-15.5,119.8-41.4l140.5,140.5c8.2,8.2,20.4,8.2,28.6,0C490,473.4,490,461.2,481.8,453z M41,191.4
							c0-82.8,68.2-150.1,151.9-150.1s151.9,67.3,151.9,150.1s-68.2,150.1-151.9,150.1S41,274.1,41,191.4z"/>
				</svg>
			</g>
		</div>		
		<div class="top-icon add ml-2 -mt-1" @click="setMainID('add')">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="#fee" viewBox="-1 -1 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke="#fee" stroke-linejoin="round" stroke-width="6" d="M12 4v16m8-8H4" />
			</svg>
		</div>
		<div class="top-icon ml-2 -mt-1" @click="deleteData">
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
		<div class="w-full flex flex-row">
	    	<div class="w-full sm:h-96 md:h-[36rem] lg:h-[44rem] min-h-full -my-2 overflow-auto sm:-mx-6 lg:-mx-8">
	        	<div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
			        <div class="shadow border-b border-gray-500 bg-white">
			        	<table class="min-w-full divide-x divide-y divide-gray-200 bg-white">
			            	<thead class="bg-gray-50">
			                	<tr class="bg-emerald-300">
			                  		<th class="thPanel w-2/16">
											<div class="w-8 h-8 border-4 border-slate-500" @click="toggleChkAll()">
												<div v-if="isChkAllMode == 1">
													<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="-20 50 405.272 405.272" style="enable-background:new -20 50 405.272 405.272;"
														 xml:space="preserve">
														<g style="fill:#4338ca;stroke:#4338ca;stroke-width:12px;stroke-linecap:round;stroke-linejoin:round;">
															<path d="M393.401,124.425L179.603,338.208c-15.832,15.835-41.514,15.835-57.361,0L11.878,227.836
																c-15.838-15.835-15.838-41.52,0-57.358c15.841-15.841,41.521-15.841,57.355-0.006l81.698,81.699L336.037,67.064
																c15.841-15.841,41.523-15.829,57.358,0C409.23,82.902,409.23,108.578,393.401,124.425z"/>
														</g>
													</svg>
												</div>
												<div v-if="isChkAllMode == 0">
													<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 455 455" style="enable-background:new 0 0 455 455;" xml:space="preserve">
														<g style="fill:#4338ca;stroke:#4338ca;stroke-width:12px;stroke-linecap:round;stroke-linejoin:round;">
														<rect y="212.5" width="455" height="30"/>
														</g>
													</svg>	
												</div>
											</div>	
			                  		</th>
			                  		<th scope="col" class="thPanel w-2/5">
			                    	公告標題
			                  		</th>
			                  		<th scope="col" v-if="useShowmode()>1" class="thPanel w-2/5">
			                    	公告日期
			                  		</th>
			                  		<th scope="col" v-if="useShowmode()>1" class="thPanel w-2/16">
			                    	公告類別
			                  		</th>
			                	</tr>
			              	</thead>
							<tbody class="w-full bg-white ring-1 ring-gray-50">
								<tr 
									class="odd:bg-white even:bg-slate-200"
									v-for="(record, index) in liwaData" 
									:key="index"
									:data-id="record.mainID" 
									@click.prevent="setMainID(record.mainID)">
									<td scope="col" class="px-3 py-3 border-b order-gray-300 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
										<div class="w-full h-full flex flex-row justify-evenly pt-2">
											<div class="w-8 h-8 border-4 border-slate-500 mr-4" @click.stop.prevent="setChkList(record.mainID)">
												<div v-if="record.isChecked==1">
													<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="-20 50 405.272 405.272" style="enable-background:new -20 50 405.272 405.272;"
														 xml:space="preserve">
														<g style="fill:#4338ca;stroke:#4338ca;stroke-width:12px;stroke-linecap:round;stroke-linejoin:round;">
															<path d="M393.401,124.425L179.603,338.208c-15.832,15.835-41.514,15.835-57.361,0L11.878,227.836
																c-15.838-15.835-15.838-41.52,0-57.358c15.841-15.841,41.521-15.841,57.355-0.006l81.698,81.699L336.037,67.064
																c15.841-15.841,41.523-15.829,57.358,0C409.23,82.902,409.23,108.578,393.401,124.425z"/>
														</g>
													</svg>
												</div>
											</div>
											<div class="w-8 h-8" @click="setBM(record.mainID)">
												<div v-if="record.bookmark=='0'">
													<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 73.317 73.317" style="enable-background:new 0 0 73.317 73.317;" xml:space="preserve">
														<g style="fill:#FFF;stroke:#666;stroke-width:5px;stroke-linecap:round;stroke-linejoin:round;">
															<polygon points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182 "/>
														</g>
													</svg>
												</div>	
												<div v-else>
													<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="-10 -10 67.94 67.94" style="enable-background:new -10 -10 67.94 67.94;" xml:space="preserve">
														<g style="fill:#FF9933;stroke:#FF9933;stroke-width:12px;stroke-linecap:round;stroke-linejoin:round;">	 
															<polygon points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182 "/>						
														</g>
													</svg>
												</div>					
											</div>
										</div>	
									</td>
							        <td scope="col" class="tdPanel w-2/5">{{ record.shortItems }}
							        </td>
							        <td v-if="useShowmode()>1" class="tdPanel w-2/5">{{ record.pDate }}
							        </td>
						            <td v-if="useShowmode()>1" class="tdPanel w-1/5">{{ record.itemType }}
						            </td>
								</tr>
							</tbody>
			            </table>
			        </div>
		        </div>
		    </div>
	    </div> 
    </div>
    <div v-else>載入中...</div>
</div>
<div v-if="liwaData.length" class="w-full bg-slate-200 px-4 py-2">
	<!-- 頁碼控制 -->
	<liwaPages
		:page="page"
		:totalPage="totalPage"
		@setActvPage="setActvPage"
	></liwaPages>	
</div>
<div v-if="isFilter" class="absolute top-[170px] lg:top-[110px] z-10 inset-x-0 w-screen h-[calc(100vh_-_79px)] bg-transparent overflow-hidden items-center justify-center">
    <div class="flex justify-center w-full h-screen bg-transparent items-start antialiased">
      	<div class="h-full lg:h-[calc(100%_-_28rem)] flex flex-col mt-4 w-11/12 sm:w-5/6 lg:w-1/2 max-w-lg mx-auto rounded-lg border border-gray-300 shadow-xl">
        	<div class="relative flex flex-row justify-between px-6 py-2 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg text-center ">
        		<div class="w-5/7 h-8 text-2xl text-center">公告查詢</div>
        		<div class="w-2/7 h-8 flex flex-row justify-between">
		            <div class="w-8 h-8 top-2 right-2 bg-white cursor-pointer" @click.prevent="toggleFilter()">
			            <svg
			                class="w-6 h-6 float-left"
			                viewBox="0 0 24 24"
			                xmlns="http://www.w3.org/2000/svg"
			              >
			              	<g style="fill:#b91c1c;stroke:#b91c1c;stroke-width:2px;stroke-linecap:round;stroke-linejoin:round;">
			                	<path d="M6 18L18 6M6 6l12 12" />
			            	</g>
			            </svg>              
		            </div>          			
        		</div>
        	</div>
        	<div class="w-full h-full bg-slate-100">
        		<FormKit 
        			form-class="mt-4 ml-4 px-4 py-2 bg-yellow-200 rounded-2xl w-11/12"
        			v-model="filters"
        			type="form"
        			:form-class="submitted? 'hidden': 'block'"
        			submit-label="查詢"
        			@submit="fetchData()"
        		>
			        <FormKit
			          form-class="w-full "
			          name="shortItems"
			          label="標題"
			          type="text"
			          placeholder="輸入公告標題"
			          help="可輸入部份文字"
			        />
			        <div class="w-[95%] flex flex-col lg:flex-row justify-between">
				        <FormKit
				          name="startDate"
				          label="起始日"
				          type="date"
				        />
				        <FormKit
				          name="endDate"
				          label="結束日"
				          type="date"
				        />				        	
			        </div>
			        <FormKit
			          name="itemTypeID"
			          label="公告類別"
			          type="liwaDrop"
			          help="請選擇公告類別"
			        />
			        <FormKit
			          name="status"
			          label="上架狀態"
			          type="liwaDrop"
			          :options="rolesOption"
			          help="請選擇上架狀態"
			        />
        		</FormKit>
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