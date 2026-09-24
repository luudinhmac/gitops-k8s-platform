output "blog_upload_prod_id" {
  value = cloudflare_r2_bucket.blog_upload_prod.id
}
output "terraform_state_bucket_name" {
  value = cloudflare_r2_bucket.terraform_state.name
}
output "cluster_db_backup_prod_name" {
  value = cloudflare_r2_bucket.cluster_db_backup_prod.name
}
output "r2_backup_token_id" {
  value = cloudflare_api_token.r2_backup_token.id
}



