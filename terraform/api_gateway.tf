resource "aws_apigatewayv2_api" "todos_api" {
  name          = "todos-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["OPTIONS", "GET", "POST", "PUT", "DELETE"]
    allow_headers = ["*"]
    expose_headers = ["*"]
  }

  tags = {
    Environment = "dev"
    Project     = "serverless-todo"
  }
}

resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_todo.function_name
  principal     = "apigateway.amazonaws.com"

  # The source ARN is the ARN of the API Gateway
  source_arn = "${aws_apigatewayv2_api.todos_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.todos_api.id
  name        = "$default"
  auto_deploy = true

  tags = {
    Environment = "dev"
    Project     = "serverless-todo"
  }
}

resource "aws_apigatewayv2_integration" "create_todos_integration" {
  api_id                 = aws_apigatewayv2_api.todos_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.create_todo.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "create_todo_route" {
  api_id             = aws_apigatewayv2_api.todos_api.id
  route_key          = "POST /todos"
  target             = "integrations/${aws_apigatewayv2_integration.create_todos_integration.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_integration" "get_todos_integration" {
  api_id                 = aws_apigatewayv2_api.todos_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_todos.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_todos_route" {
  api_id             = aws_apigatewayv2_api.todos_api.id
  route_key          = "GET /todos"
  target             = "integrations/${aws_apigatewayv2_integration.get_todos_integration.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_integration" "update_todo_integration" {
  api_id                 = aws_apigatewayv2_api.todos_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.update_todo.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "update_todo_route" {
  api_id             = aws_apigatewayv2_api.todos_api.id
  route_key          = "PUT /todos/{id}"
  target             = "integrations/${aws_apigatewayv2_integration.update_todo_integration.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_integration" "delete_todo_integration" {
  api_id                 = aws_apigatewayv2_api.todos_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.delete_todo.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "delete_todo_route" {
  api_id             = aws_apigatewayv2_api.todos_api.id
  route_key          = "DELETE /todos/{id}"
  target             = "integrations/${aws_apigatewayv2_integration.delete_todo_integration.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
  authorization_type = "JWT"
}

resource "aws_lambda_permission" "apigw_invoke_get" {
  statement_id  = "AllowAPIGWInvokeGet"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_todos.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.todos_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_invoke_update" {
  statement_id  = "AllowAPIGWInvokeUpdate"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.update_todo.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.todos_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_invoke_delete" {
  statement_id  = "AllowAPIGWInvokeDelete"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_todo.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.todos_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_authorizer" "cognito" {
  api_id          = aws_apigatewayv2_api.todos_api.id
  name            = "cognito-authorizer"
  authorizer_type = "JWT"

  identity_sources = ["$request.header.Authorization"]

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.main.id]
    issuer   = "https://cognito-idp.us-east-1.amazonaws.com/${aws_cognito_user_pool.main.id}"
  }
}
