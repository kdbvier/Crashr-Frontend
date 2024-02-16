import { Constr, Data, Lucid, fromHex, toHex } from "lucid-cardano";
import { encode } from 'cbor-x';
import data from './plutus.json';
import axios from "axios";
import { postTransaction } from "@/api/api";
export const buyNFT = async (address: string, lucid: Lucid, utxoValue: string, NFTData: NFTDataProps[], owner: string) => {
    try {
        const marketScript = {
            type: "PlutusV2",
            script: toHex(encode(fromHex(data.validators[0].compiledCode)))
        };


        // @ts-ignore
        const validatorHash = await lucid.utils.validatorToScriptHash(marketScript);
        console.log("validator hash", validatorHash)
        const CredentialSC = await lucid.utils.scriptHashToCredential(validatorHash);

        var redeemerRequest = Data.to(
            new Constr(1, [])
        )
        console.log("redeemerRequest", redeemerRequest)
        //THIS IS THE TXHASH OF THE LISTING I WANT TO BUY
        const utxoHash = utxoValue
        console.log("utxoHash", utxoHash)
        const index = 0
        var utxo: any = await lucid.utxosByOutRef([{ txHash: utxoHash, outputIndex: index }])
        var datumUtxo = Data.from(utxo[0].datum)//qua cbor
        console.log("utxo", utxo)
        console.log("datumUtxo", datumUtxo)
        // @ts-ignore
        let pubSeller = datumUtxo.fields[0].fields[0].fields[0]
        // @ts-ignore
        let stakeSeller = datumUtxo.fields[0].fields[1].fields[0].fields[0].fields[0]
        const pubKeyCredentials = lucid.utils.keyHashToCredential(pubSeller);
        const stakeKeyCredentials = lucid.utils.keyHashToCredential(stakeSeller);
        const addressSeller = lucid.utils.credentialToAddress(pubKeyCredentials, stakeKeyCredentials);
        console.log("pubSeller", pubSeller)
        console.log("stakeSeller", stakeSeller)
        console.log("pubKeyCredentials", pubKeyCredentials)
        console.log("stakeKeyCredentials", stakeKeyCredentials)
        console.log("addressSeller", addressSeller)

        // @ts-ignore
        let pubMarketplace = datumUtxo.fields[8].fields[0].fields[0]
        // @ts-ignore
        let stakeMarketplace = datumUtxo.fields[8].fields[1].fields[0].fields[0].fields[0]
        const pubKeyCredentialsMarketplace = lucid.utils.keyHashToCredential(pubMarketplace);
        const stakeKeyCredentialsMarketplace = lucid.utils.keyHashToCredential(stakeMarketplace);
        const addressMarketplace = lucid.utils.credentialToAddress(pubKeyCredentialsMarketplace, stakeKeyCredentialsMarketplace);

        console.log("pubMarketplace", pubMarketplace)
        console.log("stakeMarketplace", stakeMarketplace)
        console.log("pubKeyCredentialsMarketplace", pubKeyCredentialsMarketplace)
        console.log("stakeKeyCredentialsMarketplace", stakeKeyCredentialsMarketplace)
        console.log("addressMarketplace", addressMarketplace)

        // @ts-ignore
        let pubRoyalty = datumUtxo.fields[4].fields[0].fields[0]
        // @ts-ignore
        let stakeRoyalty = datumUtxo.fields[4].fields[1].fields[0].fields[0].fields[0]
        const pubKeyCredentialsRoyalty = lucid.utils.keyHashToCredential(pubRoyalty);
        const stakeKeyCredentialsRoyalty = lucid.utils.keyHashToCredential(stakeRoyalty);
        const addressRoyalty = lucid.utils.credentialToAddress(pubKeyCredentialsRoyalty, stakeKeyCredentialsRoyalty);

        console.log("pubRoyalty", pubRoyalty)
        console.log("stakeRoyalty", stakeRoyalty)
        console.log("pubKeyCredentialsRoyalty", pubKeyCredentialsRoyalty)
        console.log("stakeKeyCredentialsRoyalty", stakeKeyCredentialsRoyalty)
        console.log("addressRoyalty", addressRoyalty)



        // @ts-ignore
        let unit = datumUtxo.fields[1] + datumUtxo.fields[2]
        // @ts-ignore
        let amount = datumUtxo.fields[3]

        // @ts-ignore
        let unitFee = datumUtxo.fields[9] + datumUtxo.fields[10]
        // @ts-ignore
        let amountFee = datumUtxo.fields[11]
        // @ts-ignore
        let unitRoyalty = datumUtxo.fields[5] + datumUtxo.fields[6]
        // @ts-ignore
        let amountRoyalty = datumUtxo.fields[7]
        let price: any = {
        }
        if (unit === "") {
            price['lovelace'] = amount
        } else {
            price[unit] = amount
        }

        console.log("unitFee", unitFee)
        console.log("amountFee", amountFee)

        let priceFee: any = {
        }

        if (unitFee === "") {
            priceFee['lovelace'] = amountFee
        } else {
            priceFee[unit] = amountFee
        }

        let priceRoyalty: any = {
        }

        if (unitRoyalty === "") {
            priceRoyalty['lovelace'] = amountRoyalty
        } else {
            priceRoyalty[unit] = amountRoyalty
        }


        console.log("price", price)

        console.log("priceFee", priceFee)

        console.log("priceRoyalty", priceRoyalty)


        let change = utxo[0].assets['lovelace']
        console.log("change", change)
        const tx = await lucid
            .newTx()
            .collectFrom(utxo, redeemerRequest)
            .payToAddress(addressSeller, price)
            .payToAddress(addressMarketplace, priceFee)
            .payToAddress(addressRoyalty, priceRoyalty)
            // @ts-ignore
            .attachSpendingValidator(marketScript)
            .payToAddress(addressSeller, { ['lovelace']: change })
            .complete()
        console.log("tx", tx)

        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();
        console.log("txHash", txHash)
        if (txHash) {
            const reqData = {
                address: address,
                entries: {
                    "type": "buy-nft",
                    "address": address,
                    "nfts": NFTData,
                    "utxo": utxoValue
                }
            }

            const response = await axios.post("https://ju8sg42zcd.execute-api.us-west-2.amazonaws.com/test", JSON.stringify(reqData, (_, v) => typeof v === 'bigint' ? v.toString() : v))
            await postTransaction(reqData)
            if (owner !== '') {
                const reqData2 = {
                    address: owner,
                    entries: {
                        "type": "buy-nft",
                        "address": address,
                        "nfts": NFTData
                    }
                }
                const response2 = await axios.post("https://ju8sg42zcd.execute-api.us-west-2.amazonaws.com/test", JSON.stringify(reqData2, (_, v) => typeof v === 'bigint' ? v.toString() : v))
                await postTransaction(reqData2)
            }
            if (response) {
                return {
                    result: "success"
                };
            }

        }

    } catch (err) {
        console.log("err", err)
        return {
            result: "fail",
            error: err
        }
    }
}