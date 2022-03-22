<template>
    <div class="home">
        <DragArea></DragArea>
    </div>
</template>

<script>
// @ is an alias to /src
import DragArea from '@/components/DragArea.vue'

export default {
    name: 'Home',
    components: {
        DragArea
    }
}
</script>
