<script setup lang="ts">
import axios from "axios";
import {tr} from "vuetify/locale";
import {onMounted} from "vue";
const config = useRuntimeConfig();
const commonStore = useCommonStore();
const accountStore = useAccountStore();

const member_name = ref('');
const password = ref('');
const creatingUser = ref(false);
const is_teacher = ref(false);
const student_id = ref('');
const region = ref('');  // 지역
const regionList = ref(['서울', '부울경', '대전'])
const classNums = ref({
  '서울': ['1반', '2반', '3반'],
  '구미': [],
  '부울경': ['1반'],
  '대전': ['2반'],
})
const classNum = ref('');  // 반

const passwordValidation = ref(false);
const pwdValidMsg = ref('Password must be at least 8 characters (letters, numbers)');
const nameValidation = ref(false);
const nameValidMsg = ref('Please enter your name');

const parseClassPk = () => {
  if(region.value == '서울'){
    if (classNum.value == '1반') return '1';
    if (classNum.value == '2반') return '2';
    if (classNum.value == '3반') return '3';
}else if(region.value == '대전'){
    if (classNum.value == '2반') return '4';
  }else if(region.value == '부울경'){
    if (classNum.value == '1반') return '5';
  }
  return '0';
}
const register = () => {
  if(member_name.value.length == 0){
    nameValidation.value = true;
    return;
  }
  if(password.value.length == 0 || password.value.length < 8){
    console.log('password.value.length: ', password.value.length)
    passwordValidation.value = true;
    return;
  }

  creatingUser.value = true;

  const formData = new FormData();
  formData.append("email", localStorage.getItem('email') as string);
  formData.append("password1", password.value);
  formData.append("password2", password.value);
  formData.append("member_name", member_name.value);
  formData.append("is_teacher", is_teacher.value ? 'True' : 'False');
  if(!is_teacher.value){
    formData.append("student_id", student_id.value);
  }else{ // teacher
    formData.append("classroom", parseClassPk());
    formData.append('is_active', 'True')
  }

  axios({
    method: 'POST',
    data: formData,
    url: `${config.public.API_BASE_URL}members/rest-auth/registration/`
  }).then((res:any) => {
    console.log(res.data); // 201 created
    creatingUser.value = false;
    commonStore.route_to('/kr/account/login');
  }).catch((err:any) => {
    console.log('register err; ', err);
    console.log('err.response.data; ', err.response.data);
    // passwordValidation.value = true;
    creatingUser.value = false;
  });
}

const pwdValid = computed(() => {
  if(password.value.length == 0){
    return true;
  }
  return password.value.length >= 8;
})


watch(() => is_teacher.value, (newVal) => {
  if(newVal){
    member_name.value = '';
    password.value = '';
    student_id.value = '';
    region.value = '';
    classNum.value = '';
  }
})
</script>

<template>
<!--  <v-img src="/img/index_img_01.png" :height="150" :cover="true" class="banner-img"/>-->
  <div class="inner-wrapper mt-16">
    <v-img src="/img/logo.png" class="app-logo-img"></v-img>
    <p class="flex-item text-h4 font-weight-bold mb-0">Welcome</p>
    <p class="text-subtitle-2 font-weight-light">기본정보를 입력해주세요.</p>
    <p class="text-subtitle-2 font-weight-bold  mt-4">
      <v-checkbox label="강사입니다." v-model="is_teacher"></v-checkbox>
    </p>
      <span v-show="is_teacher" class="text-subtitle-2 text-green-darken-3 mx-auto">강사의 경우 관리자 승인 후 이용 가능합니다.</span>
    <div class="input-flex" v-if="!is_teacher">
      <p class="text-subtitle-2 font-weight-bold text-disabled">이름</p>
      <p>
        <v-text-field density="compact" placeholder="이름을 입력해주세요." hide-details="true" v-model="member_name"
                      :clearable="true" clear-icon="mdi-close-circle-outline" variant="solo" class="mt-1" style="width: 20rem"/>
      </p>
      <p class="text-subtitle-2 font-weight-bold text-disabled mt-4">학번</p>
      <p>
        <v-text-field density="compact" placeholder="학번을 입력해주세요" hide-details="true" v-model="student_id"
                      :clearable="true" clear-icon="mdi-close-circle-outline" variant="solo" class="mt-1" style="width: 20rem"/>
      </p>
      <span v-show="nameValidation" class="text-subtitle-2 text-red-darken-3">{{ nameValidMsg }}</span>
      <p class="text-subtitle-2 font-weight-bold text-disabled mt-4">비밀번호</p>
      <p>
        <v-text-field density="compact" placeholder="사용할 비밀번호를 입력해주세요." hide-details="true" @input="passwordValidation=false"
                      v-model="password" type="password" :clearable="true" clear-icon="mdi-close-circle-outline"
                      variant="solo" class="mt-1" style="width: 20rem"/>
      </p>
      <span v-show="passwordValidation" class="text-subtitle-2 text-red-darken-3">{{ pwdValidMsg }}</span>
