export default {
  "document": {
    "id": "bulb-document",
    "title": "hello world",
    "type": "document",
    "nodes": [
      {
        "id": "bulb-block-1",
        "type": "block",
        "name": "heading",
        "data": {
          "level": "title",
          "style": {
            "textAlign": "left"
          }
        },
        "nodes": [
          {
            "id": "bulb-text-1",
            "type": "text",
            "leaves": [
              {
                "id": "bulb-leave-1",
                "text": "Bulb Editor",
                "marks": [
                  {
                    "type": "color",
                    "value": "#555"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
          "type": "block",
          "id": "bulb-block-2",
          "name": "todo",
          "data": {
              "checked": false
          },
          "nodes": [
              {
                  "type": "block",
                  "id": "bulb-block-3",
                  "name": "paragraph",
                  "nodes": [
                      {
                          "type": "text",
                          "id": "bulb-text-2",
                          "leaves": [
                              {
                                  "text": "AB22EFXY",
                                  "id": "bulb-leave-2",
                              }
                          ]
                      },
                      {
                          "type": "text",
                          "id": "bulb-text-4",
                          "leaves": [
                              {
                                  "text": "GHIJK",
                                  "id": "bulb-leave-3",
                              }
                          ]
                      }
                  ]
              }
          ]
      },
    ]
  }
}
