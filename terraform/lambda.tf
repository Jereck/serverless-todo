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

resource "aws_iam_policy" "dynamodb_access" {
  name = "lambda-dynamodb-access"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query"
        ],
        Resource = aws_dynamodb_table.todos.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_dynamodb_access" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
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
  source_code_hash = filebase64sha256("${path.module}/../lambdas/createTodo.zip")


  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.todos.name
    }
  }
}

resource "aws_lambda_function" "get_todos" {
  function_name = "getTodos"
  runtime       = "python3.11"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "main.handler"
  filename      = "${path.module}/../lambdas/getTodos.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/getTodos.zip")


  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.todos.name
    }
  }
}

resource "aws_lambda_function" "update_todo" {
  function_name = "updateTodo"
  runtime       = "python3.11"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "main.handler"
  filename      = "${path.module}/../lambdas/updateTodo.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/updateTodo.zip")


  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.todos.name
    }
  }
}

resource "aws_lambda_function" "delete_todo" {
  function_name = "deleteTodo"
  runtime       = "python3.11"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "main.handler"
  filename      = "${path.module}/../lambdas/deleteTodo.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/deleteTodo.zip")


  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.todos.name
    }
  }
}