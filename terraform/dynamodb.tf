resource "aws_dynamodb_table" "todos" {
  name         = "todos"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "todoId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "todoId"
    type = "S"
  }

  tags = {
    Environment = "dev"
    Project     = "serverless-todo"
  }
}