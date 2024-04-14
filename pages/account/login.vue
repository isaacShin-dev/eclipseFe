<script setup lang="ts">
import axios from "axios";
import {useAccountStore} from "~/stores/AccountStore";
import {definePageMeta} from "#imports";

definePageMeta({
  middleware: 'common',
})
const commonStore = useCommonStore()
const accountStore = useAccountStore()
const config = useRuntimeConfig();
// const { locale } = useI18n();

const email = ref('');
const password = ref('');
const emailLoading = ref(false);
const emailButton = ref('Continue with E-mail');
const emailValid = ref(true);
const emailSent = ref(false);
const emailResend = ref(false);
const resendCount = ref(120);
const wrongPwd = ref(false);

const registerKey = ref('');
const userInputKey = ref('');
const userInputChecked = ref(true);
const creatingUser = ref(false);
const duplicateEmail = ref(false);
const isActive = ref(false);

// pwd forget
const pwdEmail = ref('');
const pwdEmailValid = ref(true);
const pwdEmailLoading = ref(false);
const pwdEmailNotFount = ref(false);
const pwdEmailSent = ref(false);
const pwdFinderKey = ref('');
const pwdUserInputKey = ref('');
const oldPwd = ref('');
const newPwd1 = ref('');
const newPwd2 = ref('');

  function emailValidChk(email:any) {
    const pattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return pattern.test(email);
  }

const loginWithEmail = () => {
    emailLoading.value = true;
    if(email.value === '' || !emailValidChk(email.value)){
      emailLoading.value = false;
      emailValid.value = false;
    return;
  }

  axios({
    method: 'GET',
    url: `${config.public.API_BASE_URL}members/emailcheck/?email=${email.value}`
  }).then((res)=> {
    if(res.data.status_code === '400'){
      duplicateEmail.value = true;
      emailLoading.value = false;
      return;
    }
    else if(res.status === 200){  // 생성 가능한 이메일 주소
      const formData = new FormData();
      formData.append("email", email.value);

      axios({
        method: 'POST',
        data: formData,
        url: `${config.public.API_BASE_URL}members/send-confirmation/`
      }).then((res:any) => {
        console.log(res.data);
        emailLoading.value = false;
        emailButton.value = 'Create new account';
        emailSent.value = true;
        registerKey.value = res.data.key;
        localStorage.setItem('email', email.value);
      }).catch((err:any) => {
        console.log('err; ', err);
        emailLoading.value = false;
      });
    }
  }).catch((err) => {
    console.log('err; ', err);
  });
}



const login = () =>{
    const formData = new FormData();
    formData.append("email", email.value);
    formData.append("password", password.value);

    axios({
        method: 'POST',
        data: formData,
        url: `${config.public.API_BASE_URL}members/api/token/`
    }).then((res:any) => {
        accountStore.setSession(res.data);
        emailLoading.value = false;
      commonStore.route_to('/kr/class/classInfo');
    }).catch((err:any) => {
        console.log('err; ', err);
        wrongPwd.value = true;
        emailLoading.value = false;
    });
}

const checkCode = (code:String) => {
  if(userInputKey.value === ''){
    userInputChecked.value = false;
    return;
  }else if(userInputKey.value === registerKey.value){
    commonStore.route_to('/kr/account/register');
  }
  else{
    userInputChecked.value = false;
    return;
  }
}

const pwdFinder = () => {
  pwdEmailLoading.value = true;
  emailResend.value=true;
  if(pwdEmail.value === '' || !emailValidChk(pwdEmail.value)){
    pwdEmailLoading.value = false;
    pwdEmailValid.value = false;
    emailResend.value = false;
    return;
  }

  axios({
    method: 'GET',
    url: `${config.public.API_BASE_URL}user/emailcheck/?email=${pwdEmail.value}`
  }).then((res)=> {
    console.log('res: ', res);
    if(res.status === 226){
      const formData = new FormData();
      formData.append("email", pwdEmail.value);

      axios({
        method: 'POST',
        url: `${config.public.API_BASE_URL}user/custom-password-reset/`,
        data: formData
      }).then((res:any) => {
        pwdEmailLoading.value = false;
        pwdEmailSent.value = true;
        pwdFinderKey.value = res.data.key;
      }).catch((err:any) => {
        console.log('err; ', err);
        pwdEmailLoading.value = false;
      });
      return;
    }
    else if(res.status === 200){
      pwdEmailLoading.value = false;
      pwdEmailNotFount.value = true;
      emailResend.value = false;
      return;
    }
  }).catch((err) => {
    console.log('err; ', err);
  });
}

