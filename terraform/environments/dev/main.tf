provider "aws" {
  endpoints {
    sqs = "http://127.0.0.1:4566"
    sns = "http://127.0.0.1:4566"
  }
}

module "sns" {
  source = "../../modules/sns"

  location_created_topic = var.location_created_topic
  location_updated_topic = var.location_updated_topic
  location_deleted_topic = var.location_deleted_topic
}

module "sqs" {
  source = "../../modules/sqs"

  location_created_queue = var.location_created_queue
  location_updated_queue = var.location_updated_queue
  location_deleted_queue = var.location_deleted_queue
}