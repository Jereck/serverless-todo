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
    body = json.loads(event['body'])

    update_expr = "SET "
    expr_attrs = {}
    if "title" in body:
      update_expr += "title = :t, "
      expr_attrs[":t"] = body["title"]
    if "done" in body:
      update_expr += "done = :d, "
      expr_attrs[":d"] = body["done"]
    update_expr = update_expr.rstrip(", ")

    table.update_item(
      Key={"userId": user_id, "todoId": todo_id},
      UpdateExpression=update_expr,
      ExpressionAttributeValues=expr_attrs
    )

    return {
      "statusCode": 200,
      "body": json.dumps({"message": "Todo updated"})
    }

  except Exception as e:
      return {
        "statusCode": 500,
        "body": json.dumps({"error": str(e)})
      }
