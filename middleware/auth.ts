import { useAccountStore} from "~/stores/AccountStore";
const accountStore = useAccountStore()
const commonStore = useCommonStore()
export default defineNuxtRouteMiddleware((to, from) => {
    if(!accountStore.isLogged){
        return navigateTo('/kr/account/login')
        // return navigateTo(commonStore.lang === 'kr'?  '/kr/account/login' : '/en/account/login')
    }

})
