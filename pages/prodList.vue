<script setup lang="ts">
	/*********************************************************
	prog name: 物件列表, author: James Lin, date: 2022/09/01
	Todo: 1. 串資料庫 
		  2. 
	**********************************************************/
	import { ref, onMounted } from "vue"
	import { useFetch, createFetch, useTitle } from "@vueuse/core"
	import liwaMsg from "../components/liwaMsg.vue"

	const route = useRoute()

	const loadData = () => {

	}

	onMounted(() => {
		let arrTmp = route.split("?")
		console.log('router parameter =', strTmp)
		let params = arrTmp[1]
		if (params) console.log('params', params)
	})

	definePageMeta({
	  title: '物件列表',
	  layout: "web",
	})	
	
</script>

<template>
	<!-- v-for 寫在這裏 -->
	<div
		class="w-full h-full relative p-4 flex flex-row overflow-y-auto"
	>
		<div class="w-72 h-[30rem] bg-slate-100 flex flex-col ml-2">
			<div class="w-full h-64">
				<img src="../static/2018112096564.png" class="w-full h-64" />
			</div>
			<div class="w-full p-2">
				<h6 class="w-full text-sm text-slate-500">物件編號:2207065</h6>
				<h1 class="w-full text-2xl text-blue-700 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">天然藍晶石男女通用手鏈</h1>
				<h2 class="w-full text-md text-slate-600 mt-4">期望售價: NTD 20,000</h2>
				<div class="w-full text-md text-slate-600 mt-4">已斡旋: 3</div>
				<div class="w-full flex flex-row mt-8">
					<div class="w-1/4 text-md">評分:74</div>
					<div class="w-2/4 text-red-600 font-bold text-center">斡旋中</div>
					<div class="w-1/4">
						<svg version="1.1" id="Capa_1" class="float-right" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 471.701 471.701" style="enable-background:new 0 0 471.701 471.701;" xml:space="preserve">
						<g>
							<path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1	c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3		l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3		s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4	c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3C444.801,187.101,434.001,213.101,414.401,232.701z"/>
						</g>
						</svg>						
					</div>					
				</div>
			</div>
		</div>
		<div class="w-72 h-[30rem] bg-slate-100 flex flex-col ml-4">
			<div class="w-full h-64">
				<img src="../static/2018112039089.png" class="w-full h-64" />
			</div>
			<div class="w-full p-2">
				<h6 class="w-full text-sm text-slate-500">物件編號:2207129</h6>
				<div class="w-full text-2xl text-blue-700 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">混色天然藍寶石項鏈及耳墜組</div>
				<h2 class="w-full text-md text-slate-600 mt-4">期望售價: NTD 42,000</h2>
				<div class="w-full text-md text-slate-600 mt-4">已斡旋: 1</div>
				<div class="w-full flex flex-row mt-8">
					<div class="w-1/4 text-md">評分:68</div>
					<div class="w-2/4 text-red-600 font-bold text-center">斡旋中</div>
					<div class="w-1/4">
						<svg version="1.1" id="Capa_1" class="float-right" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 471.701 471.701" style="enable-background:new 0 0 471.701 471.701;" xml:space="preserve">
						<g>
							<path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1	c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3		l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3		s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4	c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3C444.801,187.101,434.001,213.101,414.401,232.701z"/>
						</g>
						</svg>						
					</div>					
				</div>
			</div>
		</div>		
	</div>
</template>