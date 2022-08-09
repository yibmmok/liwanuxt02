<script setup lang="ts">
	/*********************************************************
	prog name: 測試網頁, author: James Lin, date: 2020/04/19
	主功能: 

	**********************************************************/
	import { ref, onMounted } from "vue"
	// import { createInput } from "@formkit/vue"
	// import liwaCombo from "../components/liwaCombo"

	const values = ref({})
	// const Combobox = createInput(liwaCombo, {
	// 	props: ['sVal', 'arrOption'],
	// })
	// const isShow = ref(false)
	// const showValue = ref('')
	// const keyID = ref('')
	const region = ref('Asia')

	const liwaData = ref([
		{'value': 'abc', 'label': 'Asia'},
		{'value': 'def', 'label': 'Africa'},
		{'value': 'ghi', 'label': 'Aserica'},
		{'value': 'jkl', 'label': 'Austria'},
		{'value': 'mno', 'label': 'Europe'}		
	])
	// const comboData = ref([
	// 	{'value': 'abc', 'label': 'Asia'},
	// 	{'value': 'def', 'label': 'Africa'},
	// 	{'value': 'ghi', 'label': 'Aserica'},
	// 	{'value': 'jkl', 'label': 'Austria'},
	// 	{'value': 'mno', 'label': 'Europe'}
	// ])


	const getResult1 = () => {

	}

	// const filterData = () => {
	// 	isShow.value = true
	// 	let iLen = showValue.value.length
	// 	if (iLen > 0) {
	// 		console.log('item value =', liwaData.value[0].val.substr(0, iLen))
	// 		comboData.value = liwaData.value.filter(liwaItem => 
	// 			liwaItem.val.substr(0, iLen) == showValue.value
	// 		)
	// 		console.log('comboData =', comboData.value)
	// 	} else {
	// 		comboData.value = liwaData.value
	// 	}
	// }

	// const clearInput = () => {
	// 	showValue.value = ''
	// 	filterData()
	// }

	// const toggleMenu = () => {
	// 	isShow.value = !isShow.value
	// 	if (isShow.value == true) {
	// 		filterData()
	// 	}
	// }	

	// const getItems = (sValue, sID) => {
	// 	showValue.value = sValue
	// 	// props.context.node.input(sID)
	// 	keyID.value = sID
	// 	isShow.value = false
	// }	

	onMounted(() => {	

	})

	definePageMeta({
	  title: 'LiwaSite 測試頁',
	})	
</script>

<template>
	<div>
		<h1>測試網頁</h1>
	</div>
	<div>
		<div 
			class="w-12 h-8 bg-slate-500 text-white text-center pt-1 ml-4 mt-2 cursor-pointer"
			@click="getResult1()"
			>測試</div>
		<div class="w-12 h-8 bg-purple-200 invisible" @click="" ref="btnTest2">btnTest2</div>	
	</div>
	<FormKit type="form" v-model="values">
		<div class="w-96 relative">
			<FormKit
			  type="liwaCombo"
			  label="地區別"
			  name="region"
			  help="請選擇地區別"
			  :sVal="region"
			  :arrOption="liwaData"
			/>			
		</div>

	</FormKit>	
	 <pre wrap>{{ values }}</pre>
<!-- 	<div class="w-72 h-16 bg-emerald-100 p-4 relative">
		<input 
			ref="inputVal"
			class="w-full h-8 outline-2 text-md"
			v-model="showValue"
			:data-ID="keyID"
			@click="toggleMenu"
			@keyup="filterData"
			@keydown.esc="clearInput"
		/>
		<div v-if="isShow==true" 
			class="max-w-[16rem] w-full h-48 absolute top-12 left-4 text-md outline outline-1 overflow-x-hidden overflow-y-auto"
		>
			<ul class="">
				<li v-for="(item, index) in comboData" 
					class="w-full h-8 border-b-2 border-b-slate-200 bg-slate-100 cursor-pointer"
					@click="getItems(item.val, item.id)"
				>{{ item.val }}
				</li>
			</ul>
		</div>			
	</div> -->

</template>

<style>
	
</style>