import { createStore } from 'vuex'

export default createStore({
    state: {
        cards: [
            {
                id: 1,
                position: [500, 100],
                type: 'card',
                dragging: false,
                dropping: false,
                canDrag: true,
                canDrop: false,
                dragStartingPosition: [0, 0],
                oldPosition: [500, 100],
                connected: [2],
                dimensions: [180, 272],
                dotStart: 'bottom'
            },
            {
                id: 2,
                position: [500, 500],
                type: 'card',
                dragging: false,
                dropping: false,
                canDrag: true,
                canDrop: false,
                dragStartingPosition: [0, 0],
                oldPosition: [500, 500],
                connected: [3, 4],
                dimensions: [180, 272],
                dotStart: 'middle'
            },
            {
                id: 3,
                position: [200, 1000],
                type: 'card',
                dragging: false,
                dropping: false,
                canDrag: true,
                canDrop: false,
                dragStartingPosition: [0, 0],
                oldPosition: [200, 1000],
                connected: [],
                dimensions: [180, 272],
                dotStart: 'bottom'
            },
            {
                id: 4,
                position: [800, 1000],
                type: 'plus',
                dragging: false,
                dropping: false,
                canDrag: true,
                canDrop: false,
                dragStartingPosition: [0, 0],
                oldPosition: [800, 1000],
                connected: [],
                dimensions: [40, 40],
                dotStart: 'bottom'
            },
            {
                id: 5,
                position: [1200, 400],
                type: 'card',
                dragging: false,
                dropping: false,
                canDrag: true,
                canDrop: false,
                dragStartingPosition: [0, 0],
                oldPosition: [1200, 400],
                connected: [],
                dimensions: [180, 272],
                dotStart: 'bottom'
            },


            /*

            {
                id: 1714,
                position: [900, 200],
                type: 'plus',
                dragging: false,
                dropping: false,
                canDrag: false,
                canDrop: false,
                dragStartingPosition: [0, 0],
                oldPosition: [900, 200],
                connected: [1914],
                dimensions: [40, 40]
            },
            {
                id: 1914,
                position: [1000, 600],
                type: 'plus',
                dragging: false,
                dropping: false,
                canDrag: false,
                canDrop: false,
                dragStartingPosition: [0, 0],
                oldPosition: [1000, 600],
                dimensions: [40, 40]
            },
            {
                id: 1414,
                position: [100, 100],
                type: 'card',
                dragging: false,
                dropping: false,
                canDrag: true,
                canDrop: false,
                dragStartingPosition: [0, 0],
                oldPosition: [100, 100],
                connected: [4444],
                dimensions: [180, 272]
            },
            {
                id: 4444,
                position: [500, 600],
                type: 'card',
                dragging: false,
                dropping: false,
                canDrag: true,
                canDrop: false,
                dragStartingPosition: [0, 0],
                oldPosition: [500, 600],
                dimensions: [180, 272]
            },
            */
        ],
        lines: []
    },
    mutations: {

    },
    actions: {
        deleteCard ({ state }, payload) {
            state.cards = state.cards.filter(card => card.id != payload.id)
            console.log(payload)
            state.cards.forEach(card => {
                card.connected = card.connected.filter(connection => connection != payload.id)
            })
            
        }
    },
    modules: {
    }
})
