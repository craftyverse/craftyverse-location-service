resource "aws_sns_topic" "location_created" {
  name = var.location_created_topic
}