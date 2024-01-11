module "sns" {
  source = "../../modules/sns"

  location_created_topic = var.location_created_topic
}