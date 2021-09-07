import { ActionTypes, CardFactory } from "botbuilder";

export class DefaultCard {
    public static build() {
        const cardButtons = [
            {
              type: ActionTypes.ImBack,
              title: "Query",
              value: "query",
            },
            {
              type: ActionTypes.ImBack,
              title: "Feed",
              value: "feed",
            },
        ];
          
        const card = CardFactory.heroCard("Introduction", null, cardButtons, {
        text: `Nice to meet you, Traveller ^_^. I am Knowledgemon. My power enables you to search the documents. Currently I can eat and grow my power or read and answer questions. To feed me, type "feedtext <text to feed>", to ask me questions, type "query <query>" or "queryByInvert <query>.`,
        });

        return card;
    }
}