import requests

def post_sample(access_token, text, intent):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token,
    }

    body = [{
        "text": text,
        "entities": [
            {
                "entity": "intent",
                "value": intent
            }
        ]
    }]

    output = requests.post('https://api.wit.ai/samples', data=body, headers=headers).json()
    print("OUTPUT", output)
    return output

def run_train(event, context):
    input = json.loads(event['body'])
    access_token = os.environ['WIT_API_KEY']
    text = input["text"]
    intent = input["intent"]

    output = post_sample(access_token, text, intent)
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application\json",
            'Access-Control-Allow-Origin': '*'
        },
        "body": json.dumps(output)
    }