const pwdCodeCheck = computed(() => {
  return pwdFinderKey.value !== '' && pwdUserInputKey.value === pwdFinderKey.value;

});
const pwd1And2 = computed(() => {
  return newPwd1.value === newPwd2.value;
});
const pwdPatternValid = computed(() => {
  if(newPwd1.value !== '' || newPwd2.value !== ''){
  const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+|~=\-{}\[\]:\";'<>?,.\/]).{8,16}$/; // 8~16자 영문, 숫자, 특수문자 조합
  return pattern.test(newPwd1.value);
  }
  return true;
});

const pwdResetReq = () => {
  const formData = new FormData();


}

const pwdFinderCancel = () => {
  pwdEmailSent.value = false;
  pwdEmail.value = '';
  pwdEmailValid.value = true;
  pwdFinderKey.value = '';
  pwdUserInputKey.value = '';
  newPwd1.value = '';
  newPwd2.value = '';
  emailResend.value = false;
}
const pwdResetBtnActive = computed(() => {
  return newPwd1.value !== '' && newPwd2.value !== '' &&pwd1And2.value && pwdPatternValid.value;
});

watch(() => emailResend.value, (val) => {
  if(val){
    const interval = setInterval(() => {
      resendCount.value -= 1;
      if(resendCount.value === 0){
        clearInterval(interval);
        emailResend.value = false;
        resendCount.value = 120;
      }
    }, 1000);
  }
});



</script>

