import { Constr, Data, Lucid, fromHex, toHex } from "lucid-cardano";
import { encode } from 'cbor-x';
import data from './plutus.json';
import axios from "axios";
import { postTransaction } from "@/api/api";
import { COLLECTIONS_ROYALTIES_CONSTANT } from "@/constants/collections.royalties.constant";

export const editListedNFT = async (
  address: string, lucid: Lucid, nftPrice: number, assets: string[], utxoValue: string, nftData: NFTDataProps[], royaltyAmount?: number
) => {
  console.log("assets", assets);
  try {
    const marketScript = {
      type: "PlutusV2",
      script: toHex(encode(fromHex(data.validators[0].compiledCode)))
    };

    // @ts-ignore
    const validatorHash = await lucid.utils.validatorToScriptHash(marketScript);
    console.log("validator hash");
    console.log(validatorHash);
    const CredentialSC = lucid.utils.scriptHashToCredential(validatorHash);

    let api = undefined;

    let { paymentCredential, stakeCredential } = await lucid.utils.getAddressDetails(
      address
    );
    if (!paymentCredential || !stakeCredential) {
      console.error("Payment or stake credential is undefined");
      return false; // or handle the error in an appropriate way
    }

    const addressRequest = await lucid.utils.credentialToAddress(CredentialSC);
    const payment_vkh = new Constr(0, [paymentCredential.hash]);
    const staking_vkh = new Constr(0, [stakeCredential.hash]); // secondo me qua è 0
    const staking_inline = new Constr(0, [new Constr(0, [staking_vkh])]);
    const addressCbor = new Constr(0, [payment_vkh, staking_inline]);
    console.log(addressCbor); // THIS IS FOR SELLER

    // let's calculate the fees

    // @ts-ignore
    const payment_vkh2 = new Constr(0, [lucid.utils.getAddressDetails("addr1qyh9zj324a8j4uzd8t0wp4akgsa59pe8ex98j44ql3kcvd5x8n87hfmk3nu27q920sp28y0m0g4fvn3pxhc93mp6f78scg8duf").paymentCredential.hash]);
    // @ts-ignore
    const staking_vkh2 = new Constr(0, [lucid.utils.getAddressDetails("addr1qyh9zj324a8j4uzd8t0wp4akgsa59pe8ex98j44ql3kcvd5x8n87hfmk3nu27q920sp28y0m0g4fvn3pxhc93mp6f78scg8duf").stakeCredential.hash]); // secondo me qua è 0
    const staking_inline2 = new Constr(0, [new Constr(0, [staking_vkh2])]);
    const addressCbor2 = new Constr(0, [payment_vkh2, staking_inline2]);

    let royaltyCbor;
    if (royaltyAmount && royaltyAmount > 0 && nftData[0]) {
      // @ts-ignore
      const royaltyAddr = COLLECTIONS_ROYALTIES_CONSTANT[nftData[0].asset.slice(0, 56)];
      console.log("royaltyAddr", royaltyAddr);
      // @ts-ignore
      const payment_vkh3 = new Constr(0, [lucid.utils.getAddressDetails(royaltyAddr).paymentCredential.hash]);
      // @ts-ignore
      const staking_vkh3 = new Constr(0, [lucid.utils.getAddressDetails(royaltyAddr).stakeCredential.hash]); // secondo me qua è 0
      const staking_inline3 = new Constr(0, [new Constr(0, [staking_vkh3])]);
      royaltyCbor = new Constr(0, [payment_vkh3, staking_inline3]);
    }

    console.log("royaltyCbor", royaltyCbor);

    // THIS IS VERY IMPORTANT
    // NOW LET'S SET
    var redeemerRequest = Data.to(
      new Constr(0, [])
    );

    console.log("royaltyCbor", royaltyCbor);

    let price = nftPrice * 1000000;
    let fee = 199 * price / 10000;

    let royalty = 0; // Default value
    if (royaltyAmount && royaltyAmount > 0) {
      royalty = (price * royaltyAmount) / 100;
    }

    if (fee < 1000000) {
      fee = 1000000;
    }
    price = price - fee - royalty;

    console.log("price", price);

    let datumRequest;
    if (royaltyAmount && royaltyAmount > 0) {
      // @ts-ignore
      datumRequest = Data.to(new Constr(0,
        [
          addressCbor, // policy Borrower
          "",          // HERE THE POLICY OF THE TOKEN, if ADA is empty
          "",          // HERE THE ASSETNAME IN HEX, if ADA is empty
          BigInt(price), // HERE THE PRICE BEWARE OF DECIMALS
          royaltyCbor,  // policy Borrower
          "",          // HERE THE POLICY OF THE TOKEN, if ADA is empty
          "",          // HERE THE ASSETNAME IN HEX, if ADA is empty
          BigInt(royalty), // HERE THE PRICE BEWARE OF DECIMALS
          addressCbor2,
          "",          // HERE THE POLICY OF THE TOKEN, if ADA is empty
          "",          // HERE THE ASSETNAME IN HEX, if ADA is empty
          BigInt(fee), // HERE THE PRICE BEWARE OF DECIMALS
        ])
      );
    } else {
      datumRequest = Data.to(new Constr(0,
        [
          addressCbor, // policy Borrower
          "",          // HERE THE POLICY OF THE TOKEN, if ADA is empty
          "",          // HERE THE ASSETNAME IN HEX, if ADA is empty
          BigInt(price / 2), // HERE THE PRICE BEWARE OF DECIMALS
          addressCbor, // policy Borrower
          "",          // HERE THE POLICY OF THE TOKEN, if ADA is empty
          "",          // HERE THE ASSETNAME IN HEX, if ADA is empty
          BigInt(price / 2), // HERE THE PRICE BEWARE OF DECIMALS
          addressCbor2,
          "",          // HERE THE POLICY OF THE TOKEN, if ADA is empty
          "",          // HERE THE ASSETNAME IN HEX, if ADA is empty
          BigInt(fee), // HERE THE PRICE BEWARE OF DECIMALS
        ])
      );
    }

    console.log(datumRequest);

    let nfts: any = {};
    // This is the unit of the NFT I want to sell policyid+assetname
    for (let i = 0; i < assets.length; i++) {
      nfts[assets[i]] = BigInt(1);
    }

    console.log("nfts", nfts);

    // THIS IS THE TXHASH OF THE LISTING TO BE EDITED
    const utxoHash = utxoValue;
    const index = 0;
    var utxo = await lucid.utxosByOutRef([{ txHash: utxoHash, outputIndex: index }]);
    console.log(utxo);

    const tx = await lucid
      .newTx()
      .collectFrom(utxo, redeemerRequest)
      // @ts-ignore
      .attachSpendingValidator(marketScript)
      .addSignerKey(paymentCredential.hash)
      .payToContract(addressRequest, { inline: datumRequest }, nfts)
      .complete();

    console.log(tx);

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    console.log(txHash);
    if (txHash) {
      const reqData = {
        address: address,
        entries: {
          "type": "edit-nft",
          "address": address,
          "nfts": nftData,
          utxo: txHash
        }
      };
      await postTransaction(reqData);
      const response = await axios.post("https://ju8sg42zcd.execute-api.us-west-2.amazonaws.com/test", JSON.stringify(reqData, (_, v) => typeof v === 'bigint' ? v.toString() : v));
      if (response) {
        await postTransaction(reqData);
        return {
          result: "success"
        };
      }
    }
  } catch (err) {
    console.log('Error editListedNFT', err);
    return false;
  }
};
