<script setup lang="ts">
	/*********************************************************
	prog name: 測試網頁, author: James Lin, date: 2022/07/26
	主功能: 測試swiper with local images
	
	**********************************************************/
	import { ref, onMounted } from "vue"
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
	const liwaClass = ref('h-[36rem]')
</script>

<template>
	<div class="w-[800px] h-[36rem] mx-auto my-0 relative flex flex-row">
		<div class="w-[100px] h-[36rem] ">
			<Thumbnail  
				v-model:currentSlide="slide" 
				:liwaData="liwaData" 
				:liwaClass="liwaClass"
				:liwaDirection="liwaDirection"
				@thumbs="thumbs"
			/>
		</div>
		<div class="w-[600px] h-full ml-[80px] pt-[200px]">
			<Carousel 
				:currentSlide="slide" 
				:thumbs="thumbs" 
				:liwaData="liwaData" 
				:imgWidth="Slide_imgWidth"
				:slideSpace="30"
			/>
		</div>
	</div>


</template>