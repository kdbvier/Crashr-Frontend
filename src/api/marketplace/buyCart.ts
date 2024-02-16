import { Blockfrost, Constr, Data, Lucid, fromHex, toHex } from "lucid-cardano";
import data from './plutus.json';
import { encode } from 'cbor-x';
import { postTransaction } from "@/api/api";
export const buyCart = async (lucid: Lucid | null, walletAddress: string, utxoValues: string[]) => {
    try {
        const marketScript = {
            type: "PlutusV2",
            script: toHex(encode(fromHex(data.validators[0].compiledCode)))
        };
        // @ts-ignore
        const validatorHash = await lucid.utils.validatorToScriptHash(marketScript);
        console.log("validator hash")

        if (!lucid) return;

        const CredentialSC = await lucid.utils.scriptHashToCredential(validatorHash);

        var redeemerRequest = Data.to(
            new Constr(1, [])
        )

        const CartUtxos = utxoValues.sort() //this is the array of utxos of nfts I want to buy


        var tx = await lucid
            .newTx()
        var tx2 = await lucid.newTx()
        const index = 0;
        for (let i = 0; i < CartUtxos.length; i++) {

            var utxo: any = await lucid.utxosByOutRef([{ txHash: CartUtxos[i], outputIndex: index }])
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
            console.log("unit", unit)
            console.log("amount", amount)
            console.log("unitFee", unitFee)
            console.log("amountFee", amountFee)
            console.log("unitRoyalty", amount)
            console.log("amountRoyalty", amountRoyalty)
            let price: any = {}
            if (unit === "") {
                price['lovelace'] = amount
            } else {
                price[unit] = amount
            }



            let priceFee: any = {}


            if (unitFee === "") {
                priceFee['lovelace'] = amountFee
            } else {
                priceFee[unit] = amountFee
            }


            let priceRoyalty: any = {}


            if (unitRoyalty === "") {
                priceRoyalty['lovelace'] = amountRoyalty
            } else {
                priceRoyalty[unit] = amountRoyalty
            }




            console.log("redeemerRequest", redeemerRequest)
            console.log("price", price)
            console.log("addressSeller", addressSeller)
            console.log("utxo", utxo)


            console.log("priceFee", priceFee)
            console.log("addressMarketplace", addressMarketplace)


            console.log("priceRoyalty", priceRoyalty)

            // let change = utxo[0].assets['lovelace']
            tx = await tx.collectFrom(utxo, redeemerRequest)
                .payToAddress(addressSeller, price)
                .payToAddress(addressMarketplace, priceFee)
                .payToAddress(addressRoyalty, priceRoyalty)
                // @ts-ignore
                .attachSpendingValidator(marketScript)
            // .payToAddress(addressSeller, { ['lovelace']: change })
            console.log("Tx", tx)
            let change = utxo[0].assets['lovelace']

            tx2 = tx2.payToAddress(addressSeller, { ['lovelace']: change })
        }

        tx = tx.compose(tx2)
        // @ts-ignore
        tx = await tx.complete()
        // @ts-ignore
        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();
        console.log("txHash", txHash)

        if (txHash) {
            const reqData = {
                address: walletAddress,
                entries: {
                    "type": "buy-cart",
                    utxo: txHash
                }
            }

            await postTransaction(reqData)
            return {
                result: "success"
            };
        }
    } catch (err) {
        console.log("err", err)
        return {
            result: "fail",
            error: err
        }
    }

}
