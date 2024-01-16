provider "aws" {
  endpoints {
    sqs = "http://127.0.0.1:4566"
    sns = "http://127.0.0.1:4566"
  }
}

module "sns" {
  source = "../../modules/sns"

  location_created_topic = var.location_created_topic
}

module "sqs" {
  source = "../../modules/sqs"

  location_created_queue = var.location_created_queue
}