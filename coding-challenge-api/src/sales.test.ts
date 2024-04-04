import fetch from "node-fetch";
import { getSales } from "./sales";
import 'dotenv/config';

jest.mock("node-fetch");

describe('getSales', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it('should fetch data from the server and return processed JSON data', async () => {
        const csvData = 'storeId,marketplace,country,shopName\n1,Amazon,USA,Shop1\n2,Ebay,UK,Shop2\n';
        const processedJsonData = [
            { storeId: '1', marketplace: 'Amazon', country: 'USA', shopName: 'Shop1' },
            { storeId: '2', marketplace: 'Ebay', country: 'UK', shopName: 'Shop2' }
        ];

        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
            text: jest.fn().mockResolvedValueOnce(csvData)
        });

        const req = {};
        const res = { json: jest.fn() };

        await getSales(req, res);

        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/stores.csv');
        expect(res.json).toHaveBeenCalledWith(processedJsonData);
    });

    it('should handle errors while fetching stores.csv', async () => {

        const mockError = new Error('Fetch failed');
        (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(mockError);

        const req = {};
        const res = { json: jest.fn() };

        const result = await getSales(req, res);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/stores.csv');
        expect(result).toEqual(undefined);
        expect(console.error).toHaveBeenCalledWith("Error encountered while fetching CSV FILE");
    });
});