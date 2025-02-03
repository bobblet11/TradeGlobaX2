import { fetchMetadata } from "./coinMarketAPIFunctions.js";
import { COINS_PATH } from "./config.js";
import { log, logError } from "./logger.js";
import { FileError } from "./errorHandling.js";
import fs from 'fs';

export const readLineFromFile = (filePath, lineNumber) => {
	log("fileUtils", `Reading file ${filePath} at line number ${lineNumber}`)
	try {
		const data = fs.readFileSync(filePath, "utf8");
	  	const lines = data.split("\n");
		if (lineNumber < 1 || lineNumber > lines.length) {
			throw new FileError(`Line number ${lineNumber} is out of range.`);
		}
	  	return lines[lineNumber - 1].trim();
	} catch (error) {
		logError(error);
	}
}

export const writeLineToFile = (filePath, lineNumber, content) => {
	log("fileUtils", `Writing to file ${filePath} at line number ${lineNumber}`);
    
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		const lines = data.split('\n');

		if (lineNumber < 1 || lineNumber > lines.length) {
			throw new FileError(`Line number ${lineNumber} is out of range.`);
		}

		lines.splice(lineNumber - 1, 0, content);

	   	fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
	} catch (error) {
		logError(error);
	}
    };


      
export const removeDuplicatesSymbols = async () => {
	const metadata = await fetchMetadata();
	let uniqueSymbols = "";
	let count = 0;
	const symbolSet = new Set();

	Object.entries(metadata).map(([key,value]) => {

		if (!symbolSet.has(value.symbol)){
			symbolSet.add(value.symbol);
			uniqueSymbols+=value.id+",";
			count++;
		}
	});

	uniqueSymbols = uniqueSymbols.substring(0,uniqueSymbols.length-2)
	writeLineToFile(COINS_PATH,1,uniqueSymbols)
}
