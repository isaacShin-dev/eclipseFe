import { defineStore } from 'pinia'
export const useAccountStore = defineStore('account', () => {

    const access = ref('');
    const refresh = ref('');
    const isLogged = computed(() => access.value !== '' && refresh.value !== '');

    const setSession = (data) => {
        access.value = data.access;
        refresh.value = data.refresh;
    }

    const clearSession = () => {
        confirm('로그아웃 하시겠습니까?');
        if (confirm) {
            access.value = '';
            refresh.value = '';
            navigateTo('/kr/account/login');
        }
    }

    return {
        access,
        refresh,
        isLogged,
        setSession,
        clearSession,
    };

},
    {
        persist: true
    }
);