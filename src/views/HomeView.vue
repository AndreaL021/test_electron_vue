<template>
  <div style="padding-top: 10px">
    <div class="flex justify-center align-center" style="height: 20px">
      <p style="font-weight: bold">Aggiungi Prodotto</p>
    </div>
    <div class="flex justify-center align-center">
      <v-input
        v-model="new_prodotto.nome"
        label="Nome"
        :required="true"
      ></v-input>
      <v-input v-model="new_prodotto.desc" label="Descrizione"></v-input>
      <img
        @click="handleImageUpload(new_prodotto)"
        v-if="new_prodotto.img"
        style="
          cursor: pointer;
          width: 50px;
          margin-right: 10px;
          margin-left: 10px;
        "
        :src="new_prodotto.img"
        alt="Nessun immagine trovata"
      />
      <fa-i
        v-else
        style="
          cursor: pointer;
          color: green;
          margin-right: 10px;
          margin-left: 10px;
        "
        class="fa-xl"
        icon="image"
        @click="handleImageUpload(new_prodotto)"
      ></fa-i>
      <button style="margin-left: 5px; cursor: pointer" @click="salva">
        <fa-i class="fa-xl" icon="floppy-disk"></fa-i>
      </button>
    </div>
    <div class="flex justify-center align-center" style="height: 20px">
      <v-input
        v-model="filtro_nome"
        @change="filtra"
        label="Filtra nome"
      ></v-input>
      <fa-i icon="magnifying-glass"></fa-i>
    </div>
    <div
      class="flex justify-center align-center row"
      style="outline: 1px black"
    >
      <div
        v-for="(h, i) in headers"
        :key="i"
        style="width: 25%"
        class="flex justify-center align-center"
      >
        {{ h }}
      </div>
    </div>
    <div
      class="justify-center align-center flex"
      v-for="p in prodotti"
      :key="p.id"
    >
      <div style="width: 25%" class="flex justify-center align-center">
        <fa-i
          style="color: orange; cursor: pointer"
          class="fa-xl"
          icon="pen-to-square"
          @click="modifica(p)"
        ></fa-i>
      </div>
      <div style="width: 25%" class="flex justify-center align-center">
        {{ p.id }}
      </div>
      <div style="width: 25%" class="flex justify-center align-center">
        {{ p.nome }}
      </div>
      <div style="width: 25%" class="flex justify-center align-center">
        {{ p.desc }}
      </div>
      <div style="width: 25%" class="flex justify-center align-center">
        <a :href="p.img" target="_blank">
          <fa-i
            class="fa-xl flex justify-center align-center"
            v-if="p.img"
            style="cursor: pointer; color: green"
            icon="image"
          ></fa-i
        ></a>
      </div>
      <div style="width: 25%" class="flex justify-center align-center">
        <fa-i
          @click="elimina(p)"
          style="color: red; cursor: pointer"
          class="fa-xl"
          icon="trash"
        ></fa-i>
      </div>
    </div>
    <div class="dialog" v-show="dialog_edit" style="padding: 0px">
      <div style="width: 400px; text-align: center" class="card">
        <div
          style="
            box-sizing: border-box;
            height: 40px;
            background-color: blue;
            margin: 0px;
            width: 100%;
          "
          class="flex align-center"
        >
          <span
            style="
              color: white;
              border: none;
              margin: 0px;
              box-sizing: border-box;
              font-size: 24px;
              font-weight: bold;
              height: 30px;
            "
          >
            Modifica
          </span>
          <button
            style="margin-left: auto; cursor: pointer"
            @click="salvaModifica"
          >
            <fa-i class="fa-xl" icon="floppy-disk"></fa-i>
          </button>
          <button
            class="button-delete"
            style="margin-left: auto; cursor: pointer"
            @click="dialog_edit = false"
          >
            <fa-i class="fa-xl" icon="x"></fa-i>
          </button>
        </div>
        <div class="card-text">
          <v-input v-model="selected_item.nome" label="Nome"></v-input>
          <v-input v-model="selected_item.desc" label="Descrizione"></v-input>
          <img
            @click="handleImageUpload(selected_item)"
            v-if="selected_item.img"
            style="
              cursor: pointer;
              width: 200px;
              margin-right: 10px;
              margin-left: 10px;
            "
            :src="selected_item.img"
            alt="Nessun immagine trovata"
          />
          <fa-i
            v-else
            style="
              cursor: pointer;
              color: green;
              margin-right: 10px;
              margin-left: 10px;
            "
            class="fa-xl"
            icon="image"
            @click="handleImageUpload(selected_item)"
          ></fa-i>
        </div>
      </div>
    </div>
    <div class="dialog" v-show="dialog_delete">
      <div style="width: 400px; text-align: center" class="card">
        <div
          style="
            box-sizing: border-box;
            height: 40px;
            background-color: blue;
            margin: 0px;
            width: 100%;
          "
          class="flex align-center"
        >
          <span
            style="
              color: white;
              border: none;
              margin: 0px;
              box-sizing: border-box;
              font-size: 24px;
              font-weight: bold;
              height: 30px;
            "
          >
            Elimina
          </span>
          <button
            style="margin-left: auto; cursor: pointer"
            @click="confermaElimina"
          >
            <fa-i class="fa-xl" icon="floppy-disk"></fa-i>
          </button>
          <button
            class="button-delete"
            style="margin-left: auto; cursor: pointer"
            @click="dialog_delete = false"
          >
            <fa-i class="fa-xl" icon="x"></fa-i>
          </button>
        </div>
        <div class="card-text">
          <h3>Sei sicuro di voler eliminare {{ selected_item.nome }} ?</h3>
        </div>
      </div>
    </div>
    <v-snackbar
      v-model="snackbar"
      bgColor="orange"
      style="z-index: 10001"
    ></v-snackbar>
  </div>
