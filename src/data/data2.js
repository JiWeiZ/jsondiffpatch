export default {
    "document": {
        "title": "hello world",
        "type": "document",
        "id": "bulb-document",
        "nodes": [
            {
                "type": "block",
                "id": "bulb-block-1",
                "name": "heading",
                "data": {
                    "level": "title",
                    "style": {
                        "textAlign": "left"
                    }
                },
                "nodes": [
                    {
                        "type": "text",
                        "id": "bulb-text-1",
                        "leaves": [
                            {
                                "text": "Bulb Editor",
                                "id": "bulb-leave-1",
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
                                        "text": "历史22版本",
                                        "id": "bulb-leave-2",
                                    }
                                ]
                            },
                            {
                                "type": "text",
                                "id": "bulb-text-4",
                                "leaves": [
                                    {
                                        "text": "新的一段",
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
