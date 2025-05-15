import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
  try:
    claims = event['requestContext']['authorizer']['jwt']['claims']
    user_id = claims['sub']
    todo_id = event['pathParameters']['id']

    table.delete_item(
      Key={"userId": user_id, "todoId": todo_id}
    )

    return {
      "statusCode": 200,
      "body": json.dumps({"message": "Todo deleted"})
    }

  except Exception as e:
    return {
      "statusCode": 500,
      "body": json.dumps({"error": str(e)})
    }
