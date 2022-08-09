<script setup lang="ts">
	import { ref, onMounted } from "vue"

	const isShow = ref(false)
	const arrOption = ref([])
	const keyID = ref('')
	const props = defineProps({
	  context: {
	    type: Object as PropType<FormKitFrameworkContext & { sVal: string,  arrOption: []}>,
	    required: true
	  }
	})

	const showValue = ref('')

	const inputVal = ref<HTMLInputElement | null>(null)
	const context = toRef(props, 'context')

	const handleInput = (e) => {
		props.context.node.input(e.target.value)
	}

	const toggleMenu = () => {
		isShow.value = !isShow.value
	}

	const getItems = (sValue, sID) => {
		showValue.value = sValue
		props.context.node.input(sID)
		keyID.value = sID
		isShow.value = false
	}

	onMounted(() => {
		showValue.value = props.context.sVal
		arrOption.value = props.context.arrOption
	})
</script>

<template>
	<input 
		ref="inputVal"
		class="w-full h-8 outline-0 text-md"
		:value="showValue"
		:data-ID="keyID"
		readonly="readonly"
		@click="toggleMenu"
	/>
	<div v-if="isShow==true" 
		class="w-full h-24 absolute top-14 left-0 text-md outline-1 z-[100]"
	>
		<ul class="w-[95%] h-72 overflow-x-hidden overflow-y-auto">
			<li v-for="(item, index) in arrOption" 
				class="w-full h-10 pl-2 pt-2 border-b-2 border-b-slate-300 bg-slate-50 cursor-pointer lg:hover:bg-yellow-200"
				@click="getItems(item.label, item.value)"
			>{{ item.label }}
			</li>
		</ul>			
	</div>
	<div class="w-[20px] h-[20px] absolute top-8 right-1"
		@click="toggleMenu"
	>
		<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 386.257 386.257" style="enable-background:new 0 0 386.257 386.257;" xml:space="preserve">
		<polygon points="0,96.879 193.129,289.379 386.257,96.879 "/>
		</svg>		
	</div>


</template>