variable "location_created_topic" {
  type = string
  description = "The name of the SNS topic to create for location created events"
}

variable "location_created_queue" {
  type = string
  description = "The name of the SQS queue to create for location created events"
}