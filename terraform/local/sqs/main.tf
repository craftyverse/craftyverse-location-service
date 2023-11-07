resource "aws_sqs_queue" "location_created_queue" {
  name = var.LOCATION_CREATED_QUEUE_NAME
  delay_seconds = 0
  message_retention_seconds = 604800
  receive_wait_time_seconds = 0
}