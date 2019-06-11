<template>
    <div>
        <abnormal-page></abnormal-page>
    </div>
</template>

<script>
import abnormalPage from '../components/abnormal/abbormalPage.vue';
export default {
    components: {abnormalPage},
    data(){
        return {
            pageName: '会议期间异常事件'
        }
    },
    mounted(){
        this.$store.commit("currentPageChange", this.pageName)
    }
}
</script>

<style>

</style>
