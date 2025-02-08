import Joi from "joi";

export const COIN_META_DATA_GET_SCHEMA = Joi.object({
  symbol: Joi.string().uppercase().min(1).required(),
});

export const COIN_ALL_GET_SCHEMA = Joi.object({
  startCoin: Joi.optional(),
  endCoin: Joi.optional(),
});

export const COIN_PRICE_INSTANCE_GET_SCHEMA = Joi.object({
  symbol: Joi.string().uppercase().min(1).required(),
  numberOfInstances: Joi.string().pattern(/^\d+$/).required(), // Accept as string and ensure it's numeric
});

export const COIN_PRICE_INSTANCE_RANGE_GET_SCHEMA = Joi.object({
  symbol: Joi.string().uppercase().min(1).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});

export const COIN_META_DATA_SCHEMA = Joi.object({
  name: Joi.string().min(1).required(),
  symbol: Joi.string().uppercase().min(1).required(),
  description: Joi.string().required(),
  logo: Joi.string().uri().required(),
});

export const COIN_GET_SPECIFIC_SCHEMA = Joi.object({
  symbol: Joi.string().uppercase().min(1).required(),
});

export const COIN_PRICE_INSTANCE_SCHEMA = Joi.object({
  symbol: Joi.string().required(),
  timestamp: Joi.date().required(),
  price: Joi.string()
    .pattern(/^[-+]?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/)
    .required(), // Accept numeric strings with optional decimals and scientific notation
  market_cap: Joi.string()
    .pattern(/^[-+]?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/)
    .required(), // Same for market_cap
  volume_change_24h: Joi.string()
    .pattern(/^[-+]?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/)
    .required(), // Same for volume_change_24h
  circulating_supply: Joi.string()
    .pattern(/^[-+]?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/)
    .required(), // Same for circulating_supply
  total_supply: Joi.string()
    .pattern(/^[-+]?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/)
    .required(), // Same for total_supply
  fully_diluted_market_cap: Joi.string()
    .pattern(/^[-+]?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/)
    .required(), // Same for fully_diluted_market_cap
  percent_change_1h: Joi.string()
    .pattern(/^[-+]?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/)
    .required(), // Same for percent_change_1h
  percent_change_24h: Joi.string()
    .pattern(/^[-+]?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/)
    .required(), // Same for percent_change_24h
  percent_change_7d: Joi.string()
    .pattern(/^[-+]?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/)
    .required(), // Same for percent_change_7d
});

export const USER_LOGIN_SCHEMA = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
