<template>
    <div>
        <layout-page></layout-page>
    </div>
</template>

<script>
import layoutPage from '../components/layout/layoutPage.vue';
export default {
    components: {layoutPage},
    data(){
        return {
            pageName: '单个地点分析'
        }
    },
    mounted(){
        this.$store.commit("currentPageChange", this.pageName)
    }
}
</script>

<style>

</style>