resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy_attachment" "lambda_policy" {
  name       = "lambda_policy"
  roles      = [aws_iam_role.lambda_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "create_todo" {
  function_name = "createTodo"
  runtime       = "python3.11"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "main.handler"
  filename      = "${path.module}/../lambdas/createTodo.zip"

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.todos.name
    }
  }
}