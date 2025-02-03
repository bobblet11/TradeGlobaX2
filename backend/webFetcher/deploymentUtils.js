//Current deployment service RenderIO will spin down without activity i.e without pinging

import {logError } from "./logger.js";

const RenderURL = `https://cors-anywhere-pnd9.onrender.com`;

export const pingRender = async () => {
	try{
		await fetch(RenderURL);
	}catch(error){
		logError(error)
	}	
}