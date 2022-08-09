<script setup lang="ts">
	/*********************************************************
	prog name: 我的帳號, author: James Lin, date: 2020/05/11
	主功能: 

	**********************************************************/	
	import { ref, reactive, onMounted } from "vue"
	import { useStorage,  } from "@vueuse/core"

	const activeTab = ref(1)
	const isSyslist = ref(false)
	const isProfile = ref(false)

	const setActiveTab = () => {
		if (activeTab.value == 1) {
			activeTab.value = 2
			isProfile.value = true
			isSyslist.value = false
		} else {
			activeTab.value = 1
			isProfile.value = false
			isSyslist.value = true
		}
	}

	const setActive1 = () => {
		return (activeTab.value == 1)? 'underline decoration-amber-300 decoration-[4px]': ''
	}

	const setActive2 = () => {
		return (activeTab.value == 1)? '': 'underline decoration-amber-300 decoration-[4px]'
	}

	definePageMeta({
	  title: `liwasite -我的帳號`,
	})

	onMounted(() => {
		activeTab.value = 1
		isProfile.value = false
		isSyslist.value = true
	})
</script>

<template>
	<div class="w-full bg-gradient-to-r from-indigo-900 to-violet-200 px-4 py-2">
		<div class="max-w-lg w-full mx-auto flex flex-row justify-start">
			<div class="w-1/2 h-8 border-2 border-white text-center text-white cursor-pointer"
			:class="setActive1()"
			@click="setActiveTab()"
			>雲系統列表</div>
			<div class="w-1/2 h-8 border-2 border-white text-center text-white cursor-pointer"
			:class="setActive2()"
			@click="setActiveTab()"
			>基本資料</div>
		</div>
		<div v-if="isSyslist">
			<div v-if="error">{{ error }}</div>
			<div class="w-full bg-slate-200 px-4 py-2">
				
			</div>
		</div>
		<div v-if="isProfile">
			<div class="w-full h-full mx-auto my-0 lg:max-w-lg bg-white">
				<div class="w-full bg-white mx-auto my-2 rounded-xl pb-1">
					<FormKit 
					form-class="px-4 bg-yellow-200 rounded-2xl w-11/12"
					type="form"
					v-model="liwaData"
					:form-class="submitted? 'hidden': 'block'"
					style="margin: 1rem auto;"
					submit-label="存檔"
					@submit="saveData"
					>
						<div class="w-full h-[200px]">
							<img 
							class="mx-auto border-2 w-[200px] h-full"
							:src="liwaData.iconPath" width="200" :alt="liwaData.username"  />
						</div>
						<FormKit 
							name="username*"
							label="姓名"
							type="text"
							placeholder="請輸入姓名"
							help="可輸入中英文名字(字數限制100字)"
							validation="required"							
						/>
						<FormKit
						  name="nickname"
						  label="暱稱*"
						  type="text"
						  placeholder="請設定暱稱"
						  help="可輸入中英文名字(字數限制100字)"
						  validation="required"
						/>
						<div class="w-full flex flex-row justify-between">
						    <FormKit
						      name="gender"
						      label="性別*"
						      type="radio"
						      outer-class="w-[95%]"
						      :options="['先生', '小姐']"
						      help="請選擇性別"
						      v-model="state.liwaData.gender"
						    />		        	
						</div>
						<FormKit
						  name="email"
						  label="Email*"
						  type="email"
						  help="請設定Email"
						  validation="required|email"
						/>
						<FormKit
						  name="password"
						  label="密碼*"
						  type="password"
						  help="請輸入密碼, 必須8字元以上, 必須含英文大小寫字元及數字"
				          validation="required|alphanumeric:latin|length:8"
				          :validation-messages="{
				            length: '密碼長度必須8字元以上',
				          }"
						/>
						<FormKit
							name="password_confirm"
							label="密碼確認*"
							type="password"
							help="確認密碼"
							validation="required|confirm"
							validation-visibility="live"
						/>	
				        <FormKit
				          name="phone*"
				          label="市話"
				          type="tel"
				          placeholder="xx-xxxxxx"
				          help="市話格式範例:02-21345678"
				          validation="matches:/^[0-9]{2}-[0-9]{8}$/"
				        />
				        <FormKit
				          name="mobile*"
				          label="手機"
				          type="tel"
				          placeholder="xxxx-xxxxxx"
				          help="手機格式範例:0912-123456"
				          validation="matches:/^[0-9]{4}-[0-9]{6}$/"
				        />	
				        <FormKit
				          name="userBrief"
				          label="個人簡介"
				          type="textarea"
				          placeholder="請輸入個人簡介"
				          help="請介紹你自己"
				        />					        			        
					</FormKit>
				</div>
			</div>
		</div>
	</div>
</template>