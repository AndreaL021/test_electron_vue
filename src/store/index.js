import { createStore } from 'vuex'
const { readFileSync, writeFileSync } = window.require('fs');
export default createStore({
  state: {
    prodotti: readFileSync('./src/store/db.json', 'utf-8')?JSON.parse(readFileSync('./src/store/db.json', 'utf-8')):[],
    from: 0,
    to: 10,
  },
  getters: {
    getProdotti: state => state.prodotti.slice().reverse(),
  },
  mutations: {
    SET_PRODOTTO(state, prodotto) {
      if (prodotto.id == -1) {
        if (state.prodotti.length > 0) {
          prodotto.id = state.prodotti[state.prodotti.length - 1].id + 1;
        } else prodotto.id = 1
        state.prodotti.push(prodotto);
      } else {
        state.prodotti = state.prodotti.filter((p) => p.id != prodotto.id);
        state.prodotti.push(prodotto);
        state.prodotti.sort((a, b) => a.id - b.id)
      }
      writeFileSync('./src/store/db.json', JSON.stringify(state.prodotti), 'utf-8')
    },
    ELIMINA_PRODOTTO(state, prodotto) {
      state.prodotti = state.prodotti.filter((p) => p.id != prodotto.id);
      writeFileSync('./src/store/db.json', JSON.stringify(state.prodotti), 'utf-8')
    }
  },
  actions: {
    setProdotto({ commit }, newVal) {
      commit('SET_PRODOTTO', newVal)
    },
    eliminaProdotto({ commit }, newVal) {
      commit('ELIMINA_PRODOTTO', newVal)
    }
  },
  modules: {}
})
