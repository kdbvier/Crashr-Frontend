import { Constr, Data, Lucid, fromHex, toHex } from "lucid-cardano";
import { encode } from 'cbor-x';
import data from './plutus.json';
import axios from "axios";
import { POLICYID_ASSET_LIST } from "@/constants/document";
import { postTransaction } from "@/api/api";

export const makeAnOfferForNFT = async (
    address: string, lucid: Lucid, nftPrice: number, nftPolicyId: string, nftAsset: string, tokenType: string, offerNFTs: string[], NFTData: NFTDataProps[], owner: string, royaltyAmount?: number
) => {
    try {
        const marketScript = {
            type: "PlutusV2",
            script: toHex(encode(fromHex(data.validators[0].compiledCode)))
        };

        console.log("marketScript", marketScript)

        // @ts-ignore
        const validatorHash = await lucid.utils.validatorToScriptHash(marketScript);
        console.log("validator hash")
        console.log(validatorHash)
        const CredentialSC = await lucid.utils.scriptHashToCredential(validatorHash);

        // window.owner = await lucid.wallet.address()
        const { paymentCredential, stakeCredential } = await lucid.utils.getAddressDetails(
            address
        );

        if (!paymentCredential) {
            console.error("Payment credential is undefined");
            return false; // or handle the error in an appropriate way
        }
        if (!stakeCredential) {
            console.error("stakeCredential  is undefined");
            return false; // or handle the error in an appropriate way
        }
        console.log("credentials")
        console.log(paymentCredential.hash)
        console.log(stakeCredential.hash)


        const addressRequest = await lucid.utils.credentialToAddress(CredentialSC);
        const payment_vkh = new Constr(0, [paymentCredential.hash]);
        const staking_vkh = new Constr(0, [stakeCredential.hash]); //secondo me qua è 0
        const staking_inline = new Constr(0, [new Constr(0, [staking_vkh])])
        const addressCbor = new Constr(0, [payment_vkh, staking_inline])
        console.log(addressCbor) //THIS IS FOR SELLER

        //let's calculate the fees address
        // @ts-ignore
        const payment_vkh2 = new Constr(0, [lucid.utils.getAddressDetails("addr1qyh9zj324a8j4uzd8t0wp4akgsa59pe8ex98j44ql3kcvd5x8n87hfmk3nu27q920sp28y0m0g4fvn3pxhc93mp6f78scg8duf").paymentCredential.hash]);
        // @ts-ignore
        const staking_vkh2 = new Constr(0, [lucid.utils.getAddressDetails("addr1qyh9zj324a8j4uzd8t0wp4akgsa59pe8ex98j44ql3kcvd5x8n87hfmk3nu27q920sp28y0m0g4fvn3pxhc93mp6f78scg8duf").stakeCredential.hash]); //secondo me qua è 0
        const staking_inline2 = new Constr(0, [new Constr(0, [staking_vkh2])])
        const addressCbor2 = new Constr(0, [payment_vkh2, staking_inline2])


        let offer = nftPrice * Math.pow(10, POLICYID_ASSET_LIST[tokenType].decimals)
        let fee;

        // if nft offer
        if (offerNFTs.length > 0) {
            fee = 5000000

        } else {
            // if ada offer
            if (tokenType === "ADA") {
                fee = 199 * offer / 10000

                fee = fee * 50 / 100

                if (fee < 1000000) { fee = 1000000 }
                // token offer
            } else {
                fee = 5000000
            }
        }
        console.log("fee amount", fee)


        var datumRequest = Data.to(new Constr(0,
            [addressCbor,//policy Borrower
                nftPolicyId,//HERE THE POLICY OF THE TOKEN, if ADA is empty
                nftAsset,//HERE THE ASSETNAME IN HEX, if ADA is empty
                BigInt(1),//HERE THE PRICE BEWARE OF DECIMALES
                addressCbor2,//policy Borrower
                "",//HERE THE POLICY OF THE TOKEN, if ADA is empty
                "",//HERE THE ASSETNAME IN HEX, if ADA is empty
                BigInt(fee),//HERE THE PRICE BEWARE OF DECIMALES
                addressCbor2,
                "",//HERE THE POLICY OF THE TOKEN, if ADA is empty
                "",//HERE THE ASSETNAME IN HEX, if ADA is empty
                BigInt(fee),//HERE THE PRICE BEWARE OF DECIMALES
            ])
        );
        console.log(datumRequest)

        console.log("datumRequest", datumRequest)
        let nfts: any = {}
        // if nft offer
        if (offerNFTs.length > 0) {
            for (let i = 0; i < offerNFTs.length; i++) {
                nfts[offerNFTs[i]] = BigInt(1);
            }

        } else {
            // if ada offer
            if (tokenType === "ADA") {
                nfts['lovelace'] = BigInt(offer)
            } else {
                // if token offer
                const polAssetValue = POLICYID_ASSET_LIST[tokenType].policyId + POLICYID_ASSET_LIST[tokenType].asset
                console.log("polAssetValue, offer", polAssetValue, offer)
                nfts[polAssetValue] = BigInt(offer)
            }
        }
        console.log("nfts", nfts)
        let tx = await lucid
            .newTx()
            .payToContract(addressRequest, { inline: datumRequest }, nfts)
            .complete();


        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();
        console.log(txHash)
        if (txHash) {
            const reqData = {
                address: address,
                entries: {
                    "type": "offer-nft",
                    "address": address,
                    "nfts": NFTData
                }

            }
            await postTransaction(reqData)
            const response = await axios.post("https://ju8sg42zcd.execute-api.us-west-2.amazonaws.com/test", JSON.stringify(reqData, (_, v) => typeof v === 'bigint' ? v.toString() : v))
            if (owner !== '') {
                const reqData2 = {
                    address: owner,
                    entries: {
                        "type": "offer-nft",
                        "address": address,
                        "nfts": NFTData
                    },
                    utxo: txHash
                }
                await postTransaction(reqData2)
                const response2 = await axios.post("https://ju8sg42zcd.execute-api.us-west-2.amazonaws.com/test", JSON.stringify(reqData2, (_, v) => typeof v === 'bigint' ? v.toString() : v))
            }
            if (response) {
                return true;
            }
            if (response) {
                return true;
            }
        }

    } catch (err) {
        console.log("Error makeAnOfferForNFT", err)
    }
}