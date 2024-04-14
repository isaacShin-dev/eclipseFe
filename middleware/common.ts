//router-guard.ts

const accountStore = useAccountStore()
const commonStore = useCommonStore()
export default defineNuxtRouteMiddleware((to, from) => {
    if(accountStore.isLogged){
        console.log('isLogedin', !accountStore.isLogged)
        console.log('redirecting main page')
        return navigateTo(commonStore.lang === 'kr'?  '/kr/' : '/en/')
    }
})