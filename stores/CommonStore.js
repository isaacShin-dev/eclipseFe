import { defineStore } from 'pinia'
export const useCommonStore = defineStore('common', () => {
    const theme = ref('');
    const router = useRouter();
    const menus = [
        {
            id: 0,
            title: 'Home',
            type: 'link',
            to: '/',
            icon:'mdi-home-outline',
            current: false
        },
        {
            id: 1,
            title: 'Dashboard',
            type: 'link',
            to: '/class/classInfo',
            icon:'mdi-account-circle-outline',
            current: false
        },
        // {
        //     id: 1,
        //     title: 'Introduction',
        //     type: 'link',
        //     to: '/introduction',
        //     icon:'mdi-book-open-page-variant-outline',
        //     current: false
        // },
        {
            id: 2,
            title: 'Quick Questions',
            type: 'link',
            to: '/class/quickQuestion',
            icon:'mdi-airplane-takeoff',
            current: false
        },
        {
            id: 3,
            title: 'anonymous',
            type: 'link',
            to: '/class/anonymousBoard',
            icon:'mdi-account-key-outline',
            current: false
        },

        {
            id: 5,
            title: 'API LIST',
            type: 'subMenu',
        },
        {
            id: 6,
            title: 'movie',
            type: 'request',
            to: '/requests/lists',
            method: 'GET',
            color: 'primary',
            current: false
        },
        {
            id: 7,
            title: 'Details',
            type: 'request',
            to: '/requests/details',
            method: 'GET',
            color: 'primary',
            current: false
        },
        {
            id: 8,
            title: 'Rank',
            type: 'request',
            to: '/requests/rank',
            method: 'GET',
            color: 'primary',
            current: false
        },
        {
            id: 9,
            title: 'Add to Favorite',
            type: 'request',
            to: '/requests/favorite',
            method: 'POST',
            color: 'success',
            current: false
        },
        {
            id: 10,
            title: 'Remove from Favorite',
            type: 'request',
            method: 'DELETE',
            to: '/requests/favorite-removal',
            color: 'error',
            current: false
        },
        {
            id: 11,
            title: 'SEARCH',
            type:"subMenu"
        },
        {

        },
        {
            id: 15,
            title: 'CONTRIBUTION',
            type:'subMenu',
        }
    ]
    const lang = ref('');

    const get_current_theme = () => {
        const theme = localStorage.getItem('theme');
        if (theme) {
            return theme;
        }
        return 'light';
    };

    const toggleTheme = (theme) => {
        console.log('toggleTheme', theme);
        theme.value = theme;
        localStorage.setItem('theme', theme);
    };
    const route_to = (path) => {
        router.push(path);
    };

    return {
        theme,
        menus,
        lang,
        toggleTheme,
        route_to,
        get_current_theme,
    };
    },
    {
        persist: true
    }
);