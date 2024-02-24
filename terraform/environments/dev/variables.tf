# ==============================================================================
# Topic variables
# ==============================================================================
variable "location_created_topic" {
  type = string
  description = "The name of the SNS topic to create for location created events"
}

variable "location_updated_topic" {
  type = string
  description = "The name of the SNS topic to create for location updated events"
}

variable "location_deleted_topic" {
  type = string
  description = "The name of the SNS topic to create for location deleted events"
}

# ==============================================================================
# Queue variables
# ==============================================================================

variable "location_created_queue" {
  type = string
  description = "The name of the SQS queue to create for location created events"
}

variable "location_updated_queue" {
  type = string
  description = "The name of the SQS queue to create for location updated events"
}

variable "location_deleted_queue" {
  type = string
  description = "The name of the SQS queue to create for location deleted events"
}