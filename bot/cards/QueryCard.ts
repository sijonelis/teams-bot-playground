export class QueryCard {

  public static build(queryResponse: []) {
    return this.buildQueryCard(queryResponse);
  }

  private static buildQueryCard(queryResponse: []) {

    var card = {
      "type": "AdaptiveCard",
      "body": [
      ],
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "version": "1.3"
    }

    card['body'].push( {
      "type": "TextBlock",
      "text": "We have found these documents match your query",
      "wrap": true,
      "fontType": "Default",
      "size": "Large",
      "weight": "Bolder",
      "separator": true,
      "horizontalAlignment": "Center"
    },);

    queryResponse.forEach(element => {
      var cardBody = {
        "type": "Container",
        "items": [
            {
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": element['title']
            },
            {
                "type": "TextBlock",
                "text": element['abstract'],
                "wrap": true
            },
            {
                "type": "ActionSet",
                "actions": [
                    {
                        "type": "Action.OpenUrl",
                        "title": "View this document",
                        "url": element['link'] === '' ? "www.google.com" : element['link']
                    }
                ]
            }
        ]
      }
      card['body'].push(cardBody);
    });

    return card;
  }
}