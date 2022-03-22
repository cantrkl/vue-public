<template>
    <div class="drag-area">
        <button @click.prevent="addRandomPlus()">Add</button>
        <div v-for="(line, i) in $store.state.lines" :key="i" class="line-container">
            <span>{{line}}</span>
            <div class="line" :style="'height: ' + Math.abs(line.from[1] - line.to[1]) + 'px; width:1px; left: ' + Math.min(line.from[0], line.to[0]) + 'px; top: ' + Math.min(line.from[1], line.to[1]) + 'px;'"></div>
        </div>


        <div class="chart-item" :id="'chart-item-' + item.id" draggable
            v-for="item in $store.state.cards" :key="item.id"
            @mousedown.prevent="item.canDrag ? startItemDrag($event, item) : {}"
            @mouseup.prevent="stopItemDrag(item);"
            :style="('left: ' + Number(item.position[0]) + 'px; top: ' + Number(item.position[1])+ 'px; ') + (item.dragging ? 'z-index: 2; opacity: .5' : '')"
        >
            <DraggableCard :id="item.id" v-if="item.type == 'card'" style="transition: .3s" :style="item.canDrop ? 'transform: scale(1.1)' : ''"></DraggableCard>
            <div v-else-if="item.type == 'plus'" class="plus-area">
                <div class="drop-area"
                    @click="addItem(item)"
                    @mouseover="draggingArea.dragging ? $store.state.cards.find(x => x.dragging).canDrop = true : {}"
                    @mouseout="draggingArea.dragging ? $store.state.cards.find(x => x.dragging).canDrop = false: {}"
                    @mouseup="draggingArea.dragging ? dropItem(item) : {}"
                ></div>
                <span>+</span>
            </div>
        </div>
        <div class="ghost-card" v-if="draggingArea.dragging" :style="'top: ' + draggingArea.ghostPosition[1] + 'px; left: ' + draggingArea.ghostPosition[0] + 'px'"></div>
        
    </div>
</template>
<script setup>
    import {useStore} from 'vuex'
    import { reactive, onMounted } from 'vue'
    import gsap from 'gsap'
    import DraggableCard from '@/components/DraggableCard.vue'
    const store=useStore();
    const draggingArea = reactive({ dragging: false, ghostPosition: [0,0] })
    
    onMounted(() => { window.addEventListener('mousemove', doDrag); })

    function startItemDrag (event, item) {
        item.dragStartingPosition = [event.layerX, event.layerY];
        draggingArea.ghostPosition = [event.pageX - item.dragStartingPosition[0], event.pageY - item.dragStartingPosition[1]]
        draggingArea.dragging = true;
        item.dragging = true;
    }

    function doDrag (event) {
        if(!draggingArea.dragging) return
        console.log(draggingArea.dragging)
        let item = store.state.cards.find(x => x.dragging)
        if(item) item.position = [event.pageX - item.dragStartingPosition[0], event.pageY - item.dragStartingPosition[1]];
    }

    function stopItemDrag(item) {
        item.dragging = false;
        draggingArea.dragging = false;
        if(item.canDrop) item.oldPosition = item.position;
        else gsap.to(item.position, .5, item.oldPosition);
    }

    function addItem(item) {
        item.type = 'card';
        item.canDrag = true;
        item.position = [item.position[0] - 70, item.position[1] - 100]
        item.oldPosition = item.position;
    }
    function dropItem(droppedStep){
        let item = store.state.cards.find(x => x.dragging)
        gsap.to(item.position, .5, [droppedStep.position[0] - 70, droppedStep.position[1] - 100]);
        this.stopItemDrag(item)
        item.canDrop = false;
        store.dispatch('deleteCard', {'id': droppedStep.id})
    }
    function addRandomPlus(){
        let _position = [Math.floor(Math.random() * (1300 - 100 + 1) + 100), Math.floor(Math.random() * (700 - 100 + 1) + 100)]
        store.state.cards.push({
            id: Math.floor(Math.random() * (9999 - 1000 + 1) + 1000),
            position: _position,
            type: 'plus',
            dragging: false,
            dropping: false,
            canDrag: false,
            canDrop: false,
            dragStartingPosition: [0, 0],
            oldPosition: [900, 200]
        })
    }
    function drawLines(){
        let _lines = []
        store.state.cards.filter(elem => elem.connected).forEach(elem => {
            elem.connected.forEach(connectedID => _lines.push({from: elem.position, to: (store.state.cards.find(connectedE => connectedE.id == connectedID).position)}));
        })
        console.log(_lines);
        store.state.lines = _lines;
    }
</script>
<style>
    .drag-area {
        width: 100%;
        min-height: 100vh;
        background: #F0F4FB;
        padding-bottom: 50px;
    }
    .chart-item {
        position: absolute;
    }
    .ghost-card{
        position: absolute;
        width: 158px;
        height: 250px;
        border-radius: 8px;
        padding: 10px;
        border: dashed 1px #9c9c9c;
    }
    .normal_box {
        padding: 10px;
        background: white;
    }
    .plus-area {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        background-color: white;
        cursor: pointer;
    }
    .drop-area{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2000;
    }

    .line-container{

    }
    .line {
        position: absolute;
        background-color: black;
    }
</style>