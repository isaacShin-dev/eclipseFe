<script setup>
import PageHeading from "~/components/common/pageHeading.vue";
import PageContent from "~/components/common/PageContent.vue";
import CalloutBlock from "~/components/common/CalloutBlock.vue";
import PageSwitcher from "~/components/common/pageSwitcher.vue";

const commonStore = useCommonStore()
const { locale } = useI18n();

const titles = ref([
    "Conventions",
    "JSON conventions",
    "Code samples",
    "Pagination",
    "Supported endpoints",
    "Responses",
])
const calloutContent = ref('The API is currently a beta. So there will be some limitations. Although you still need to be a member in order to use The API.' +
    ' Also it may change without notice.' +
    'If you have any questions, please contact us via email.')
const route_to = (path) => {commonStore.route_to(path);};

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({behavior: 'smooth', inline: 'end'});
    }
};
const sampleCode = 'axios({\n' +
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
</script>
<template>
    <v-container>
        <page-heading :title="$t(`menu.Introduction`)" :subtitle="$t(`common.title`)"/>
      <v-img src="/img/index_img_01.png" height="300" :cover="true" class="imag-filter mt-2" rounded>
        <h2 class="text-h2 font-weight-black text-center mt-16 text-decoration-underline text-sm-h1">Welcome.</h2>
      </v-img>
      <section>
        <p class="mt-6 h4 text-decoration-underline" id="firstParagraph">{{ $t('page.introduction.section1.p1') }}</p>
        <p class="mt-6 text-body-1">{{ $t('page.introduction.section1.body1') }}</p>
      </section>
        <v-sheet
            width="100%"
            class="bg-blue-grey-lighten-4 left-border mt-9 callout-font pb-5">
            <v-row justify="space-around">
                <v-col class="flex-grow-0 pr-0">
                    <v-icon size="small" color="blue-grey-lighten-1">mdi-account-hard-hat-outline</v-icon>
                </v-col>
                <v-col cols="11" class="pl-0">
                    <p class="">{{ $t('page.introduction.callOut1') }}</p>
                </v-col>
            </v-row>
        </v-sheet>
      <section id="Conventions" class="pt-7">
        <h4 class="mt-5 text-h4" >Conventions</h4>
        <p class="mt-6 text-body-1">{{ $t('page.introduction.section2.sentence1') }} <span class="inline-code-block method-pad">https://kickin.kr/api/v1</span>. All endpoints are prefixed with this URL.
            HTTPS is required for all API requests. it's following the RESTful conventions at all times and using the appropriate HTTP methods for each action.
            <span class="inline-code-block method-pad">GET</span>, <span class="inline-code-block method-pad">POST</span>, <span class="inline-code-block method-pad">PUT</span> and <span class="inline-code-block method-pad">PATCH</span> are used in the API.
            request and response bodies are formatted in JSON. The API uses the <span>application/json</span> content type for all requests and responses.
        </p>
      </section>
      <section id="JSON conventions" class="pt-7">
        <h4 class="mt-6 text-h4" >JSON conventions</h4>
        <ul class="mt-6 ml-5 text-body-1">
            <li><span class="inline-code-block method-pad">Basic Identifiers</span>: Each sneaker is uniquely identified with an <span class="inline-code-block method-pad">id</span> and <span class="inline-code-block method-pad">uuid</span>, allowing for individual product distinction.</li>
            <li><span class="inline-code-block method-pad">Product Information</span>: Detailed information about the product is provided through fields such as <span class="inline-code-block method-pad">name</span>, <span class="inline-code-block method-pad">category</span> (e.g., 'shoes'), <span class="inline-code-block method-pad">product_type</span> (e.g., 'sneakers'), <span class="inline-code-block method-pad">colorway</span>, and <span class="inline-code-block method-pad">sku</span>.</li>
            <li><span class="inline-code-block method-pad">Release Information</span>: The <span class="inline-code-block method-pad">releaseDate</span> field indicates the release date of each product. This date is provided in the YYYY-MM-DD format.</li>
            <li><span class="inline-code-block method-pad">Pricing Information</span>: The <span class="inline-code-block method-pad">retailPrice</span> and <span class="inline-code-block method-pad">retailPriceKrw</span> fields represent the retail price in USD and KRW, respectively.</li>
            <li><span class="inline-code-block method-pad">Image Resources</span>: Fields like <span class="inline-code-block method-pad">imageUrl</span> and <span class="inline-code-block method-pad">local_imageUrl</span> provide images of each sneaker. This allows users to view the appearance of the product.</li>
        </ul>
        </section>
      <section id="Code samples" class="pt-7">
        <h4 class="mt-6 text-h4" id="Code samples">Code samples</h4>
        <p class="mt-6 text-body-1">Example requests and responses are provided for each endpoint. These examples facilitate effortless copying, pasting, and adjusting as you develop your application.</p>
        <v-sheet
            width="100%"
            class="bg-blue-grey-lighten-4 left-border mt-6">
            <v-row justify="space-around" class="mb-5" align="center">
                <v-col class="flex-grow-0 pr-0">
                    <v-icon size="small" color="blue-grey-lighten-1">mdi-xml</v-icon>
                </v-col>
                <v-col cols="11" class="pl-0">
                    <p class="">the Javascript SDK and Python package will be updated shortly</p>
                </v-col>
            </v-row>
        </v-sheet>
        <common-code-block :code="sampleCode" lang="javascript"/>
        <h4 class="mt-6 text-h4" id="Pagination">Pagination</h4>
        <common-code-block :code="sampleCode"/>
      </section>
    </v-container>
    <page-content :titles="titles" page-name="introduction"/>
  <page-switcher
      :left-path="{title: 'Home', to: '/'}"
      :right-path="{title: 'Getting started', to: '/getting-start'}"
  />
</template>
<style scoped>
.callout-font{
  font-family: SUIT-Regular, sans-serif !important;
  line-height: 29px;
}

.text-size-big{
    font-size: 9rem !important;
    filter:grayscale(80%);
}
.inline-code-block{
  padding: 0.25rem 0.42rem;
  background-color: rgba(187, 181, 181, 0.15);
  border-radius: 3px;
  font-size: 0.9rem;
  font-family: monospace;
  color: #e34a4a;

}

.left-border{
    border-left: 5px solid rgb(157, 178, 191);
}
</style>
