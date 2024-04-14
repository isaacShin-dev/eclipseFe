<script setup lang="ts">
import {definePageMeta} from "#imports";
import CodeBlock from "~/components/common/codeBlock.vue";
import {onMounted} from "vue";
import axios from "axios";

definePageMeta({
  middleware: 'auth',
})



const config = useRuntimeConfig();
const accountStore = useAccountStore();
const baseUrl = ref(config.public.API_BASE_URL);
const apiKey = ref('');
const shortenKey = ref(true);
const apiKeyIsAvailable = ref(false);
const sampleCodeTypes = ref(['CURL', 'Python']);
const typeSelected = ref('Choose a language');
const responseSelected = ref('EXAMPLES')
const isSample = ref(false);
const headerPopup = ref(false);
const responseStatues = ref(['🟢   200 - Success',
                            '🔴   401 - Unauthorized',
                            // '🔴   403 - Forbidden',
                            // '🔴   404 - Not Found',
                            // '🔴   500 - Internal Server Error'
                          ]);

const code = ref('');

const py_code = ref('');
const responses = ref({
  '200': `{
  "success": true,
  "status_code": 1,
  "status_message": "Success."
}`,
  '401': `{
  "status_code": 7,
  "status_message": "Invalid API key: You must be granted a valid key.",
  "success": false
}`,
  '403': ``,
  '404': ``,
  '500': ``
});



const generateAccessToken = () => {

  axios(
      {
        method: 'POST',
        url: `${config.public.API_BASE_URL}api/register/`,
        headers: {
          'Authorization': `Bearer ${accountStore.access}`
        },
        data: {
          'api_type': 1
        }
      }
  ).then((res) => {
    console.log('res: ', res.data);
    apiKey.value = res.data.api_key;
    code.value = `curl --request GET \\\n` +
        `     --url '${baseUrl.value}' \\\n` +
        `     --header 'Authorization: Bearer ${res.data.api_key}' \\\n` +
        `     --header 'accept: application/json'`
    py_code.value = `import requests\n` +
        `url = "${baseUrl.value}"\n` +
        `headers = {\n` +
        `"Authorization": "Bearer ${res.data.api_key}",\n` +
        `"accept": "application/json"\n` +
        `}\n` +
        `response = requests.request("GET", url, headers=headers)\n` +
        `print(response.text)`;
    apiKeyIsAvailable.value = true;
  }).catch((err) => {
    console.log('err; ', err);
  });
  }
const tryIt = () => {
  console.log('try it');
}
const copyLink = () => {
  navigator.clipboard.writeText(code.value);
}

const isTestRun = computed(() => {
  return isSample.value && responseSelected.value != 'EXAMPLES';

});

const apiKeyShortened = computed(() => {
  if(shortenKey.value){
    return apiKey.value.substring(0, 6) + '...';
  }
  return apiKey.value;
});

onBeforeMount(() => {

  const accessToken = accountStore.accessToken ? 'Bearer ' + accountStore.accessToken : 'Please generate your access token'
  axios({
    method: 'GET',
    headers: {
      'Authorization': accessToken
    },
    data: {
      'api_type': 1
    },
    url: `${config.public.API_BASE_URL}api/register/`
  }).then((res) => {
    console.log('res: ', res.data);
    apiKey.value = res.data.api_key;
    code.value = `curl --request GET \\\n` +
        `     --url '${baseUrl.value}' \\\n` +
        `     --header 'Authorization: Bearer ${res.data.api_key}' \\\n` +
        `     --header 'accept: application/json'`
    py_code.value = `import requests\n` +
        `url = "${baseUrl.value}"\n` +
        `headers = {\n` +
        `"Authorization": "Bearer ${res.data.api_key}",\n` +
        `"accept": "application/json"\n` +
        `}\n` +
        `response = requests.request("GET", url, headers=headers)\n` +
        `print(response.text)`;
    apiKeyIsAvailable.value = true;
  }).catch((err) => {
    console.log('err; ', err);
  });
});

// const beforeUnloadListener = (event) => {
//   event.preventDefault();
//   event.returnValue = ''; // 대부분의 브라우저에서는 이 값을 설정해야 확인 창이 나타납니다.
//   return ''; // 일부 브라우저에서는 이 값을 반환해야 합니다.
// };
//
// onMounted(() => {
//   // 페이지가 로드될 때 이벤트 리스너를 추가합니다.
//   window.addEventListener('beforeunload', beforeUnloadListener);
// });
//
// onUnmounted(() => {
//   // 컴포넌트가 제거될 때 이벤트 리스너를 제거합니다.
//   window.removeEventListener('beforeunload', beforeUnloadListener);
// });
//
// onBeforeRouteLeave((to, from) => {
//   return confirm('Are you sure you want to leave?');
// });
</script>

