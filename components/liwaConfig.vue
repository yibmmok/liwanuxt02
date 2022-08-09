<script setup>
	import { ref } from "vue"
	const box1_clss = ref('')
	const box2_clss = ref('')
	const box3_clss = ref('')
	const box4_clss = ref('')
	const tab1_clss = ref('')
	const tab2_clss = ref('')
	const tab3_clss = ref('')
	const tab4_clss = ref('')

	const switchContent = (iNum) => {
		switch (iNum) {
			case 1: 
				box1_clss.value = ""
				box2_clss.value = "hidden"
				box3_clss.value = "hidden"
				box4_clss.value = "hidden"
				tab1_clss.value = "tab-active"
				tab2_clss.value = ""
				tab3_clss.value = ""
				tab4_clss.value = ""
				break
			case 2:
				box1_clss.value = "hidden"
				box2_clss.value = ""
				box3_clss.value = "hidden"
				box4_clss.value = "hidden"
				tab1_clss.value = ""
				tab2_clss.value = "tab-active"
				tab3_clss.value = ""
				tab4_clss.value = ""				
				break
			case 3:
				box1_clss.value = "hidden"
				box2_clss.value = "hidden"
				box3_clss.value = ""
				box4_clss.value = "hidden"
				tab1_clss.value = ""
				tab2_clss.value = ""
				tab3_clss.value = "tab-active"
				tab4_clss.value = ""				
				break
			 case 4:
				box1_clss.value = "hidden"
				box2_clss.value = "hidden"
				box3_clss.value = "hidden"
				box4_clss.value = ""
				tab1_clss.value = ""
				tab2_clss.value = ""
				tab3_clss.value = ""
				tab4_clss.value = "tab-active"				
			 	break
			 default:
				box1_clss.value = true
				box2_clss.value = false
				box3_clss.value = false
				box4_clss.value = false
				tab1_clss.value = "tab-active"
				tab2_clss.value = ""
				tab3_clss.value = ""
				tab4_clss.value = ""
		}
	}

	const emits = defineEmits(["hideConfig"])

	const hideConfig1 = () => {
		emits("hideConfig")
	}

	switchContent(1)
	
</script>

<template>
<div class="absolute z-10 inset-x-0 w-screen h-screen overflow-hidden items-center justify-center" style="top:64px;height:calc(100vh - 79px);">
    <div class="flex justify-center w-full h-screen items-start bg-gray-200 antialiased">
      <div class="flex flex-col mt-4 w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl" style="height:calc(100% - 7rem)">
        <div class="relative flex flex-row justify-between px-6 py-2 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg text-center ">
        	<!-- 預留 40px 給關閉按鈕 -->
		    <ul id="tabs" class="inline-flex px-1 pt-2 " style="width:calc(100% - 40px);">
		      <li class="px-4 py-2 font-semibold text-gray-800 rounded-t opacity-50" :class="tab1_clss" @click="switchContent(1)">All</li>
		      <li class="px-4 py-2 font-semibold text-gray-800 rounded-t opacity-50" :class="tab2_clss" @click="switchContent(2)">Clothes</li>
		      <li class="px-4 py-2 font-semibold text-gray-800 rounded-t opacity-50" :class="tab3_clss" @click="switchContent(3)">Electronics</li>
		      <li class="px-4 py-2 font-semibold text-gray-800 rounded-t opacity-50" :class="tab4_clss" @click="switchContent(4)">Others</li>
		    </ul>
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
        </div> 
	    <div id="tab-contents" class="float-left w-full bg-white" style="height:calc(100% - 3rem)">
	      <div class="p-4" :class="box1_clss">
	        First tab
	      </div>
	      <div class="p-4" :class="box2_clss">
	        Second tab
	      </div>
	      <div class="p-4" :class="box3_clss">
	        Third tab
	      </div>
	      <div class="p-4" :class="box4_clss">
	        Fourth tab
	      </div>
	    </div>         
      </div>    	
    </div>	
</div>
</template>