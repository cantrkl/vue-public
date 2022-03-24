<template>
<div class="chart-container" id="chart-container">
    <div class="filler"></div>
    <div class="drag-area">
        <button @click.prevent="addRandomPlus()">Add</button>

        <div v-for="(line, i) in $store.state.lines" :key="i" class="line-container"
            :style="
            'height: ' + Math.abs(line.from[1] - line.to[1]) + 'px;' + 
            'width: ' + (Math.max(line.from[0], line.to[0]) - Math.min(line.from[0], line.to[0])) + 'px;' + 
            'left: ' + Math.min(line.from[0], line.to[0]) + 'px;' + 
            'top: ' + Math.min(line.from[1], line.to[1]) + 'px;'"
        >
            <svg :height="Math.abs(line.from[1] - line.to[1])" :width="(Math.max(line.from[0], line.to[0]) - Math.min(line.from[0], line.to[0])) + 4">
                <path
                    :d=" linePath(line) "
                    stroke-linecap="round"
                    stroke-dasharray="3,3"
                    :y1="line.to[1] > line.from[1] ? 0 : Math.abs(line.from[1] - line.to[1])" 
                    :y2="line.to[1] > line.from[1] ? Math.abs(line.from[1] - line.to[1]) : 0"
                    :x1="line.to[0] > line.from[0] ? 0 : (Math.max(line.from[0], line.to[0]) - Math.min(line.from[0], line.to[0]))" 
                    :x2="line.to[0] > line.from[0] ? (Math.max(line.from[0], line.to[0]) - Math.min(line.from[0], line.to[0])) : 0"
                    
                    style="stroke:#9c9c9c;stroke-width:2; fill: transparent" />
            </svg>
        </div>


        <div class="chart-item" :id="'chart-item-' + item.id" draggable
            v-for="item in $store.state.cards" :key="item.id"
            @mousedown.prevent="item.canDrag ? startItemDrag($event, item) : {}"
            @mouseup.prevent="stopItemDrag(item);"
            :style="('left: ' + Number(item.position[0]) + 'px; top: ' + Number(item.position[1])+ 'px; ') + (item.dragging ? 'z-index: 3; opacity: .5' : '')"
        >
            <DraggableCard :id="item.id" v-if="item.type == 'card'" style="transition: .3s; z-index: 2" :style="item.canDrop ? 'transform: scale(1.1)' : ''"></DraggableCard>
            <div v-else-if="item.type == 'plus'" class="plus-area" style=" z-index: 1">
                <div class="drop-area"
                    @mouseover="draggingArea.dragging ? $store.state.cards.find(x => x.dragging).canDrop = true : {}"
                    @mouseout="draggingArea.dragging ? $store.state.cards.find(x => x.dragging).canDrop = false: {}"
                    @mousedown.stop="addItem(item)"
                    @mouseup.stop="draggingArea.dragging ? dropItem(item) : {}"
                ></div>
                <span>+</span>
            </div>
        </div>
        <div class="ghost-card" v-if="draggingArea.dragging" :style="'top: ' + draggingArea.ghostPosition[1] + 'px; left: ' + draggingArea.ghostPosition[0] + 'px'"></div>
        
    </div>
