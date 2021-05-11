<template>
  <v-app>
    <v-container>
      <h1 class="text-h5 text-center mt-5">Find Customer</h1>
      <v-row>
        <v-col class="center mt-5">
          <v-progress-circular
            indeterminate
            color="primary"
            v-if="!responseOrch.length"
          ></v-progress-circular>
        </v-col>
      </v-row>

      <p
        class="text-center primary--text text--lighten-2"
        v-if="responseOrch.length"
      >
        {{ subject }}
      </p>

      <v-simple-table class="mt-5">
        <template v-slot:default>
          <tbody>
            <tr v-for="item in responseOrch" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.value }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      responseOrch: [],
      subject: "",
    };
  },
  methods: {},
  async mounted() {
    const subject = Office.context.mailbox.item.subject;
    this.subject = subject;

    let responseOrch = {};
    const configOrch = {
      headers: { Authorization: "Basic SkRFOkpERQ==" },
    };

    let orchPayload = [];
    orchPayload.push({
      name: "abNumber",
      value: "4244",
    });
    orchPayload.push({
      name: "type",
      value: "C",
    });

    responseOrch = await axios.post(
      "https://hight-ais.ngrok.io/jderest/v3/orchestrator/NEWDEMO_GetAB",
      {
        inputs: orchPayload,
      },
      configOrch
    );
    responseOrch = responseOrch.data;

    for (let key in responseOrch) {
      const newItem = {};
      newItem.name = key;
      newItem.value = responseOrch[key];
      this.responseOrch.push(newItem);
    }
  },
};
</script>

<style></style>
