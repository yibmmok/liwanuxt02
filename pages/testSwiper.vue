<script setup lang="ts">
	/*********************************************************
	prog name: 測試網頁, author: James Lin, date: 2022/07/12
	主功能: 
	
	**********************************************************/
	import { ref, onMounted } from "vue"
	import Carousel from '../components/Carousel.vue'
	import Thumbnail from '../components/Thumbnail.vue'	

	import 'swiper/css'
	import 'swiper/css/navigation'

	const lightbox = ref(false)
	const slide = ref(0)
	const thumbs = ref(null)
	// const modules = ref([Navigation, Thumbs])

	const onSwiper = (swiper) => {
		console.log('swiper =', swiper)
	}

	// const onSlideChange = () => {
	// 	console.log('slide change')
	// }

	const closeLightbox = () => {
		lightbox.value = false
	}


</script>

<template>
	<div class="grid grid-cols-4 auto-cols-max grid-flow-dense gap-2">
		<div v-for="n in 20" :key="n" class="w-auto" @click="lightbox = true; slide = Number(n) - 1">
		  <img :data-src="'https://picsum.photos/640/480?random='+n" class="lazyload" />
		</div>
	</div>	
	<teleport to="body">
		<div class="fixed left-0 top-0 w-[100vw] h-[100vh] bg-white" v-show="lightbox">
			<!-- lightBoxDialog -->
			<div class="w-full h-full relative m-auto p-0" >
				<!-- lightBoxContent -->
				<div class="w-full h-full relative overflow-auto" >
					<!-- lightBoxHeader -->
					<div class="py-2 w-full h-[80px] absolute top-0 left-0 flex flex-row-reverse justify-between" >
						<div class="w-12 h-12" @click.stop="closeLightbox">
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
					<div class="w-[1024px] h-[60vh] mx-auto my-0 relative flex flex-row">
						<Carousel :current-slide="slide" :thumbs="thumbs" />
<!-- 						<swiper
							class="w-[80%] bg-orange-100"
							:slides-per-view="1"
							:space-between="50"
							:navigation="true"
							:modules="modules"
							@swiper="onSwiper"
							@slideChange="onSlideChange"
						>
							<swiper-slide v-for="n in 20" :key="n" class="bg-yellow-100 mr-2 mt-[250px] flex flex-col">
								<img :src="'https://picsum.photos/640/480?random='+n" />
								<div class="w-full text-center mt-4" >Slide {{ n }}</div>
							</swiper-slide>
						</swiper> -->
					</div>	
					<div class="w-[1024px] h-[60vh] mx-auto my-0 relative flex flex-row">
						<Thumbnail @thumbs="thumbs" v-model:current-slide="slide" />
<!-- 						<swiper
							class="w-full bg-red-100"
							:slides-per-view="10"
							:space-between="20"
							:modules="modules"
							watch-slides-progress
							@swiper="onSwiper"
						>
							<swiper-slide v-for="n in 20" :key="n" class="bg-yellow-100 mr-2 mt-[250px] flex flex-col" @click.stop="">
								<img :src="'https://picsum.photos/640/480?random='+n" style="height: 100px" />
							</swiper-slide>
						</swiper> -->
					</div>					
				</div>
			</div>
		</div>
	</teleport>
</template>

<style scoped>
	.swiper-slide {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 6rem;
		height: 6rem !important;
	}
</style>