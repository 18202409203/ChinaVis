<template>
    <div>
        <calendar-page></calendar-page>
    </div>
</template>

<script>
import calendarPage from '../components/calendar/calendarPage.vue';
export default {
    components: {calendarPage},
    data(){
        return {
            pageName: '主分会场日程安排'
        }
    },
    mounted(){
        this.$store.commit("currentPageChange", this.pageName)
    }
}
</script>

<style>

</style>
