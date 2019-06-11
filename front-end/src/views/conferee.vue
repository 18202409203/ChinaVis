<template>
    <div>
        <conferee-page></conferee-page>
    </div>
</template>

<script>
import confereePage from '../components/conferee/confereePage.vue';

export default {
    components: {confereePage},
    data(){
        return {
            ip: this.$store.state.ip,
            allConfereesUrl: '/days/allConferees',
            pageName: '与会人员移动规律'
        }
    },
    methods:{
        getAllConferees(){
            this.$http.get(this.ip + this.allConfereesUrl).then(Response => {
                console.log(Response.data);
            })
        }
    },
    mounted(){
        this.$store.commit("currentPageChange", this.pageName);
        // this.getAllConferees();
    }
}
</script>

<style>

</style>
