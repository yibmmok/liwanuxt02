<script setup>
	/*********************************************************
	prog name: liwaConfig, author: James Lin, date: 2022/08/18
	主功能: 測試v-slot的父元件使用

	**********************************************************/		
	import { ref, toRefs, watch } from "vue"
	import liwaConfigList from "./liwaConfigList.vue"

	const props = defineProps({
		isConfig : {
			type: Boolean,
			required: true,
			default: true
		}
	})

	const { isConfig } = toRefs(props)

	watch(isConfig, ()=> {
		console.log('isConfig in liwaConfig =', isConfig.value)
	})
	// const arrTab = ref([
	// 	{label:"設定1", class:"tabActive"},
	// 	{label:"設定2", class:""},
	// 	{label:"設定3", class:""},
	// ])

	// const liwaData = ref([
	// 	{label:"系統公告", value:"liwa0101", isShow:0},
	// 	{label:"會議記錄", value:"liwa0102", isShow:0},
	// ])

	const emits = defineEmits(["hideConfig"])

	const hideConfig1 = () => {
		emits("hideConfig")
		// isOpen.value = false
	}

	
</script>

<template>
<!-- <div></div> -->

    <div v-if="isConfig" class="flex justify-center w-full h-screen items-start bg-gray-200 antialiased">
		<div class="flex flex-col mt-4 w-11/12 h-[calc(100%_-_7rem)] sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl overflow-x-hidden overflow-y-auto">
			<div class="relative flex flex-row justify-between px-6 pt-2 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg text-center ">
			    <!-- 關閉對話盒按鈕 -->
				<div class="absolute w-8 h-8 top-2 right-2 bg-white cursor-pointer">
					<svg
					class="w-6 h-6 float-left"
					fill="red"
					stroke="red"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					@click.prevent="hideConfig1()"
					>
						<path
						  stroke-linecap="round"
						  stroke-linejoin="round"
						  stroke-width="2"
						  d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>              
				</div>	        	

				<slot>
			    	<div class="w-96 h-86 bg-violet-300"></div>
			    </slot>
			</div> 
		</div>    	
    </div>	

</template>