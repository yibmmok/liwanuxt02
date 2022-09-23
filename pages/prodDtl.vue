<script setup lang="ts">
	/*********************************************************
	prog name: 物件明細, author: James Lin, date: 2022/09/01
	Todo: 1. 串資料庫
	**********************************************************/
	import { ref, onMounted } from "vue"
	import { useWindowSize, useTitle } from "@vueuse/core"
	import { useShowmode } from "../composables/use-showmode"
	import Carousel from '../components/Carousel.vue'
	import Thumbnail from '../components/Thumbnail.vue'	

	import 'swiper/css'
	import 'swiper/css/navigation'

	const liwaData = ref([
		{'img': '../static/Ruby1.jpg'},
		{'img': '../static/Ruby2.jpg'},
		{'img': '../static/Ruby3.jpg'},
		{'img': '../static/Ruby4.jpg'},
		{'img': '../static/Ruby5.jpg'},
	])
	const Slide_imgWidth = ref('w-96')
	const slide = ref(0)
	const thumbs = ref(null)
	const liwaDirection = ref('vertical')
	const liwaClass = ref('h-[500px]')		

	const iPicWidth = ref(650)
	const isDone = ref(false)
	const isSeller = ref(false)
	const isCerti = ref(true)
	const certiPath = ref('')
	const isBargain = ref(false)
	const msgBargain = ref('')

	const toggleCerti = () => {
		isCerti.value = !isCerti.value
	}

	const closeCerti = () => {
		isCerti.value = false
	}

	const openBargin = () => {
		isBargain.value = true
		// 開啟出價視窗後, 若非首次出價, 則顯示上次出價, 否則顯示出價提醒
		// msgBargain.value = "若您是首次出價, 請先閱讀斡旋須知"
		msgBargain.value = "您上次的出價 $42,000 已被拒絕, 您可以提高出價金額繼續"

	}

	const submitPrice = () => {
		isBargain.value = false
	}

	onMounted(() => {
		// useTitle('物件明細')
		const { width, height } = useWindowSize()
		// 若小於預設螢幕寬度, 則設為預設螢幕寬度
		if (width.value < iPicWidth.value) {
			iPicWidth.value = width.value - 20
			console.log('iPicWidth =', iPicWidth.value)
		}
		certiPath.value = 'http://172.105.227.123/archive/certificate/2022/SR15922646.pdf'
	})

	definePageMeta({
	  title: '物件明細',
	  layout: "web",
	})		

</script>

