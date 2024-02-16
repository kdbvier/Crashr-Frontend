import { Constr, Data, Lucid, fromHex, toHex } from "lucid-cardano";
import { encode } from 'cbor-x';
import data from './plutus.json';
import axios from "axios";
import { postTransaction } from "@/api/api";
import { COLLECTIONS_ROYALTIES_CONSTANT } from "@/constants/collections.royalties.constant";

/**
 * The `listNFTByAddress` function lists NFTs for a given address on a marketplace by creating and
 * submitting a transaction.
 * @param {string} address - The `address` parameter is a string representing the address of the user
 * who wants to list their NFTs for sale.
 * @param {Lucid} lucid - The `lucid` parameter is an object that represents the Lucid smart contract
 * platform. It provides various utility functions and methods for interacting with the Lucid
 * blockchain.
 * @param {string[]} assets - An array of strings representing the assets (NFTs) to be listed for sale.
 * @param {number} price - The `price` parameter is the price at which the NFTs will be listed for
 * sale. It is a number representing the price in a specific currency or unit.
 * @returns a boolean value. If the transaction hash (txHash) is successfully generated, the function
 * returns true. Otherwise, it returns false.
 */
export const listNFTByAddress = async (
  address: string, lucid: Lucid, assets: string[], nftPrice: number, NFTData: NFTDataProps[], royaltyAmount?: number
) => {
  console.log("NFTData", NFTData);
  // const royaltyAmount = 5;
  try {
    const marketScript = {
      type: "PlutusV2",
      script: toHex(encode(fromHex(data.validators[0].compiledCode)))
    };

    console.log("marketScript", marketScript);

    // @ts-ignore
    const validatorHash = await lucid.utils.validatorToScriptHash(marketScript);
    console.log("validator hash");
    console.log(validatorHash);
    const CredentialSC = await lucid.utils.scriptHashToCredential(validatorHash);

    const { paymentCredential, stakeCredential } = await lucid.utils.getAddressDetails(
      address
    );
    console.log("credentials");
    if (!paymentCredential || !stakeCredential) {
      console.error("Payment or stake credential is undefined");
      return false; // or handle the error in an appropriate way
    }

    console.log(paymentCredential.hash);
    console.log(stakeCredential.hash);
    const addressRequest = lucid.utils.credentialToAddress(CredentialSC);
    const payment_vkh = new Constr(0, [paymentCredential.hash]);
    const staking_vkh = new Constr(0, [stakeCredential.hash]);
    const staking_inline = new Constr(0, [new Constr(0, [staking_vkh])]);
    const addressCbor = new Constr(0, [payment_vkh, staking_inline]);
    console.log(addressCbor); // THIS IS FOR SELLER

    // Let's calculate the fees address

    // @ts-ignore
    const payment_vkh2 = new Constr(0, [lucid.utils.getAddressDetails("addr1qyh9zj324a8j4uzd8t0wp4akgsa59pe8ex98j44ql3kcvd5x8n87hfmk3nu27q920sp28y0m0g4fvn3pxhc93mp6f78scg8duf").paymentCredential.hash]);
    // @ts-ignore
    const staking_vkh2 = new Constr(0, [lucid.utils.getAddressDetails("addr1qyh9zj324a8j4uzd8t0wp4akgsa59pe8ex98j44ql3kcvd5x8n87hfmk3nu27q920sp28y0m0g4fvn3pxhc93mp6f78scg8duf").stakeCredential.hash]); // secondo me qua è 0
    const staking_inline2 = new Constr(0, [new Constr(0, [staking_vkh2])]);
    const addressCbor2 = new Constr(0, [payment_vkh2, staking_inline2]);

    let royaltyCbor;
    if (royaltyAmount && royaltyAmount > 0 && NFTData) {
      // @ts-ignore
      const royaltyAddr = COLLECTIONS_ROYALTIES_CONSTANT[NFTData[0].asset.slice(0, 56)];
      console.log("royaltyAddr", royaltyAddr);
      // @ts-ignore
      const payment_vkh3 = new Constr(0, [lucid.utils.getAddressDetails(royaltyAddr).paymentCredential.hash]);
      // @ts-ignore
      const staking_vkh3 = new Constr(0, [lucid.utils.getAddressDetails(royaltyAddr).stakeCredential.hash]); // secondo me qua è 0
      const staking_inline3 = new Constr(0, [new Constr(0, [staking_vkh3])]);
      royaltyCbor = new Constr(0, [payment_vkh3, staking_inline3]);
    }

    console.log("royaltyCbor", royaltyCbor);

    let price = nftPrice * 1000000;
    let fee = 199 * price / 10000;

    let royalty = 0;
    if (royaltyAmount && royaltyAmount > 0) {
      royalty = (price * royaltyAmount) / 100;
    }

    if (fee < 1000000) { fee = 1000000; }
    price = price - fee - royalty;

    console.log("price", price);

    let datumRequest;
    if (royaltyAmount && royaltyAmount > 0) {
      // @ts-ignore
      datumRequest = Data.to(new Constr(0,
        [addressCbor, // policy Borrower
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
        [addressCbor, // policy Borrower
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

    const tx = await lucid
      .newTx()
      .payToContract(addressRequest, { inline: datumRequest }, nfts)
      .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    console.log("txHash", txHash);
    if (txHash) {
      const reqData = {
        address: address,
        entries: {
          "type": "list-nft",
          "address": address,
          "nfts": NFTData,
          utxo: txHash
        }
      };
      await postTransaction(reqData);
      const response = await axios.post("https://ju8sg42zcd.execute-api.us-west-2.amazonaws.com/test", JSON.stringify(reqData, (_, v) => typeof v === 'bigint' ? v.toString() : v));
      if (response) {
        console.log("aaa response", response);

        return {
          result: "success"
        };
      }
    }
  } catch (err) {
    console.log("err", err);
    return {
      result: "fail",
      error: err
    };
  }
};