<template>
<div class="inner-wrapper mt-16">
<v-img src="/img/logo.png" class="app-logo-img flex-item"></v-img>
<p class="flex-item text-h4 font-weight-bold mb-4">{{ $t('page.login.title')}}</p>
<v-divider style="width: 20rem" class="my-6"></v-divider>
<v-row style="width: 320px">
  <v-col cols="12" class="text-subtitle-2 pl-1 pb-0">{{ $t('page.login.email') }}</v-col>
  <v-text-field density="compact" :placeholder="$t('page.login.placeholder')" hide-details="true" v-model="email" class="mt-1"
                :clearable="true" clear-icon="mdi-close-circle-outline" @input="emailValid=true" variant="solo" type="email"
                @keyup.enter="loginWithEmail" :autofocus="true" :disabled="emailSent"
  />
  <v-col cols="12" v-show="duplicateEmail" class="text-subtitle-2 text-green-darken-3 text-center py-0">{{ $t('page.login.already') }}</v-col>
  <v-col cols="12" v-if="emailSent">
    <v-alert type="success" dense dismissible variant="outlined" class="mb-0">
      <span class="text-subtitle-2">{{ $t('page.login.emailSent1') }}
        <span class="font-weight-bold">{{ email }}</span>. <br/>
        {{ $t('page.login.emailSent2') }} </span>
      <v-row justify="center" align-content="center" class="mt-1">
        <v-spacer></v-spacer>
        <v-col cols="8">
          <v-btn size="x-small" color="#1B5E20" :width="100" :disabled="emailResend" @click="emailResend=true;">{{ $t('page.login.resend')}}</v-btn>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <p class="text-red-darken-3 mt-1 text-subtitle-2 text-disabled" v-if="emailResend">{{ $t('page.login.resendMsg') }}
        <span class="font-weight-bold text-high-emphasis">{{ resendCount }}</span>
      </p>
    </v-alert>
  </v-col>
  <v-col cols="12" v-if="emailSent" class="text-subtitle-2 pl-1 py-0">{{ $t('page.login.confirmationCode')}}</v-col>
  <v-text-field v-if="emailSent" density="compact" :placeholder="$t('page.login.confirmationCodePlaceholder')" hide-details="true" v-model="userInputKey"
                :clearable="true" clear-icon="mdi-close-circle-outline" variant="solo" class="mt-1" @input="userInputChecked=true"/>
  <v-col v-if="!emailSent" cols="12" class="pb-0">
    <v-btn class="mt-1 btn-flex mb-2" color="#40557C" v-if="!duplicateEmail" :loading="emailLoading" @click="loginWithEmail">
    <span class="px-5"><span class="py-auto text-subtitle-2">{{ $t('page.login.loginButton')}}</span></span>
    </v-btn>
  </v-col>
  <v-col cols="12" v-if="duplicateEmail" class="text-subtitle-2 pl-1 py-0">{{ $t('page.login.pwd')}}</v-col>
  <v-text-field v-show="duplicateEmail" density="compact" :placeholder="$t('page.login.pwdPlaceholder')" hide-details="true" v-model="password"
                type="password" @keyup.enter="login" id="pwd" :autofocus="duplicateEmail" @input="wrongPwd=false" @focus="wrongPwd=false"
                :clearable="true" clear-icon="mdi-close-circle-outline" variant="solo" class="mt-1"/>
  <v-col v-if="wrongPwd" cols="12" class="text-center pt-1 text-subtitle-2 text-red-darken-3">{{ $t('page.login.wrongPwd')}}</v-col>
  <v-col v-if="duplicateEmail">
    <v-btn class="mt-1 btn-flex mb-2" color="#40557C" :loading="emailLoading" @click="login">
      <span class="px-5"><span class="py-auto text-subtitle-2">{{ $t('page.login.loginButton')}}</span></span>
    </v-btn>
  </v-col>
  <v-col v-if="emailSent" cols="12" class="pb-0">
    <v-btn class="mt-1 btn-flex mb-2" color="#40557C" :loading="creatingUser" @click="checkCode">
      <span class="px-5"><span class="py-auto text-subtitle-2">{{ $t('page.login.newAccount')}}</span></span>
    </v-btn>
  </v-col>
  <v-col cols="12" v-if="!emailValid" class="text-center pt-0 text-subtitle-2 text-red-darken-3">
    Please enter a valid email address.
  </v-col>
  <v-col cols="12" v-if="!userInputChecked" class="text-center pt-0 text-subtitle-2 text-red-darken-3">
    Please enter a valid code.
  </v-col>

  <v-col cols="12" class="text-center pt-0">
    <v-dialog width="500">
      <template v-slot:activator="{ props }">
        <v-btn variant="plain" v-bind="props" @click="isActive = true" :ripple="false"
           class="text-subtitle-2 grey--text text--darken-2">{{ $t('page.login.pwdFind') }}</v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card v-if="!pwdCodeCheck" elevation="14" density="compact">
          <v-card-title class="text-body-2">{{ $t('page.login.pwdFind')}}</v-card-title>
          <v-card-text>
            <v-text-field density="compact" :placeholder="$t('page.login.placeholder')" hide-details="true"
                          class="mt-1" v-model="pwdEmail" :clearable="true" clear-icon="mdi-close-circle-outline"
                          @input="pwdEmailValid=true; pwdEmailNotFount=false" variant="solo" type="email" :disabled="pwdEmailSent"
            />
            <p v-if="pwdEmailNotFount" class="text-center pt-1 text-subtitle-2 text-red-darken-3">Email dose not exist.</p>
          </v-card-text>
          <div v-if="pwdEmailSent" class="text-center pt-0 text-subtitle-2 text-blue-lighten-4 mb-2">
            <span class="">{{ $t('page.login.pwdFind')}}</span> {{ $t('page.login.emailSent1')}} {{pwdEmail}}
            <p>{{ $t('page.login.emailSent2') }}</p>
            <v-card-text>

            <v-text-field density="compact" :placeholder="$t('page.login.confirmationCodePlaceholder')"
                          hide-details="true" v-model="pwdUserInputKey" :clearable="true" clear-icon="mdi-close-circle-outline"
                          variant="solo" class="mt-1"
            />
            </v-card-text>
          </div>
            <p v-if="!pwdEmailValid" class="text-center pt-0 text-subtitle-2 text-red-darken-3">
              Please enter a valid email address.
            </p>
          <div class="text-center my-3">
            <v-btn color="#DB5D5C" size="small" class="mx-1" @click="isActive.value = false" variant="elevated">{{ $t('common.cancel')}}</v-btn>
            <v-btn color="#40557C" size="small" class="mx-1" variant="elevated" @click="pwdFinder" :disabled="emailResend" :loading="pwdEmailLoading">{{ $t('page.login.pwdCodeBtn')}}</v-btn>
            <p class="text-red-darken-3 mt-1 text-subtitle-2 text-disabled" v-if="emailResend">{{ $t('page.login.resendMsg') }}
              <span class="font-weight-bold text-high-emphasis">{{ resendCount }}</span>
            </p>
          </div>
        </v-card>
      </template>
    </v-dialog>
  </v-col>
</v-row>
  <div class="grey--text text--darken-2 w-75 text-center mt-6 text-caption">
    {{ $t('page.login.policy.text') }}
    <v-btn variant="plain" href="#" :ripple="false" size="x-small" class="text-subtitle-2 px-0">
      {{ $t('page.login.policy.termOfService') }}
    </v-btn>
    {{ $t('page.login.policy.and')}}
    <v-btn href="#" variant="plain" :ripple="false" size="x-small" class="text-subtitle-2 px-0">
      {{ $t('page.login.policy.privacyPolicy') }}
    </v-btn>
    {{ $t('page.login.policy.of')}}
    <span class="">{{ $t('page.login.policy.text2') }}</span>
  </div>
</div>
</template>

<style scoped>
.inner-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.btn-flex{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 20rem;
  height: 2.2rem;
  margin: 0.8rem 0;
  cursor: pointer;
  border:1px solid rgba(15, 15, 15, 0.15);
  box-shadow: rgba(15, 15, 15, 0.05) 0px 1px 2px;
  border-radius: 4px;
}

.app-logo-img{
  width: 60px;
  height: 60px;
}


</style>