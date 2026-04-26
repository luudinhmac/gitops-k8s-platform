export interface JwtPayload {
  id: number;
  username: string;
  role: string;
  sub?: number;
}
