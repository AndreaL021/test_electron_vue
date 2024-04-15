<template>
  <div style="padding: 5px">
      <div
        style="
          border: solid black 1px;
          border-radius: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 24px;
          padding-right: 10px;
          padding-left: 5px;
          overflow: visible;
          position: relative;
        "
      >
        <span
          v-if="label_span && modelValue === ''"
          class="label"
          style="z-index: -1"
          >{{ label }}</span
        >
        <input
          style="width: 100%; padding-left: 0"
          type="text"
          :value="modelValue"
          @input="updateModelValue($event.target.value)"
          @focusin="label_span = false"
          @focusout="label_span = true"
        />
      </div>
      <span
        style="
          display: flex;
          align-items: center;
          height: 0px;
          margin-top: 7px;
          overflow: visible;
          position: relative;
        "
         class="label"
      >
      
      <span style="color: red"
          class="label" v-if="required && modelValue === ''">Valore richiesto</span>
    </span>
  </div>
</template>
  
  <script>
export default {
  name: "SelectComponent",
  props: ["label", "modelValue", "required"],
  data() {
    return {
      label_span: true,
    };
  },
  watch: {},
  methods: {
    updateModelValue(value) {
      this.$emit("update:modelValue", value);
      this.$emit("change");
    },
  },
};
</script>
  
  <style scoped>
.input-container {
  border: solid black 1px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 24px;
  padding: 5px;
  overflow: visible;
  position: relative;
}
.label {
  color: grey;
  position: absolute;
  left: 5px;
}
.label2 {
  color: grey;
  position: absolute;
  left: 50px;
}
input {
  border: none;
  padding-left: 0; /* Rimuove il padding a sinistra */
  background-color: transparent;
}
input:focus {
  outline: none;
}
</style>