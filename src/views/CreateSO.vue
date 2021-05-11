<template>
  <v-app>
    <v-container>
      <h1 class="text-h5 text-center mt-5">Create SO</h1>
      <v-row>
        <v-col class="center mt-5">
          <v-progress-circular
            indeterminate
            color="primary"
            v-if="!newSoNumber"
          ></v-progress-circular>
        </v-col>
      </v-row>

      <p class="text-center primary--text text--lighten-2" v-if="newSoNumber">
        {{ subject }}
      </p>
      <p class="text-center" v-if="newSoNumber">{{ newSoNumber }}</p>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      newSoNumber: "",
      subject: "",
    };
  },
  methods: {},
  async mounted() {
    const itemNew = Office.context.mailbox.item;
    this.subject = itemNew.subject;

    let responseOrch3 = {};
    const configOrch3 = {
      headers: { Authorization: "Basic SkRFOkpERQ==" },
    };

    let orchPayload3 = [];
    orchPayload3.push(
      {
        name: "lastSONumber",
        value: "14475",
      },
      {
        name: "soldTo",
        value: "4243",
      }
    );

    responseOrch3 = await axios.post(
      "https://hight-ais.ngrok.io/jderest/v3/orchestrator/HIGHT_DuplicateSO",
      {
        inputs: orchPayload3,
      },
      configOrch3
    );

    // Write message property value to the task pane
    let responseOrch4 = {};
    const configOrch4 = {
      headers: { Authorization: "Basic SkRFOkpERQ==" },
    };

    let orchPayload4 = [];
    orchPayload4.push({
      name: "abSoldTo",
      value: "4243",
    });

    responseOrch4 = await axios.post(
      "https://hight-ais.ngrok.io/jderest/v3/orchestrator/HIGHT_GetSOLatest",
      {
        inputs: orchPayload4,
      },
      configOrch4
    );

    let postData = {
      subject: itemNew.subject,
      from: itemNew.from,
      to: itemNew.to,
      body: itemNew.body,
      attachment: itemNew.attachments,
      full: itemNew,
      action: "initial_parse",
      created_so: responseOrch4.data.HIGHT_GetSOLatest.rowset[0] + "|SO|00001",
    };
    let postRes = await axios.post(
      "https://s3skv5gm1l.execute-api.us-east-1.amazonaws.com/production/api/outlookbot",
      postData
    );

    var attachment = Office.context.mailbox.item.getAttachmentContentAsync(
      itemNew.attachments[0].id,
      handleAttachmentsCallback
    );

    // Write message property value to the task pane
    let row4 = responseOrch4.data.HIGHT_GetSOLatest.rowset[0];

    this.newSoNumber = `Newly created SO: ${row4["Order Number"]}`;

    function callbackAttachment(result) {
      if (result.value.length > 0) {
        for (i = 0; i < result.value.length; i++) {
          result.asyncContext.currentItem.getAttachmentContentAsync(
            result.value[i].id,
            handleAttachmentsCallback
          );
        }
      }
    }

    function handleAttachmentsCallback(result) {
      // Parse string to be a url, an .eml file, a base64-encoded string, or an .icalendar file.
      switch (result.value.format) {
        case Office.MailboxEnums.AttachmentContentFormat.Base64:
          // Handle file attachment.
          let postDataAtt = {
            attachment_content: result.value,
            action: "attachment_parse",
          };
          axios
            .post(
              "https://s3skv5gm1l.execute-api.us-east-1.amazonaws.com/production/api/outlookbot",
              postDataAtt
            )
            .then(function(response) {
              console.log(response);
            })
            .catch(function(error) {
              console.log(error);
            });
          break;
        case Office.MailboxEnums.AttachmentContentFormat.Eml:
          // Handle email item attachment.
          break;
        case Office.MailboxEnums.AttachmentContentFormat.ICalendar:
          // Handle .icalender attachment.
          break;
        case Office.MailboxEnums.AttachmentContentFormat.Url:
          // Handle cloud attachment.
          break;
        default:
        // Handle attachment formats that are not supported.
      }
    }
  },
};
</script>

<style></style>
