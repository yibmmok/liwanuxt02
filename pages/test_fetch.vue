<template>
<div>
	<h1>測試useFetch</h1>
	<div class="w-full h-12">
		<div class="w-20 h-8 mx-2 pt-1 float-left bg-indigo-300 text-center cursor-pointer" @click="fetchGET">GET</div>
		<div class="w-20 h-8 pt-1 float-left bg-yellow-300 text-center cursor-pointer" @click="fetchPOST">POST</div>
	</div>
	<pre>
		資料來源:
		{{ text }}
	</pre>
</div>	
</template>

<script setup lang="ts">
	import { useFetch, createFetch } from "@vueuse/core"
	import { ref } from "vue"

	const text = ref('')

	const liwaData = ref({
		name: 'james'
	})
	let AA = JSON.stringify(liwaData.value)
	console.log('AA =', AA)

	const useMyFetch = createFetch({
		baseUrl: 'http://localhost:8102',
		options: {

		},
		fetchOptions: {
			mode: 'cors',
	        headers: new Headers({
	          'Content-Type': 'application/json; charset=utf-8'
	        }),
	        body: JSON.stringify(liwaData.value)		
		}
	})

	const fetchGET = () => {
		const { data } = useFetch('http://localhost:8102/tmp_havePeople.php?mainID=').get().json()
		console.log('GET data =', data)
		text.value = data
	}
	
	const fetchPOST = () => {
		console.log('POST start')
		const { data } = useMyFetch('tmp_testPOST.php').post().json()
		console.log('POST data =', data)
		text.value = data
	}
</script>