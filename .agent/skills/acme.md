Cài đặt Nginx với SSL wilcard dùng acme.sh + DNS Cloudflare (nội bộ)

Bước 1: Cài đặt Nginx và acme.sh
sudo apt update
sudo apt install nginx curl socat -y

# Cài acme.sh (chạy dưới user thường, không dùng sudo)
curl https://get.acme.sh | sh
source ~/.bashrc  # hoặc ~/.zshrc nếu dùng shell khác

Bước 2: Tạo API Token Cloudflare
Vào https://dash.cloudflare.com/profile/api-tokens

Tạo API Token với quyền chỉnh sửa DNS cho zone luumac.io.vn

Xuất biến môi trường trong shell (hoặc thêm vào ~/.bashrc):

export CF_Token="YOUR_CLOUDFLARE_API_TOKEN"


Bước 3: Đăng ký tài khoản acme.sh với email (bắt buộc)
~/.acme.sh/acme.sh --register-account -m your-email@example.com


Bước 4: Cấp chứng chỉ wildcard cho domain *.luumac.io.vn
~/.acme.sh/acme.sh --issue --dns dns_cf -d luumac.io.vn -d '*.luumac.io.vn'

Lệnh sẽ dùng Cloudflare DNS-01 challenge tự động tạo bản ghi TXT để xác thực.

Nếu thành công, chứng chỉ sẽ được lưu trong ~/.acme.sh/luumac.io.vn/

Bước 5: Cài chứng chỉ vào thư mục chuẩn của NGINX

sudo mkdir -p /etc/nginx/ssl/luumac.io.vn

sudo chown $(whoami) /etc/nginx/ssl/luumac.io.vn  # cho phép user ghi

~/.acme.sh/acme.sh --install-cert -d luumac.io.vn \
--key-file       /etc/nginx/ssl/luumac.io.vn/privkey.pem \
--fullchain-file /etc/nginx/ssl/luumac.io.vn/fullchain.pem \
--reloadcmd     "systemctl reload nginx"

Bước 6: Cấu hình NGINX cho subdomain test.luumac.io.vn
Tạo file /etc/nginx/sites-available/test.luumac.io.vn:


server {
    listen 80;
    server_name test.luumac.io.vn;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name test.luumac.io.vn;

    ssl_certificate     /etc/nginx/ssl/luumac.io.vn/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/luumac.io.vn/privkey.pem;

    location / {
        root /var/www/html;
        index index.html index.htm;
    }
}

Kích hoạt file và reload nginx

sudo ln -s /etc/nginx/sites-available/test.luumac.io.vn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx


Bước 7: Cấu hình DNS nội bộ cho subdomain (vì không có IP public)
Xác định IP nội bộ máy chủ NGINX (vd: 192.168.1.10):


ip addr show
Thêm dòng sau vào file /etc/hosts trên máy client (máy bạn dùng để truy cập):

192.168.1.10    test.luumac.io.vn

ping test.luumac.io.vn