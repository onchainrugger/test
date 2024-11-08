import fetch from 'node-fetch';

const getTimestampOneMonthAgo = () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 12); // Kurangi satu bulan
    return Math.floor(now.getTime() / 1000); // Konversi ke detik (timestamp UNIX)
};

function formatNumber(num) {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      return num.toString();
    }
}

const fetchBullxChartData = async (contract) => {
    try {
        const address = [contract]; // Variabel yang berisi daftar alamat

        const getSupply = await fetch("https://api-edge.bullx.io/api", {
            headers: {
                "accept": "application/json, text/plain, */*",
                "cache-control": "no-cache",
                "content-type": "text/plain",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": `"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"`,
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": `"Android"`,
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": "https://backup.bullx.io/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: JSON.stringify({
                name: "resolveTokens",
                data: {
                    addresses: address,
                    chainId: 1399811149
                }
                }),
            method: "POST"
        });

        if (!getSupply.ok) {
            throw new Error(`Bullx API error: ${getSupply.statusText}`);
        }

        const supplyResponse = await getSupply.json();

        const totalSupply = BigInt(supplyResponse.data[contract].totalSupply) / BigInt(10 ** 6);
        const correctedTotalSupply = totalSupply.toString()


        const TS1= getTimestampOneMonthAgo();
        const TS2 = Math.floor(Date.now() / 1000);
    
        const response = await fetch("https://api-edge.bullx.io/chart", {
            headers: {
                "accept": "application/json, text/plain, */*",
                "cache-control": "no-cache",
                "content-type": "text/plain",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": `"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"`,
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": `"Android"`,
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": "https://backup.bullx.io/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: JSON.stringify({
                name: "chart",
                data: {
                    chainId: 1399811149,
                    base: contract,
                    quote: "So11111111111111111111111111111111111111112",
                    from: TS1,
                    to: TS2,
                    intervalSecs: 14400,
                    poolAddress: 0,
                    countBack: 329
                }
            }),
            method: "POST"
        });

        if (!response.ok) {
            throw new Error(`Bullx API error: ${response.statusText}`);
        }

        const data = await response.json();
        // return correctedTotalSupply;
        if(data.h.length > 1){
            const ATH = formatNumber(correctedTotalSupply * Math.max(...data.h))
            return ATH;
        } else {
            return 'error';
        }
    } catch (error) {
        console.error('Error fetching Bullx chart data:', error);
        return null;
    }
};


(async () => {

    const test = await fetchBullxChartData('2ffiSA7ZNAPYP59rMoKKgsKFmJbUSeEXxqYX1zzypump');

    console.log(test)

})();