<template>
  <h4 class="font-weight-black mb-4">DEVELOPER DASHBOARD</h4>
  <v-divider class="75"/>
  <v-row justify-sm="space-evenly" class="mt-sm-10 mb-sm-10">
    <v-col cols="12" md="5">
      <div v-if="!apiKeyIsAvailable" class="d-flex align-center justify-center w-100 h-100">
        <v-btn size="small" color="#2D3250" prepend-icon="mdi-lightning-bolt-outline"
               variant="elevated" @click="generateAccessToken">
          Generate Access Token
        </v-btn>
      </div>
      <div v-else>
        <p class="text-body-2 mt-3 mb-5">
          <v-icon>mdi-api</v-icon>
          YOUR API KEYS</p>
        <v-table density="compact">
          <thead>
          <tr>
            <th class="text-start">API KEY</th>
            <th class="text-start">LAST USE</th>
            <th>API STATUS</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="text-start">
              {{apiKeyShortened}}
              <v-btn :icon="true" size="x-small" :ripple="false" @click="shortenKey = !shortenKey">
                <v-icon>{{shortenKey ? 'mdi-eye-lock-outline' : 'mdi-eye-outline'}}</v-icon>
              </v-btn>
            </td>
            <td class="text-start">
              <v-chip color="#5C8374" size="x-small" class="mr-2">2021-10-10</v-chip>
            </td>
            <td>
              <v-chip :color="apiKey ? '#5C8374' : '#c14141'" size="x-small" class="mr-2">
                {{ apiKey ? 'Active' : 'Inactive' }}
              </v-chip>
            </td>
          </tr>
          </tbody>

        </v-table>
      </div>
    </v-col>
    <v-divider :vertical="true" class="my-7"/>
    <v-col cols="12" md="6">
      <p class="text-body-2 mt-3 mb-5">HOW TO AUTHENTICATE</p>
      <v-sheet elevation="2" :rounded="true"
               :height="100">
        <v-row>
          <v-col cols="12"  class="mt-0 ml-2">
            <v-chip variant="outlined" :label="true" size="small" color="#7077A1">REQUEST HEADER</v-chip>
          </v-col>
          <v-col class="pt-0" cols="12">
           <v-text-field density="compact" style="width:98% !important;" class="mx-2"
                         hide-details="true" variant="solo" v-model="apiKey">
            <v-chip variant="outlined" color="#7077A1" class="mr-3" size="small">Access_token</v-chip>
           </v-text-field>
          </v-col>
        </v-row>
      </v-sheet>
      <v-sheet elevation="2" :rounded="true"  class="mt-5">
        <v-select :items="sampleCodeTypes" density="compact" :flat="true" variant="solo"
                  v-model="typeSelected" :hide-details="true" :chips="true" :menu-props="{noClickAnimation:true}">
        </v-select>
        <div style="width: 98%;" class="mx-auto" @click="isSample=true">
          <code-block v-if="typeSelected === 'CURL'" :code="code" lang="javascript"></code-block>
          <code-block v-else-if="typeSelected === 'Python'" :code="py_code" lang="python"></code-block>
        </div>
        <v-divider class=" mx-2 pb-2"/>
        <v-row justify="space-around" justify-xl="space-between" align="center">
          <v-col cols="7" sm="8" md="8" lg="9" xl="9" xxl="10">
            <v-btn :icon="true" variant="text" class="ml-3" @click="copyLink" size="small">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="mr-md-3">
            <v-btn color="#2D3250" class="mt-4" :height="25" :ripple="false"
                   @click="isSample=false; tryIt();" size="small">Try it</v-btn>
          </v-col>
        </v-row>
      </v-sheet>
      <v-sheet elevation="2" :rounded="true"  class="mt-7 pb-3">
        <v-row justify="space-around" justify-xl="space-between" align="start">
          <v-col cols="12">
            <p class="text-body-2 pt-2 pl-3">
              RESPONSE
              <v-chip v-if="isTestRun" size="x-small" color="#5C8374" variant="elevated" :ripple="false">SAMPLE</v-chip>
            </p>
          </v-col>
          <v-col cols="12">
            <v-select density="compact" :hide-details="true" :items="responseStatues"
                      :flat="true" variant="solo" :rounded="true" v-model="responseSelected"
                      :menu-props="{offset:13}" @click="isSample=true" :chips="true">
            </v-select>
          </v-col>
        </v-row>
          <v-divider class=" mx-2 pt-1"/>

        <div v-if="responseSelected === 'EXAMPLES'" class="text-center pt-10 px-6">
          Click
          <v-btn variant="elevated" elevation="2" size="x-small" color="#2D3250" @click="isSample=false; tryIt();">Try It</v-btn>
          to start a request and see the response here! Or choose an example :
          <p class="pt-5">
            <v-btn class="mx-2" size="x-small" variant="tonal"
                   @click="responseSelected='🟢   200 - Success'; isSample=true">
              🟢   200 - Success</v-btn>
            <v-btn class="mx-2" size="x-small" variant="tonal"
            @click="responseSelected='🔴   401 - Unauthorized'; isSample=true">
              🔴   401 - Unauthorized</v-btn>
          </p>
        </div>
        <div v-else-if="responseSelected === '🟢   200 - Success'"
             style="width: 98%;" class="mx-auto mt-2">
        <code-block :code="responses['200']" lang="json"/>
        </div>
        <div v-else-if="responseSelected === '🔴   401 - Unauthorized'"
             style="width: 98%;" class="mx-auto mt-2">
        <code-block :code="responses['401']" lang="json"/>
        </div>
        <v-row justify="space-around" justify-xl="space-between" align="center">
          <v-col cols="7" sm="8" md="8" lg="8" xl="9" xxl="10" class="mt-1">
            <v-btn :icon="true" variant="text" class="ml-3" @click="copyLink" size="small">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="mr-md-3">
            <v-btn color="#DDE6ED" class="mt-4 mr-2" :width="80" size="small" :ripple="false" variant="plain">
              HEADERS <v-icon class="ml-3" size="small">mdi-arrow-top-right-bottom-left</v-icon>
              <v-dialog
                  v-model="headerPopup"
                  activator="parent"
                  width="auto"
              >
                <v-card>
                  <v-card-text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" block @click="headerPopup = false">Close Dialog</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>
  </v-row>

</template>

<style scoped>
.v-field__field{
  font-size: 1rem !important;
}
#accessTokenField{
  font-size: 1px !important;
}
</style>