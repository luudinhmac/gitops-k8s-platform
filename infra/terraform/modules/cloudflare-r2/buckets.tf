# 1. Bucket: blog-upload-prod
resource "cloudflare_r2_bucket" "blog_upload_prod" {
  account_id = var.cloudflare_account_id
  name       = "blog-upload-prod"
}

# 2. Bucket: blog-upload-staging
resource "cloudflare_r2_bucket" "blog_upload_staging" {
  account_id = var.cloudflare_account_id
  name       = "blog-upload-staging"
}

# 3. Bucket: cluster-etcd-backup-prod
resource "cloudflare_r2_bucket" "cluster_etcd_backup_prod" {
  account_id = var.cloudflare_account_id
  name       = "cluster-etcd-backup-prod"
}

# 4. Bucket: velero-k8s-prod
resource "cloudflare_r2_bucket" "velero_k8s_prod" {
  account_id = var.cloudflare_account_id
  name       = "velero-k8s-prod"
}

# 5. Dedicated Bucket for Terraform Remote State
resource "cloudflare_r2_bucket" "terraform_state" {
  account_id = var.cloudflare_account_id
  name       = "terraform-state-blog"
}

# 6. Bucket: cluster-db-backup-prod (PostgreSQL logical dumps)
resource "cloudflare_r2_bucket" "cluster_db_backup_prod" {
  account_id = var.cloudflare_account_id
  name       = "cluster-db-backup-prod"
}