<template>
	<div class="mainBox relative w-full flex flex-col lg:flex-row bg-stone-100 py-4 lg:py-8">
		<div class="w-full lg:w-2/5">
			<div class="w-full h-[500px] mx-auto my-0 relative flex flex-row">
				<div class="w-0 lg:w-1/3 h-[500px] bg-transparent">
					<Thumbnail  
						v-model:currentSlide="slide" 
						:liwaData="liwaData" 
						:liwaClass="liwaClass"
						:liwaDirection="liwaDirection"
						@thumbs="thumbs"
					/>
				</div>
				<div class="w-full lg:w-2/3 h-full ml-0 lg:ml-[80px] pt-[50px] bg-transparent">
					<Carousel 
						:currentSlide="slide" 
						:thumbs="thumbs" 
						:liwaData="liwaData" 
						:imgWidth="Slide_imgWidth"
						:slideSpace="30"
					/>
				</div>
			</div>
		</div>
		<div class="w-full lg:w-3/5 px-4 lg:px-16 pt-4 relative">
			<h1 class="w-full text-4xl text-slate-700 font-bold mt-2 mb-6 pb-6 border-b-2 border-b-slate-200 word-wrap">緬甸無燒鴿血紅紅寶石K 金戒指</h1>
			<div class="w-full flex flex-row my-12">
				<div class="w-1/2">
					<p class="text-sm font-bold text-slate-400 mb-2">期望售價</p>
					<p class="text-lg pl-3 text-slate-600">NTD 82,000</p>
				</div>
				<div class="w-1/2 border-l-2 border-l-slate-100" v-if="isDone == true">
					<p class="text-sm font-bold text-slate-400 mb-4">成交價</p>
					<p class="text-lg pl-3 text-slate-600">NTD 60,000</p>			
				</div>
			</div>
			<div class="w-full flex flex-row my-12">
				<div class="w-1/2">
					<p class="text-sm font-bold text-slate-400 mb-2">賣家</p>
					<p class="text-lg pl-3 text-slate-600"><a href="#">1210000213</a></p>
				</div>
				<!-- 追蹤物件賣家按鈕 -->
				<div class="w-1/2 cursor-pointer pt-4" v-if="isSeller == false" @click="">
					<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 370.126 370.126" style="enable-background:new 0 0 370.126 370.126;" xml:space="preserve" class="float-left">
						<g>
							<path d="M142.046,176.296c48.594,0,88.128-39.542,88.128-88.146C230.174,39.544,190.64,0,142.046,0
								C93.445,0,53.904,39.544,53.904,88.149C53.904,136.754,93.445,176.296,142.046,176.296z"/>
							<path d="M285.366,257.497h-7.547c-0.158,0-0.336-0.069-0.453-0.144v-7.856c0-5.607-4.193-10-9.547-10h-1.28
								c-5.515,0-10.173,4.579-10.173,10l-0.003,8h-7.997c-5.421,0-10,4.658-10,10.173v1.28c0,5.354,4.393,9.547,10,9.547h7.856
								c0.074,0.117,0.144,0.295,0.144,0.453v7.547c0,5.421,4.658,10,10.173,10h1.28c5.353,0,9.547-4.393,9.547-10v-7.456
								c0.078-0.186,0.357-0.466,0.544-0.544h7.456c5.607,0,10-4.193,10-9.547v-1.28C295.366,262.155,290.787,257.497,285.366,257.497z"/>
							<path d="M267.211,185.921c-15.334,0-29.692,4.242-41.98,11.6c-0.191-0.006-0.382-0.023-0.573-0.023H59.419
								c-10.711,0-20.73,8.256-22.811,18.797l-15.229,77.209c-1.97,9.978,2.857,22.581,10.99,28.692
								c2.604,1.957,64.315,47.931,109.669,47.931c27.654,0,61.771-17.389,84.432-31.142c12.012,6.911,25.917,10.886,40.741,10.886
								c45.201,0,81.975-36.773,81.975-81.975C349.186,222.694,312.413,185.921,267.211,185.921z M267.211,319.87
								c-28.659,0-51.975-23.315-51.975-51.975c0-28.659,23.315-51.975,51.975-51.975s51.975,23.316,51.975,51.975
								C319.186,296.555,295.871,319.87,267.211,319.87z"/>
						</g>
					</svg>
					<span class="text-sm text-slate-600 ml-2">追蹤</span>
				</div>
			</div>
			<div class="w-full my-12">
				<p class="text-sm font-bold text-slate-400 mb-2">上架截止日</p>
				<p class="text-lg pl-3 text-slate-600">2022/09/30</p>
			</div>
			<!-- 收藏該物件按鈕 -->
			<div class="w-24 h-12 pl-4 pt-3 absolute right-4 bottom-0 bg-emerald-500 rounded-2xl" v-if="isSeller == false" @click="">
				<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 471.701 471.701" style="enable-background:new 0 0 471.701 471.701;" xml:space="preserve" class="float-left">
					<g style="fill:#b91c1c;stroke:#b91c1c;stroke-width:12px;stroke-linecap:round;stroke-linejoin:round;">
						<path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1	c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3		l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3		s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4		c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3C444.801,187.101,434.001,213.101,414.401,232.701z"/>
					</g>
				</svg>
				<span class="text-white ml-2 ">收藏</span>
			</div>
		</div>
	</div>
	<div class="w-full bg-white">
		<div class="w-full lg:w-[900px] mx-auto py-4 flex flex-col lg:flex-row">
			<div class="w-full pl-4 py-4 text-md flex flex-row" v-if="useShowmode()==1">
				<span class="text-slate-400">評分:</span>
				<span class="ml-2 text-blue-500 font-semibold">84</span>
			</div>
			<div class="w-72" v-else>
				<p class="text-sm font-bold text-slate-400 mb-2">評分</p>
				<p class="text-5xl pl-3 text-blue-500 font-bold">84</p>
			</div>
			<div class="w-full flex flex-col lg:w-[calc(100%_-_18rem) lg:px-4">
				<div class="w-full p-4">
					<p class="text-sm font-bold text-slate-400 mb-2">說明</p>
					<div class="descp w-full ">
						<p>種類:紅寶石; 切割: 蛋形; 顏色: 紅色;</p>
						<p>尺寸: 約 7.3 x 6.1 mm; 重量: 總重 6.205 克; </p>
						<p>產地: 緬甸</p>
					</div>
				</div>
				<div class="w-full p-4">
					<p class="text-sm font-bold text-slate-400 mb-2">鑑定證書</p>
					<div class="descp w-full ">
						<span>[<a href="#">證書1</a>]</span>
						<span>[<a href="#">證書2</a>]</span>
						<span>[<a href="#">證書3</a>]</span>
					</div>
				</div>				
				<div class="w-full p-4 border-b-2 border-b-slate-300">
					<div class="w-full flex flex-row">
						<div class="text-sm font-bold text-slate-400 mb-2 mr-2">鑑定師意見</div>
