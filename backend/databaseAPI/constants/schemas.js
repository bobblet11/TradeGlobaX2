import Joi from 'joi';
export const COIN_META_DATA_GET_SCHEMA = Joi.object({
	symbol: Joi.string()
	    .uppercase()
	    .min(1)
	    .required()
});

export const COIN_ALL_GET_SCHEMA = Joi.object({
	startCoin: Joi.number()
	    .optional(),
	endCoin: Joi.number()
	    .optional()
});

export const COIN_PRICE_INSTANCE_GET_SCHEMA = Joi.object({
	symbol: Joi.string()
	    .uppercase()
	    .min(1)
	    .required(),
	numberOfInstances: Joi.number()
	    .greater(0)
});

export const COIN_PRICE_INSTANCE_RANGE_GET_SCHEMA = Joi.object({
	symbol: Joi.string()
	    .uppercase()
	    .min(1)
	    .required(),
	startDate: Joi.date()
	    .required(),
	endDate: Joi.date()
	    .required(),
});

export const COIN_META_DATA_SCHEMA = Joi.object({
	name: Joi.string()
	    .min(1)
	    .required(),
	symbol: Joi.string()
	    .uppercase()
	    .min(1)
	    .required(),
	description: Joi.string()
	    .required(),
	logo: Joi.string()
	    .uri()
	    .required()
});

export const COIN_GET_SPECIFIC_SCHEMA = Joi.object({
symbol: Joi.string()
	.uppercase()
	.min(1)
	.required()
})
    
export const COIN_PRICE_INSTANCE_SCHEMA = Joi.object({
	symbol: Joi.string()
	    .required(),
	timestamp: Joi.date()
	    .required(),
	price: Joi.number()
	    .greater(0)
	    .required(),
	market_cap: Joi.number()
	    .greater(0)
	    .required(),
	volume_change_24h: Joi.number()
	    .required(),
	circulating_supply: Joi.number()
	    .greater(0)
	    .required(),
	total_supply: Joi.number()
	    .greater(0)
	    .required(),
	fully_diluted_market_cap: Joi.number()
	    .greater(0)
	    .required(),
	percent_change_1h: Joi.number()
	    .required(),
	percent_change_24h: Joi.number()
	    .required(),
	percent_change_7d: Joi.number()
	    .required()
});