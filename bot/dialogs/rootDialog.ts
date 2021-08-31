import { ActionTypes, CardFactory, TurnContext, TextFormatTypes } from "botbuilder";
import { ComponentDialog, DialogContext } from "botbuilder-dialogs";

const baseUrl = 'http://localhost:5000';
const axios = require('axios');

export class RootDialog extends ComponentDialog {


  constructor(id: string) {
    super(id);
  }

  async onBeginDialog(innerDc: DialogContext, options: {} | undefined) {
    const result = await this.triggerCommand(innerDc);
    if (result) {
      return result;
    }

    return await super.onBeginDialog(innerDc, options);
  }

  async onContinueDialog(innerDc: DialogContext) {
    return await super.onContinueDialog(innerDc);
  }

  async triggerCommand(innerDc: DialogContext) {
    const removedMentionText = TurnContext.removeRecipientMention(innerDc.context.activity);
    // var text = removedMentionText?.toLowerCase().replace(/\n|\r/g, "").trim(); // Remove the line break
    const [command, ...textParts] = removedMentionText?.toLowerCase().replace(/\n|\r/g, "").trim().split(' ');
    const text = textParts.join(' ');

    if (innerDc.context.activity.textFormat !== TextFormatTypes.Plain) {
      return await innerDc.cancelAllDialogs();
    }

    switch (command) {
      case "feedtext": {
        var feedResponse =  await this.executeFeed(text);
        await innerDc.context.sendActivity("" + feedResponse);
        return await innerDc.cancelAllDialogs();
      }
      case "query": {
        var queryResponse = await this.executeQuery(text);
        await innerDc.context.sendActivity("" + queryResponse);
        return await innerDc.cancelAllDialogs();
      }
      case "show": {
        if (innerDc.context.activity.conversation.isGroup) {
          await innerDc.context.sendActivity(
            `Sorry, currently TeamsFX SDK doesn't support Group/Team/Meeting Bot SSO. To try this command please install this app as Personal Bot and send "show".`
          );
          return await innerDc.cancelAllDialogs();
        }
        break;
      }
      case "intro": {
        const cardButtons = [
          {
            type: ActionTypes.ImBack,
            title: "Show profile",
            value: "show",
          },
        ];
        const card = CardFactory.heroCard("Introduction", null, cardButtons, {
          text: `This Bot has implemented single sign-on (SSO) using the identity of the user signed into the Teams client. See the <a href="https://aka.ms/teamsfx-docs-auth">TeamsFx authentication document</a> and code in <pre>bot/dialogs/mainDialog.js</pre> to learn more about SSO.<br>Type <strong>show</strong> or click the button below to show your profile by calling Microsoft Graph API with SSO. To learn more about building Bot using Microsoft Teams Framework, please refer to the <a href="https://aka.ms/teamsfx-docs">TeamsFx documentation</a>.`,
        });

        await innerDc.context.sendActivity({ attachments: [card] });
        return await innerDc.cancelAllDialogs();
      }
      default: {
        const cardButtons = [
          {
            type: ActionTypes.ImBack,
            title: "Show introduction card",
            value: "intro",
          },
        ];
        const card = CardFactory.heroCard("", null, cardButtons, {
          text: `This is a hello world Bot built with Microsoft Teams Framework, which is designed for illustration purposes. This Bot by default will not handle any specific question or task.<br>Please type <strong>intro</strong> to see the introduction card.`,
        });
        await innerDc.context.sendActivity({ attachments: [card] });
        return await innerDc.cancelAllDialogs();
      }
    }
  }

  private async executeQuery(queryText: string) {
    return axios.get(`${baseUrl}/query?query=${queryText}`)
    .then(function (response) {
      var queryResponse = response.data.documents;
      queryResponse = queryResponse.toString();
      console.log(response);
      return queryResponse;
    })
    .catch(function (error) { 
      console.log(error);
      return error.message;
    })
  }

  private async executeFeed(feedText: string) {
    return axios.post(`${baseUrl}/incrementFeed`, {
      type: 1,
      content: feedText
    })
    .then(function (response) {
      console.log(response);
      return response.data.title;

    })
    .catch(function (error) {
      console.log(error);
      return error.message;
     
    })
  }
}
