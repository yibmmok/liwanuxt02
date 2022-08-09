<template>
<div class="max-w-lg w-full bg-yellow-200 pl-2 overflow-y-auto" style="margin: 0 auto;">
  <FormKit
    v-for="type in inputTypes"
    :key="type"
    :label="`This is a ${type} input`"
    :type="type"
    :placeholder="`${type} input placeholder`"
    :options="inputOptions[type] ? inputOptions[type] : null"
    :help="`Help text for the ${type} input`"
    :multiple="type === 'file'"
    :disabled="type === 'date' ? true : undefined"
    :validation="type === 'email' ? 'required|email' : 'required'"
    :validation-visibility="type === 'email' ? 'live' : 'blur'"
    :validation-label="type"
  />	
</div>	

</template>

<script setup>
    import { onMounted } from 'vue'

	const inputTypes = ['button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'month', 'number', 'password', 'radio', 'range', 'search', 'select', 'submit', 'tel', 'text', 'textarea', 'time', 'url', 'week']
	const inputOptions = {
	  checkbox: ['I like Tailwind', 'I also like FormKit', 'I like other things too'],
	  radio: ['I like Tailwind', 'I like FormKit', 'I like everything'],
	  select: ['I like Tailwind', 'I like FormKit', 'I like everything'],
	}

    definePageMeta({
      title: 'Formkit 測試頁'
    })

    onMounted(() => {
 
    })
</script>

<style scoped>
	/*@import url("~/assets/css/formkit.css");*/

</style>