INSERT INTO "Category" (name) VALUES ('Lập trình'), ('Hệ thống'), ('Đời sống') ON CONFLICT (name) DO NOTHING;