<!-- 						<div class="w-24 h-8 pl-4 pt-1 -mt-2 bg-slate-700 text-white rounded-lg lg:cursor-pointer" @click="toggleCerti()">查詢證書</div> -->
					</div>
					<div class="descp w-full">
						<p>主石未顯示熱處理跡象，符合緬甸產紅寶石之寶石學特性，商業上稱為「鴿血紅紅寶石」，配石與K金已檢驗。</p>
					</div>
				</div>
				<div class="w-full flex flex-row pt-8">
					<div class="w-24 pl-3 border-r-2 border-r-slate-400"><a href="#">斡旋須知</a></div>
					<div class="w-64 pl-8"><a href="#">常見Q & A</a></div>
				</div>
			</div>
		</div>
	</div>
	<div class="w-full bg-stone-200" v-if="isDone == false">
		<div class="w-full lg:w-[800px] mx-auto py-4" v-if="isSeller == false">
			<div class="w-full flex flex-row">
				<span>斡旋次數:</span>
				<span class="ml-4 mr-4">3</span>
<!-- 				<div class="w-24 h-8 rounded-lg bg-orange-900 text-white text-center pt-[0.125rem] -mt-1">
					<a href="#" >斡旋須知</a>
				</div> -->
			</div>
			<div v-if="isBargain == false" class="w-full py-12 ">
				<div class="w-24 h-8 rounded-lg bg-emerald-500 text-white text-center pt-1 mx-auto cursor-pointer" @click="openBargin">我要出價</div>
			</div>
			<div v-else class="w-full py-4">
				<p class="py-4">可出價次數: 2</p>
				<p class="py-4 text-red-500">{{ msgBargain }}</p>
				<div class="w-full h-12">
					<div class="w-full lg:w-[60%] flex flex-row lg:mx-auto">
						<div class="w-8 h-full">NT$</div>
						<input type="text" class="text-right border-0 border-b-2 border-b-slate-700 pr-4" placeholder="請輸入出價">
						<div class="w-24 h-8 rounded-lg bg-red-400 text-white text-center pt-1 ml-2 cursor-pointer" @click="submitPrice()">送出</div>
					</div>
				</div>
			</div>
		</div>		
		<div class="w-full lg:w-[900px] mx-auto py-2" style="min-height:8rem;" v-else>
			<div class="w-full h-10 font-bold bg-white pl-4 pt-2">斡旋記錄</div>
			<div class="w-full min-h-full">
				<div class="pb-2 align-middle inline-block min-w-full">
					<div class="shadow border-b border-gray-500 bg-white">
						<table class="min-w-full divide-x divide-y divide-gray-200 bg-white">
							<thead class="bg-gray-50">
								<tr class="bg-slate-300">
									<th class="w-1/3 text-center">日期</th>
									<th class="w-1/3 text-center">買方</th>
									<th class="w-1/3 text-center">出價</th>
								</tr>
							</thead>
							<tbody class="w-full bg-white ring-1 ring-gray-50">
								<tr class="odd:bg-white even:bg-slate-200">
									<td scope="col" class="tdPanel w-1/3">2022/08/06</td>
									<td scope="col" class="tdPanel w-1/3">1210000528</td>
									<td scope="col" class="tdPanel w-1/3">
										<span class="float-left">NTD 60,000</span>
										<div class="w-24 flex flex-row ml-4">
											<div class="w-12 h-6 ml-2 rounded-lg bg-emerald-400 text-white text-center cursor-pointer">
												同意
											</div>
											<div class="w-12 h-6 ml-2 rounded-lg bg-red-400 text-white text-center cursor-pointer">
												拒絕
											</div>
										</div>
									</td>
								</tr>								
								<tr class="odd:bg-white even:bg-slate-200">
									<td scope="col" class="tdPanel w-1/3">2022/08/03</td>
									<td scope="col" class="tdPanel w-1/3">1210000528</td>
									<td scope="col" class="tdPanel w-1/3">
										<span>NTD 58,000</span>
									</td>
								</tr>
								<tr class="odd:bg-white even:bg-slate-200">
									<td scope="col" class="tdPanel w-1/3">2022/07/26</td>
									<td scope="col" class="tdPanel w-1/3">1210000177</td>
									<td scope="col" class="tdPanel w-1/3">
										<span>NTD 52,000</span>
									</td>
								</tr>
								<tr class="odd:bg-white even:bg-slate-200">
									<td scope="col" class="tdPanel w-1/3">2022/07/13</td>
									<td scope="col" class="tdPanel w-1/3">1210000718</td>
									<td scope="col" class="tdPanel w-1/3">
										<span>NTD 46,000</span>
									</td>
								</tr>				
							</tbody>
						</table>						
					</div>
				</div>
			</div>
		</div>		
	</div>
	<teleport to="body">
		<div class="w-full h-[70vh] absolute top-[70px] bg-slate-100" v-if="isCerti == true">
			<div class="w-full lg:w-[800px] h-full mx-auto my-0 relative">
				<h1 class="w-full h-12 text-2xl">鑑定證書</h1>
				<div class="w-full h-full border-2 border-emerald-400 overflow-x-hidden overflow-y-auto">
					<iframe :src="certiPath" frameborder="0" class="w-full h-full"></iframe>
				</div>
				<div class="w-12 h-12 absolute top-0 right-0 cursor-pointer" @click.stop="closeCerti">
			        <svg
			          class="w-8 h-8 float-left"
			          viewBox="0 0 24 24"
			          xmlns="http://www.w3.org/2000/svg"
			        >
						<g class="" style="fill:#933;stroke:#933;stroke-width:12px;stroke-linecap:round;stroke-linejoin:round;">
							<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
							></path>
						</g>
			        </svg>   						
				</div>				
			</div>
		</div>
	</teleport>
</template>

<style scoped>
	body {
		position:relative;
	}

	.descp p
	{
		margin: 1rem 1rem;
		line-height: 25px;
	}

	.descp span
	{
		margin-left:0.5rem;
	}
</style>