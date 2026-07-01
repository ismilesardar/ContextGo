export interface TopUpOption {
  amount: number;
  tokens: number;
  productId: string;
}

export const TOP_UP_SYSTEM_TOKEN_OPTIONS: TopUpOption[] = [
  { amount: 5, tokens: 1000, productId: 'prod_6mFgSLv1mdFm0OOp9ZUCKL' },
  { amount: 10, tokens: 5000, productId: 'prod_659UqdR19cKbP2tJjfzq2v' },
  { amount: 20, tokens: 15000, productId: 'prod_7e9OIyXSElMWC2arHKTWst' },
  { amount: 50, tokens: 45000, productId: 'prod_7mTw3eVncSk4a68zNTTeio' },
  { amount: 100, tokens: 90000, productId: 'prod_1VNhLvJAGUkt6TeicJEvuo' }
];

export const TOP_UP_IMAGE_TOKEN_OPTIONS: TopUpOption[] = [
  { amount: 5, tokens: 60, productId: 'prod_6mFgSLv1mdFm0OOp9ZUCKL' },
  { amount: 10, tokens: 200, productId: 'prod_659UqdR19cKbP2tJjfzq2v' },
  { amount: 20, tokens: 500, productId: 'prod_7e9OIyXSElMWC2arHKTWst' },
  { amount: 50, tokens: 1500, productId: 'prod_7mTw3eVncSk4a68zNTTeio' },
  { amount: 100, tokens: 5000, productId: 'prod_1VNhLvJAGUkt6TeicJEvuo' }
];
