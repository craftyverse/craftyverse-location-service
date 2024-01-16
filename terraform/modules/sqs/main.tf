resource "aws_sqs_queue" "location_created_queue" {
  name = var.location_created_queue
  delay_seconds = 0
  message_retention_seconds = 604800
  receive_wait_time_seconds = 0
}