</template>

<script>
// import fs from 'fs';
class Prodotto {
  constructor(arg = undefined) {
    if (arg != undefined) {
      const campi = this.setCampi();
      campi.forEach((c) => {
        this[c.nome] = arg[c.nome] != undefined ? arg[c.nome] : c.default_val;
      });
    } else {
      const campi = this.setCampi();
      campi.forEach((c) => {
        this[c.nome] = c.default_val;
      });
    }
  }
  // Metodo per resettare tutti i campi
  reset() {
    const campi = this.setCampi();
    campi.forEach((c) => {
      this[c.nome] = c.default_val;
    });
  }
  setCampi() {
    const campi = [
      { nome: "id", default_val: -1 },
      { nome: "nome", default_val: "" },
      { nome: "img", default_val: "" },
      { nome: "desc", default_val: "" },
    ];
    return campi;
  }
}
export default {
  name: "HomeView",
  components: {},
  data: () => ({
    // Variabili d'appoggio
    snackbar: "",
    filtro_nome: "",
    new_prodotto: new Prodotto(),
    selected_item: {},
    notifica: {
      title: "",
      body: "",
    },
    // Modal
    dialog_edit: false,
    dialog_delete: false,
    // Array
    prodotti: [],
    prodotti_totali: [],
    headers: ["Modifica", "Id", "Nome", "Desc", "Img", "Elimina"],
  }),
  watch: {
    // prodotti_totali(newVal) {
    //   this.prodotti = Array.from(newVal);
    // },
    dialog_edit(newValue) {
      if (newValue) {
        document.body.classList.add("body-no-scroll");
      } else {
        document.body.classList.remove("body-no-scroll");
      }
    },
    dialog_delete(newValue) {
      if (newValue) {
        document.body.classList.add("body-no-scroll");
      } else {
        document.body.classList.remove("body-no-scroll");
      }
    },
  },
  methods: {
    elimina(p) {
      this.selected_item = JSON.parse(JSON.stringify(p));
      this.dialog_delete = true;
    },
    modifica(p) {
      this.selected_item = JSON.parse(JSON.stringify(p));
      this.dialog_edit = true;
    },
    async salvaModifica() {
      if (this.selected_item.nome) {
        this.dialog_edit = false;
        await this.$store.dispatch("setProdotto", this.selected_item);
        this.selected_item = {};
        this.getProdotti();
      } else {
        this.snackbar = "Inserire nome prodotto";
      }
    },
    async salva() {
      if (this.new_prodotto.nome) {
        this.dialog_edit = false;
        await this.$store.dispatch("setProdotto", this.new_prodotto);
        this.new_prodotto = new Prodotto();
        this.getProdotti();
      } else {
        this.snackbar = "Inserire nome prodotto";
      }
    },
    async confermaElimina() {
      this.dialog_delete = false;
      await this.$store.dispatch("eliminaProdotto", this.selected_item);
      this.getProdotti();
    },
    async handleImageUpload(item) {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/jpeg, image/png, image/webp");
      input.addEventListener("change", async (event) => {
        const file = event.target.files[0];

        if (!file) return;
        try {
          const base64 = await this.convertToBase64(file);
          item.img = base64;
        } catch (error) {
          console.error("Error converting image to base64:", error);
        }
      });
      // Simuliamo il click sull'input appena creato per aprire il selettore di file
      input.click();
    },
    convertToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    filtra() {
      let arrTemp = Array.from(this.prodotti_totali);
      if (this.filtro_nome != null && this.filtro_nome != "") {
        arrTemp = arrTemp.filter((i) =>
          i.nome.toLowerCase().includes(this.filtro_nome.toLowerCase())
        );
      }
      this.prodotti = Array.from(arrTemp);
    },
    async getProdotti() {
      await this.$store.dispatch("getProdotti").then((res) => {
        console.log(res);
        this.prodotti_totali = res;
        this.prodotti = Array.from(this.prodotti_totali);
        console.log(this.prodotti);
      });
    },
  },
  computed: {},
  async mounted() {
    this.getProdotti();
  },
};
</script>
<style scoped>
.textfield {
  border: none;
  border-bottom: 1px solid;
  margin: 5px;
}
.textfield:focus {
  border: none;
  outline: none;
  border-bottom: 1px solid grey;
  margin: 5px;
}
</style>