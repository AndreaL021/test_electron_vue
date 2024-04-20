import { createStore } from 'vuex'
import { ipcRenderer } from 'electron';
export default createStore({
  state: {
    prodotti: [],
  },
  getters: {
  },
  mutations: {
    SET_PRODOTTO(state, prodotto) {
      console.log(state.prodotti);
      if (prodotto.id == -1) {
        if (state.prodotti.length > 0) {
          prodotto.id = state.prodotti[state.prodotti.length - 1].id + 1;
        } else prodotto.id = 1
        state.prodotti.push(prodotto);
        console.log(state.prodotti);
      } else {
        state.prodotti = state.prodotti.filter((p) => p.id != prodotto.id);
        state.prodotti.push(prodotto);
        state.prodotti.sort((a, b) => a.id - b.id)
      }
      ipcRenderer.send("setProdotto", JSON.stringify(state.prodotti))
    },
    ELIMINA_PRODOTTO(state, prodotto) {
      state.prodotti = state.prodotti.filter((p) => p.id != prodotto.id);
      ipcRenderer.send("setProdotto", JSON.stringify(state.prodotti))
    },
  },
  actions: {
    setProdotto({ commit }, newVal) {
      commit('SET_PRODOTTO', newVal)
    },
    eliminaProdotto({ commit }, newVal) {
      commit('ELIMINA_PRODOTTO', newVal)
    },
    async getProdotti(context) {
      await ipcRenderer.invoke("getProdotti").then((data) => {
        console.log(data);
        context.state.prodotti = Array.from(JSON.parse(data));
      })
      return context.state.prodotti
    }
  },
  modules: {}
})

