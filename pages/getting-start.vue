<script setup>
import PageHeading from "~/components/common/pageHeading.vue";
import CodeBlock from "~/components/common/codeBlock.vue";
import {onMounted} from "vue";
import PageSwitcher from "~/components/common/pageSwitcher.vue";

const runtimeConfig = useRuntimeConfig();
const commonStore = useCommonStore();
const config = useRuntimeConfig();
const code = 'axios({\n' +
    '        method: "GET",\n' +
    '        url: "www.kickin.kr/" + "kicks/sneaker/list/",\n' +
    '      })\n' +
    '        .then((res) => {\n' +
    '          console.log(res.data);\n' +
    '            });\n' +
    '          }\n' +
    '        }) \n' +
    '       .catch((err) => {\n' +
    '          console.log("err; ", err);\n' +
    '        });\n' +
    '    },\n' +
    '  },\n'
const desserts = ref([
    {
        name: 'Frozen Yogurt',
        calories: 159,
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
    },
    {
        name: 'Eclair',
        calories: 262,
    },
    {
        name: 'Cupcake',
        calories: 305,
    },
    {
        name: 'Gingerbread',
        calories: 356,
    },
    {
        name: 'Jelly bean',
        calories: 375,
    },
    {
        name: 'Lollipop',
        calories: 392,
    },
    {
        name: 'Honeycomb',
        calories: 408,
    },
    {
        name: 'Donut',
        calories: 452,
    },
    {
        name: 'KitKat',
        calories: 518,
    },
],)

onMounted(() => {
    console.log('mounted')
  console.log(runtimeConfig.public.API_BASE_URL)
})
const route_to = (path) => {commonStore.route_to(path);};
</script>

<template>
<v-container>
<page-heading title="How to Kickin" subtitle="API DOCS"/>
    <v-row>
        <v-col cols="12" md="6">
            <span class="text-h5">code</span>
            <code-block :code="code"/>
        </v-col>
        <v-col cols="12" md="6">
            <v-table theme="dark">
                <thead>
                <tr>
                    <th class="text-left">
                        Name
                    </th>
                    <th class="text-left">
                        Calories
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in desserts"
                    :key="item.name"
                >
                    <td>{{ item.name }}</td>
                    <td>{{ item.calories }}</td>
                </tr>
                </tbody>
            </v-table>
        </v-col>
    </v-row>
</v-container>
</template>

<style scoped>

</style>