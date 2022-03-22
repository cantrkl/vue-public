<template>
    <div :id="id" class="draggable-card">
        <div @mousedown.stop={} @click.prevent="menuVisible = !menuVisible" class="menu" :class="menuVisible ? 'visible' : 'hidden'">
            <div  v-if="menuVisible" style="display: flex; align-items: center; justify-content: space-between; flex:1; padding: 0px 10px 0 0">
                <div style="display: flex;"> <img class="menu-button" style="width: 10px; height: 10px" :src="require('@/assets/icons/expand.svg')"> </div>
                <div style="display: flex;"> <img class="menu-button" style="width: 10px; height: 10px" :src="require('@/assets/icons/copy.svg')"> </div>
                <div @click="$store.dispatch('deleteCard', {'id': id})" style="display: flex;"> <img class="menu-button" style="width: 10px; height: 10px" :src="require('@/assets/icons/trash.svg')"> </div>
            </div>
            <img class="menu-collapse" :src="require('@/assets/icons/menu.svg')">
        </div>
        <div class="tagDiv">
            <span>Landing Page</span>
        </div>
        <img style="border-radius: 8px" width="160" height="160" v-if="cardData.image" :src="require('@/assets/img/' + cardData.image)"/>
        <span class="title"> {{cardData.title}} </span>
        <div class="card-info-row" style="margin-top: 10px;">
            <div style="display: flex; align-items: center">
                <img class="card-icon" style="height: 9.9px;" :src="require('@/assets/icons/revenue.svg')">
                <span class="card-info-text">Revenue, $</span>
            </div>
            <div class="card-info-r">
                <span class="card-info-text">1.9k</span>
                <span class="card-info-text">37%</span>
            </div>
        </div>
        <div class="card-info-row">
            <div style="display: flex; align-items: center">
                <img class="card-icon" style="height: 10.5px;" :src="require('@/assets/icons/click-through.svg')">
                <span class="card-info-text">Click-through</span>
            </div>
            <div class="card-info-r">
                <span class="card-info-text">10,9k</span>
                <span class="card-info-text">22%</span>
            </div>
        </div>
        <div class="card-info-row">
            <div style="display: flex; align-items: center">
                <img class="card-icon" style="height: 7px;" :src="require('@/assets/icons/visits.svg')">
                <span class="card-info-text">Page visits</span>
            </div>
            <div class="card-info-r">
                <span class="card-info-text">182,9k</span>
            </div>
        </div>
    </div>
</template>
<script setup="props">
    import { ref } from 'vue'
    import '@mdi/font/css/materialdesignicons.css'
    const props = defineProps({ id: Number})
    const menuVisible = ref(false);
    const cardData = ref({
        image: 'cardImage.png',
        tag: 'Upsell',
        title: 'Name of the step',
        revenue: {
            value: 1800,
            percentage: 37
        },
        clickThrough: {
            value: 1900,
            percentage: 22
        },
        pageVisits: 182900
    });
</script>
<style scoped>
    .draggable-card {
        position: absolute;
        background: white;
        width: 160px;
        height: 252px;
        border-radius: 8px;
        cursor: pointer;
        text-align: left;
        padding: 10px;
        display: flex;
        flex-direction: column;
        box-shadow: 0px 6.599999904632568px 6.518518447875977px 0px #00000003;
        box-shadow: 0px 31.200000762939453px 25.481481552124023px 0px #00000005;
        box-shadow: 0px 81px 80px 0px #00000008;
    }
    .title {
        font-size: 13px;
        font-weight: 700;
        color: #2A3A4E;
        margin-top: 10px;
    }
    .card-icon {
        color: #62758C;
        width: 10px; 
    }
    .card-info-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 5px;
    }
    .card-info-text {
        font-size: 10px;
        color: #62758C;
        font-weight: 500;
        margin-left: 6px
    }
    .card-info-r {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 64px    
    }
    .tagDiv {
        background: white;
        position: absolute;
        left: 15px;
        top: 15px;
        border-radius: 6px;
        padding: 3px 10px;
        display: flex;
    }
    .tagDiv span {
        font-size: 9px;
        line-height: 13.5px;
        font-weight: 600;
        color: #62758C;
    }
    .menu {
        position: absolute;
        background: white;
        border-radius: 100px;
        border: solid 1px #C0D0FF;
        height: 20px;
        top: -25px;
        right: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: .3s;
        padding: 0px 10px;
        overflow:hidden
    }
    .menu.hidden {
        width: 0px;
    }
    .menu.visible {
        width: 80px;
    }
    .menu-button { color: #5E81F4; transition: .3s; }
    .menu-button:hover{
        opacity: .6;
    }
    .menu-collapse{ transition: .3s; height: 10px; width:10px; color: #5E81F4; }
    .menu.visible .menu-collapse {
        transform: rotate(90deg)
    }
</style>