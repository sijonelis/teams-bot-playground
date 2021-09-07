export class FeedCard {
    public static build() {
        return this.buildFeedCard();
    }

    private static buildFeedCard() {
        return {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "The document has been fed successfully",
                    "wrap": true
                }
            ]
        }
    }
}