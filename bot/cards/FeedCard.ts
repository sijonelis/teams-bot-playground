export class FeedCard {
    public static build() {
        return this.buildFeedCard();
    }

    private static buildFeedCard() {
        var card = {
            "type": "AdaptiveCard",
            "body": [
            ],
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3"
          }
      
          card['body'].push( {
            "type": "TextBlock",
            "text": "The document has been fed successfully",
            "wrap": true,
            "fontType": "Default",
            "weight": "Bolder",
            "separator": true,
            "horizontalAlignment": "Center"
          },);

        return card;
    }
}