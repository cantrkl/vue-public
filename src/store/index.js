import { createStore } from 'vuex'

export default createStore({
    state: {
        cards: [
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
                connected: [1914]
            },
            {
                id: 1914,
                position: [900, 600],
                type: 'plus',
                dragging: false,
                dropping: false,
                canDrag: false,
                canDrop: false,
                dragStartingPosition: [0, 0],
                oldPosition: [900, 200]
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
                oldPosition: [100, 100]
            },
            {
                id: 4444,
                position: [500, 100],
                type: 'card',
                dragging: false,
                dropping: false,
                canDrag: true,
                canDrop: false,
                dragStartingPosition: [0, 0],
                oldPosition: [500, 100]
            },
            
        ],
        lines: []
    },
    mutations: {

    },
    actions: {
        deleteCard ({ state }, payload) {
            state.cards = state.cards.filter(card => card.id != payload.id)
        }
    },
    modules: {
    }
})
