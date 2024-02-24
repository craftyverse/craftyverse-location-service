resource "aws_sns_topic" "location_created" {
  name = var.location_created_topic
}

resource "aws_sns_topic" "location_updated" {
  name = var.location_updated_topic
}

resource "aws_sns_topic" "location_deleted" {
  name = var.location_deleted_topic
}