<!--      <span v-show="!passwordValidation" class="text-subtitle-2" >must be at least 8 letters with a special character</span>-->
    </div>
    <div class="input-flex" v-else>
      <p class="text-subtitle-2 font-weight-bold text-disabled">이름</p>
      <p>
        <v-text-field density="compact" placeholder="이름을 입력해주세요." hide-details="true" v-model="member_name"
                      :clearable="true" clear-icon="mdi-close-circle-outline" variant="solo" class="mt-1" style="width: 20rem"/>
      </p>
      <p class="text-subtitle-2 font-weight-bold text-disabled mt-4">지역</p>
      <p>
        <v-select density="compact" flat dense :items="regionList" v-model="region" :menu-props="{height: 200}"
                  class="mt-1 mb-0" style="width: 20rem" bg-color="#ECEFF1" hide-no-data/>
      </p>
      <p class="text-subtitle-2 font-weight-bold text-disabled mt-0">반</p>
      <p>
        <v-select density="compact" flat dense :items="classNums[region]" v-model="classNum" class="mt-1"
                  style="width: 20rem" bg-color="#ECEFF1" hide-details="True" hide-no-data/>
      </p>
<!--      <span v-show="nameValidation" class="text-subtitle-2 text-red-darken-3">{{ nameValidMsg }}</span>-->
      <p class="text-subtitle-2 font-weight-bold text-disabled mt-4">비밀번호</p>
      <p>
        <v-text-field density="compact" placeholder="사용할 비밀번호를 입력해주세요." hide-details="true" @input="passwordValidation=false"
                      v-model="password" type="password" :clearable="true" clear-icon="mdi-close-circle-outline"
                      variant="solo" class="mt-1" style="width: 20rem"/>
      </p>
      <span v-show="passwordValidation" class="text-subtitle-2 text-red-darken-3">{{ pwdValidMsg }}</span>
    </div>
    <v-btn class="mt-12 mb-7" color="#40557C" :loading="creatingUser" :width="210" @click="register">
      <span class="px-5"><span class="py-auto text-subtitle-2">Create new account</span></span></v-btn>

    <div class="grey--text text--darken-2 w-75 text-center mt-6 text-caption">
      if you click the button, it will be considered that you understand and agree to the
      <v-btn variant="plain" href="#" :ripple="false" size="x-small" class="text-subtitle-2 px-0">Terms of Service</v-btn> and
      <v-btn href="#" variant="plain" :ripple="false" size="x-small" class="text-subtitle-2 px-0">Privacy Policy</v-btn> of
      <span class="font-weight-bold">Eclipse</span>
    </div>
  </div>

</template>

<style scoped>
  .inner-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 99;
  }
  .input-flex{
    display: flex;
    flex-direction: column;
    justify-content: center !important;
    align-items: flex-start !important;
    margin-top: 2.4rem;
  }
.banner-img{
  width: 100%;
  position: relative;
  top: -10px;
}
  .app-logo-img{
    width: 60px;
    height: 60px;
  }

</style>