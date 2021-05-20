<template>
  <v-app>
    <v-container>
      <h1 class="text-h5 text-center mt-5">Orchestrations</h1>

      <!-- LOADING WHEN WAITING FOR ORCHESTRATIONS LIST  -->

      <v-row v-if="!listOfOrchsByName.length">
        <v-col class="center mt-5">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row>

      <!-- END OF LOADING WHEN WAITING FOR ORCHESTRATIONS LIST  -->

      <!-- ORCHESTRATION LIST SELECT FORM -->

      <v-form v-if="listOfOrchsByName.length">
        <v-select
          v-model="selectedOrch"
          class="mt-5"
          :items="listOfOrchsByName"
          label="Select an orchestration"
          outlined
        ></v-select>
        <v-btn width="100%" class="d-block" color="primary" @click="displayForm"
          >Go</v-btn
        >
      </v-form>

      <!-- END OF ORCHESTRATION LIST SELECT FORM -->

      <!-- LOADING WHEN WAITING FOR RESPONSE  -->

      <v-row v-if="loadingResponseFromValidate">
        <v-col class="center mt-5">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row>

      <!-- END OF LOADING WHEN WAITING FOR RESPONSE  -->

      <!-- ORCHESTRATION INPUTS FORM -->

      <v-form class="mt-5" v-if="formDisplayed">
        <v-text-field
          v-for="input in inputsList"
          :key="input.name"
          :label="input.name"
          v-model="input.value"
        ></v-text-field>
        <v-btn color="primary" width="100%" @click="validate">Validate</v-btn>
      </v-form>

      <!-- END OF ORCHESTRATION INPUTS FORM -->

      <!-- ERROR MESSAGE -->

      <v-card v-if="errors" class="pa-5 mt-5 text-center errorBox" outlined>
        <div>
          <p class="red--text">Oops.. there was an error</p>
          <p>Error Code: {{ errorCode }}</p>
          <p>{{ errorDescription }}</p>
        </div>
      </v-card>

      <!-- END OF ERROR MESSAGE -->

      <!-- SUCCESS MESSAGE -->
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

      <!-- END OF SUCCESS MESSAGE -->
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      /* Holds the orchestration selected */
      selectedOrch: null,
      /* Holds the orchestrations list that will be displayed in the select menu */
      listOfOrchsByName: [],
      /* Holds all the orchestrations fetched from the API */
      orchs: [],
      /* Holds the list of inputs to be displayed in the form */
      inputsList: [],
      /* Holds the inputs from the orchestration object */
      inputs: [],
      /* Toggles "errors" display */
      errors: false,
      /* Holds error code */
      errorCode: "",
      /* Holds error description */
      errorDescription: "",
      /* Toggles loading spinning for response from validate */
      loadingResponseFromValidate: false,
      /* Holds success response values */
      resValues: null,
      /* Holds success response keys */
      resKeys: null,
      /* Toggles display of form */
      formDisplayed: false,
    };
  },

  methods: {
    displayForm() {
      /* 
        - Clear success display
        - Clear errors display
        - Clear the list of inputs to be displayed in the form
        - Clear the array of inputs
        - Select the particular orchestration selected by the user
        - Populate "inputsList" with the inputs from the selected orchestration
        - Display the form
      */
      this.resValues = false;
      this.errors = false;
      this.inputsList = [];
      this.inputs = [];

      const found = this.orchs.find((elem) => {
        return elem.name === this.selectedOrch;
      });

      for (let i = 0; i < found.inputs.length; i++) {
        this.inputsList.push({ name: found.inputs[i].name });
      }
      this.formDisplayed = true;
    },
    async validate() {
      /*
      - Hide form
      - Display the spinning loading while fetching the response from validate
      - Define config for fetching response (with the inputs provided by user)
      - Fetch response from "execute"
      - Define array variable "keys"
      - If fetch response contains Errors/Warning, display errors card and displays error code and error description.
      - Otherwise, display success card with the keys and content for success

      */
      this.formDisplayed = false;
      this.loadingResponseFromValidate = true;

      const config = {
        route: "orchestration",
        orchestration: this.selectedOrch,
        inputs: this.inputsList,
      };
      let resFetch;

      try {
        resFetch = await axios.post(
          "https://wpg56h4p10.execute-api.us-east-1.amazonaws.com/production/",
          config
        );
      } catch (error) {
        console.log("there was an error", error);
      }

      const keys = [];

      console.log(resFetch);

      if (resFetch.data.ais_data["Errors/Warnings"]) {
        console.log("inside the first IF");
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

      this.loadingResponseFromValidate = false;
    },
  },

  async mounted() {
    /* When mounted, fetch all orchestrations */
    const config = {
      route: "discover",
    };
    const responseOrchsList = await axios.post(
      "https://wpg56h4p10.execute-api.us-east-1.amazonaws.com/production/",
      config
    );

    const list = responseOrchsList.data.ais_data.orchestrations;
    for (let i = 0; i < list.length; i++) {
      this.orchs.push(list[i]);
      this.listOfOrchsByName.push(list[i].name);
    }
    console.log(this.orchs);
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
