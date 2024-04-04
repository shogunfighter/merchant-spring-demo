import fetch from "node-fetch";
import csvtojson from "csvtojson";

export async function getSales(req: any, res: any) {
    const filePath = process.env.CSV_FILE_TARGET as string;
    
    try {
        const result = await fetch(filePath);
        const csvData = await result.text();

        // console.log("csvData:", csvData);

        const headers = csvData.split('\n')[0].split(',').filter(item => item !== "" && item !== "\r");
        // console.log("headers:", headers);

        try {
            const preJsonData = await csvtojson({
                noheader: false,
                output: "csv",
                /**
                 * Notes: Cleanup the csv result and ignore empty headers
                 * https://www.npmjs.com/package/csvtojson#parameters
                 */
                ignoreEmpty: true,
                ignoreColumns: /^$/ // emptyStringRegex
            }).fromString(csvData);
            // console.log("preJsonData:", preJsonData);

        
            // method 1 - if the JSON data structure is dynamic/unknown
            const processedJsonData = preJsonData.map(row => {
                const obj: any = {
                    storeId: 0,
                    marketplace: "",
                    country: "",
                    shopName: ""
                };
                headers.forEach((header:string, index:number) => {
                  obj[header] = row[index];
                });

                return obj;
            });

            // method 2 - if the JSON data structure is known
            // const processedJsonData = preJsonData.map(row => ({
            //     storeId: row[0],
            //     marketplace: row[1],
            //     country: row[2],
            //     shopName: row[3]
            // }));

            // console.log("processedJsonData:", processedJsonData);

            res.json(processedJsonData);
        }
        catch (error) {
            console.error("Error encountered while processing csv to json");
        }

    }
    catch (error) {
        console.error("Error encountered while fetching CSV FILE");
    }
}