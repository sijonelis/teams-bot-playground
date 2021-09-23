import { CardFactory, TurnContext, TextFormatTypes } from "botbuilder";
import { ComponentDialog, DialogContext } from "botbuilder-dialogs";
import { DefaultCard } from "../cards/DefaultCard";
import { FeedCard } from "../cards/FeedCard";
import { QueryCard } from "../cards/QueryCard";
import { AxiosHandler } from "../networking/AxiosHandler";
export class RootDialog extends ComponentDialog {
  axiosHandler = null;
  
  constructor(id: string) {
    super(id);
    this.axiosHandler = new AxiosHandler();
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

    switch (command.toLowerCase()) {
      case "feedtext": {
        var feedResponse =  await this.axiosHandler.executeFeed(text);
        const feedCard = CardFactory.adaptiveCard(FeedCard.build());
        await innerDc.context.sendActivity({ attachments: [feedCard] });
        return await innerDc.cancelAllDialogs();
      }
      case "query": {
        var queryResponse = await this.axiosHandler.executeQuery(text);
        const card = CardFactory.adaptiveCard(QueryCard.build(queryResponse) );
        await innerDc.context.sendActivity({ attachments: [card] });
        return await innerDc.cancelAllDialogs();
      }
      case "querybyinvert": {
        var queryResponse = await this.axiosHandler.executeQueryByInvert(text);
        const card = CardFactory.adaptiveCard(QueryCard.build(queryResponse) );
        await innerDc.context.sendActivity({ attachments: [card] });
        return await innerDc.cancelAllDialogs();
      }
      // case "show": {
      //   if (innerDc.context.activity.conversation.isGroup) {
      //     await innerDc.context.sendActivity(
      //       `Sorry, currently TeamsFX SDK doesn't support Group/Team/Meeting Bot SSO. To try this command please install this app as Personal Bot and send "show".`
      //     );
      //     return await innerDc.cancelAllDialogs();
      //   }
      //   break;
      // }
      case "intro": {
        const card = DefaultCard.build();
        await innerDc.context.sendActivity({ attachments: [card] });
        return await innerDc.cancelAllDialogs();
      }
      default: {
        const card = DefaultCard.build();
        await innerDc.context.sendActivity({ attachments: [card] });
        return await innerDc.cancelAllDialogs();
      }
    }
  }
}
