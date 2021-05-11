<template>
  <v-app>
    <v-container>
      <h1 class="text-h5 text-center mt-5">Last SO number</h1>
      <v-row>
        <v-col class="center mt-5">
          <v-progress-circular
            indeterminate
            color="primary"
            v-if="!soNumber"
          ></v-progress-circular>
        </v-col>
      </v-row>

      <p class="text-center primary--text text--lighten-2" v-if="soNumber">
        {{ subject }}
      </p>

      <p class="text-center" v-if="soNumber">{{ soNumber }}</p>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      subject: "",
      soNumber: "",
    };
  },
  async mounted() {
    const subject = Office.context.mailbox.item;
    this.subject = subject.subject;
    let responseOrch2 = {};
    const configOrch2 = {
      headers: { Authorization: "Basic SkRFOkpERQ==" },
    };

    let orchPayload2 = [];
    orchPayload2.push({
      name: "abSoldTo",
      value: "4243",
    });

    responseOrch2 = await axios.post(
      "https://hight-ais.ngrok.io/jderest/v3/orchestrator/HIGHT_GetSOLatest",
      {
        inputs: orchPayload2,
      },
      configOrch2
    );

    let row1 = responseOrch2.data.HIGHT_GetSOLatest.rowset[0];
    this.soNumber = row1["Order Number"];
  },
};
</script>

<style></style>
