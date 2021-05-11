<template>
  <v-app>
    <v-container>
      <h1 class="text-h5 text-center mt-5">Orchestrations</h1>

      <v-row v-if="!items.length">
        <v-col class="center mt-5">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row>

      <v-form v-if="items.length">
        <v-select
          v-model="selectedOrch"
          class="mt-5"
          :items="items"
          label="Select an orchestration"
          outlined
        ></v-select>
        <v-btn width="100%" class="d-block" color="primary" @click="displayForm"
          >Go</v-btn
        >
      </v-form>
      <v-row v-if="loadingResponse">
        <v-col class="center mt-5">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row>
      <v-form class="mt-5" v-if="formDisplayed">
        <v-text-field
          v-for="input in inputsList"
          :key="input.name"
          :label="input.name"
          v-model="input.value"
        ></v-text-field>
        <v-btn color="primary" width="100%" @click="validate">Validate </v-btn>
      </v-form>
      <p v-if="result" class="mt-5 text-center">{{ result }}</p>

      <v-card v-if="errors" class="pa-5 mt-5 text-center errorBox" outlined>
        <div>
          <p class="red--text">Oops.. there was an error</p>
          <p>Error Code: {{ errorCode }}</p>
          <p>{{ errorDescription }}</p>
        </div>
      </v-card>

      <v-card
        outlined
        class="pa-5 text-center mt-5 successBox"
        v-if="resValues"
      >
        <p class="success--text">SUCCESS</p>
        <div class="successResult" v-for="key in resKeys" :key="key">
          <p>{{ key }}: {{ resValues[key] }}</p>
        </div>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedOrch: null,
      items: [],
      orchsList: [],
      orchForm: false,
      inputsList: [],
      inputs: [],
      result: null,
      errors: false,
      errorCode: "",
      errorDescription: "",
      loadingResponse: false,
      resValues: null,
      resKeys: null,
      formDisplayed: false,
    };
  },
  methods: {
    displayForm() {
      this.resValues = false;
      this.errors = false;
      this.inputsList = [];
      this.formDisplayed = true;
      const found = this.orchsList.find((elem) => {
        return elem.name === this.selectedOrch;
      });
      this.inputs = [];
      for (let i = 0; i < found.inputs.length; i++) {
        this.inputsList.push({ name: found.inputs[i].name });
      }
    },
    async validate() {
      this.loadingResponse = true;
      this.formDisplayed = false;

      const config = {
        route: "orchestration",
        orchestration: this.selectedOrch,
        inputs: this.inputsList,
      };
      let resFetch;
      resFetch = await axios.post(
        "https://wpg56h4p10.execute-api.us-east-1.amazonaws.com/production/",
        config
      );

      const keys = [];

      if (resFetch.data.ais_data["Errors/Warnings"]) {
        this.errors = true;
        this.errorCode =
          resFetch.data.ais_data["Errors/Warnings"][0]["Errors"][0].CODE;
        this.errorDescription =
          resFetch.data.ais_data["Errors/Warnings"][0]["Errors"][0].DESC;
      } else {
        console.log("success");
        this.resFetch = resFetch.data.ais_data;
        for (let key in resFetch.data.ais_data) {
          if (resFetch.data.ais_data.hasOwnProperty(key)) {
            console.log(key + "-->" + resFetch.data.ais_data[key]);
            keys.push(key);
          }
        }

        this.resKeys = keys;
        this.resValues = resFetch.data.ais_data;
      }

      this.loadingResponse = false;
    },
  },
  async mounted() {
    const config = {
      route: "discover",
    };
    const responseOrchsList = await axios.post(
      "https://wpg56h4p10.execute-api.us-east-1.amazonaws.com/production/",
      config
    );
    const list = responseOrchsList.data.ais_data.orchestrations;
    for (let i = 0; i < list.length; i++) {
      this.orchsList.push(list[i]);
      this.items.push(list[i].name);
    }
  },
};
</script>

<style>
.center {
  display: grid;
  place-items: center;
}
.successBox {
  border: 3px solid #4caf50 !important;
}

.errorBox {
  border: 3px solid #f44336 !important;
}
</style>
