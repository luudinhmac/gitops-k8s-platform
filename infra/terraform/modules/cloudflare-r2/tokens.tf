# =========================================================================
# CLOUDFLARE R2 BACKUP API TOKEN
# =========================================================================

data "cloudflare_api_token_permission_groups" "all" {}

resource "cloudflare_api_token" "r2_backup_token" {
  name = "r2-cluster-backup-token"

  policy {
    permission_groups = [
      data.cloudflare_api_token_permission_groups.all.account["Workers R2 Storage Write"],
      data.cloudflare_api_token_permission_groups.all.account["Workers R2 Storage Read"]
    ]
    resources = {
      "com.cloudflare.api.account.${var.cloudflare_account_id}" = "*"
    }
  }
}
