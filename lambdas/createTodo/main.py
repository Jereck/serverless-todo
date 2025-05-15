import json
import uuid
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
  try:
    claims = event['requestContext']['authorizer']['jwt']['claims']
    user_id = claims['sub']
    body = json.loads(event['body'])

    todo_id = str(uuid.uuid4())
    item = {
      "userId": user_id,
      "todoId": todo_id,
      "title": body['title'],
      "done": body.get("done", False)
    }

    table.put_item(Item=item)

    return { 
      "statusCode": 200,
      "body": json.dumps(item)
    }
  
  except Exception as e:
    return {
      "statusCode": 500,
      "body": json.dumps({ "error": str(e) })
    }