</div>
</template>
<script setup>
    import {useStore} from 'vuex'
    import { reactive, onMounted } from 'vue'
    import gsap from 'gsap'
    import DraggableCard from '@/components/DraggableCard.vue'
    const store=useStore();
    const draggingArea = reactive({ dragging: false, ghostPosition: [0,0] })
    
    onMounted(() => { window.addEventListener('mousemove', doDrag); drawLines()})

    function startItemDrag (event, item) {
        console.log('HERE')
        item.dragStartingPosition = [event.layerX, event.layerY];
        draggingArea.ghostPosition = [(event.pageX + document.getElementById("chart-container").scrollLeft) - item.dragStartingPosition[0], (event.pageY + document.getElementById("chart-container").scrollTop) - item.dragStartingPosition[1]]
        draggingArea.dragging = true;
        item.dragging = true;
    }

    function doDrag (event) {
        if(!draggingArea.dragging) return
        //drawLines();
        let item = store.state.cards.find(x => x.dragging)
        if(item) item.position = [(event.pageX + document.getElementById("chart-container").scrollLeft) - item.dragStartingPosition[0], (event.pageY + document.getElementById("chart-container").scrollTop) - item.dragStartingPosition[1]];
    }

    function stopItemDrag(item) {
        item.dragging = false;
        
        if(item.canDrop) {
            item.oldPosition = item.position;
            draggingArea.dragging = false;
        }
        else {
            gsap.to(item.position, .5, item.oldPosition);
            setTimeout(() => {
                draggingArea.dragging = false;
            }, 500);
        }
        
        //drawLines();
    }

    function addItem(item) {
        draggingArea.dragging = false;
        item.type = 'card';
        item.canDrag = true;
        item.position = [item.position[0] - 70, item.position[1] - 100]
        item.dimensions = [180, 272]
        item.oldPosition = item.position;
        drawLines();
    }
    function dropItem(droppedStep){
        
        let item = store.state.cards.find(x => x.dragging)
        let _dropped = { ... droppedStep}
        let _item = { ... item }
        gsap.to(item.position, .5, [droppedStep.position[0] - 70, droppedStep.position[1] - 100]);
        stopItemDrag(item)
        item.canDrop = false;
        item.id = _dropped.id;
        droppedStep.id = _item.id;
        store.dispatch('deleteCard', {'id': _item.id});
        
        setTimeout(() => {
            drawLines();
        }, 500);
        
        
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
            oldPosition: _position
        })
    }
    function drawLines(){
        let _lines = []
        let lineOffset = 0;
        store.state.cards.filter(elem => elem.connected).forEach(elem => {
            
            elem.connected.forEach((connectedID , i) => {
                let toElem = (store.state.cards.find(connectedE => connectedE.id == connectedID));
                if(elem.dotStart == 'bottom') _lines.push({from: [ ... [elem.position[0] + elem.dimensions[0] / 2, (elem.position[1] + lineOffset + elem.dimensions[1])]], to: [ ... [toElem.position[0] + (toElem.dimensions[0] / 2), toElem.position[1] - lineOffset]]})
                else if(elem.dotStart == 'middle') {
                    if(i == 0) _lines.push({from: [ ... [elem.position[0] - lineOffset, (elem.position[1] + (elem.dimensions[1] / 1.5))]], to: [ ... [toElem.position[0] + (toElem.dimensions[0] / 2), toElem.position[1] - lineOffset]]})
                    else if(i == 1)  _lines.push({from: [ ... [elem.position[0] + elem.dimensions[0] + lineOffset, (elem.position[1] + (elem.dimensions[1] / 1.5))]], to: [ ... [toElem.position[0] + (toElem.dimensions[0] / 2), toElem.position[1] - lineOffset]]})
                }
            });
        })
        store.state.lines = _lines;
    }
    function linePath(line){
        
        if(line.from[0] == line.to[0]) {
            return 'M' + (line.to[0] > line.from[0] ? 0 : (Math.max(line.from[0], line.to[0]) - Math.min(line.from[0], line.to[0]))) + ' ' + (line.to[1] > line.from[1] ? 0 : Math.abs(line.from[1] - line.to[1])) + ' ' +
                   'L' + (line.to[0] > line.from[0] ? (Math.max(line.from[0], line.to[0]) - Math.min(line.from[0], line.to[0])) : 0) + ' ' + (line.to[1] > line.from[1] ? Math.abs(line.from[1] - line.to[1]) : 0)
        }else {
            let path =  'M' + (line.to[0] > line.from[0] ? 0 : (Math.max(line.from[0], line.to[0]) - Math.min(line.from[0], line.to[0]))) + ' ' + (line.to[1] > line.from[1] ? 0 : Math.abs(line.from[1] - line.to[1])) + ' ' +
                   'L' + (line.to[0] > line.from[0] ? ((Math.max(line.from[0], line.to[0]) - Math.min(line.from[0], line.to[0])) - 10) : 10) + ' ' + (line.to[1] > line.from[1] ? 0 : Math.abs(line.from[1] - line.to[1])) + ' ' +
                   'Q' + (line.to[0] > line.from[0] ? (Math.max(line.from[0], line.to[0]) - Math.min(line.from[0], line.to[0])) : 0) + ' 0 ' + (line.to[0] > line.from[0] ? (Math.max(line.from[0], line.to[0]) - Math.min(line.from[0], line.to[0])) : 0) + ' 10 ' +
                'L' + (line.to[0] > line.from[0] ? (Math.max(line.from[0], line.to[0]) - Math.min(line.from[0], line.to[0])) : 0) + ' ' + (line.to[1] > line.from[1] ? Math.abs(line.from[1] - line.to[1]) : 0)
            return path;
        }
        
    }
</script>
<style>
    .chart-container {
        width: 100%;
        min-height: 100vh;
        height: 100%;
        position: relative;
        overflow: auto;
        background: #F0F4FB;
    }
    .filler {
        background: #F0F4FB;
    }
    .drag-area {
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
        background: #F0F4FB;
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
        position: absolute;
        background-color: transparent;
    }
    .line {
        position: absolute;
        background-color: black;
    }
</style>