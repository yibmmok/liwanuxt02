/***********************************************************
*  prog name: use-liwa-Auth author: James, date: 2022/09/25
*  使用方式: 
*  1. import { useLiwaAuth } from '../composables/use-liwa-Auth.js'
*  2. const { iAuth } = useLiwaAuth(userID, progID)
*  作用: 傳入progID, userID, 找出該使用者是否有權限執行該
*		 程式, 
************************************************************/

import { ref } from "vue"
import { useFetch } from "@vueuse/core"

export async function useLiwaAuth(userID, progID) {
	const iAuth = ref(0)
	let APIsvr = window.sessionStorage.getItem('liwaAPIsvr')

	let url = `${APIsvr}/sys_`

	return { iAuth }
}