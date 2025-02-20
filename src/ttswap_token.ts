import { Address, BigInt } from "@graphprotocol/graph-ts";

import {
        Customer,
        tts_env,
        tts_auth,
        tts_share,
        tts_chainstake,
} from "../generated/schema";

import {
        e_addreferral,
        e_publicsell,
        e_setenv,
        e_setdaoadmin,
        e_addauths,
        e_rmauths,
        e_addShare,
        e_syncChainStake,
        e_unstake,
        e_updatepool,
        e_burnShare,
        e_shareMint,
} from "../generated/TTSwap_Token/TTSwap_Token";

import { BI_128, ZERO_BI, ONE_BI } from "./util/constants";
import { log_CustomerData } from "./util/customer";

export function handle_e_setenv(event: e_setenv): void {
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;
                ttsenv.normalgoodid = "#";
                ttsenv.valuegoodid = "#";
                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
        }
        ttsenv.normalgoodid = event.params.normalgoodid.toHexString();
        ttsenv.valuegoodid = event.params.valuegoodid.toHexString();
        ttsenv.marketcontract = event.params.marketcontract.toHexString();
        ttsenv.save();
}

export function handle_e_setdaoadmin(event: e_setdaoadmin): void {
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;
                ttsenv.normalgoodid = "#";
                ttsenv.valuegoodid = "#";
                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
        }
        ttsenv.dao_admin = event.params.recipient.toHexString();
        ttsenv.save();
}

export function handle_e_addauths(event: e_addauths): void {
        let ttsauth = tts_auth.load(event.params.auths.toHexString());
        if (ttsauth === null) {
                ttsauth = new tts_auth(event.params.auths.toHexString());
        }
        ttsauth.priv = event.params.priv;
        ttsauth.save();
}

export function handle_e_rmauths(event: e_rmauths): void {
        let ttsauth = tts_auth.load(event.params.auths.toHexString());
        if (ttsauth === null) {
                ttsauth = new tts_auth(event.params.auths.toHexString());
        }
        ttsauth.priv = ZERO_BI;
        ttsauth.save();
}

export function handle_e_addShare(event: e_addShare): void {
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;
                ttsenv.normalgoodid = "#";
                ttsenv.valuegoodid = "#";
                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
        }
        let ttsshare = tts_share.load(event.params.index.toString());
        if (ttsshare === null) {
                ttsshare = new tts_share(event.params.index.toString());
                ttsshare.share_owner = event.params.recipient.toHexString();
                ttsshare.share_leftamount = event.params.leftamount;
                ttsshare.share_metric = event.params.metric;
                ttsshare.share_chips = BigInt.fromU32(event.params.chips);
                ttsshare.save();
        }
        ttsenv.shares_index = ttsenv.shares_index.plus(ONE_BI);
        ttsenv.left_share = ttsenv.left_share.plus(event.params.leftamount);
        ttsenv.save();
}

export function handle_e_shareMint(event: e_shareMint): void {
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;
                ttsenv.normalgoodid = "#";
                ttsenv.valuegoodid = "#";
                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
        }
        ttsenv.left_share = ttsenv.left_share.minus(event.params.mintamount);
        ttsenv.actual_amount = ttsenv.actual_amount.plus(
                event.params.mintamount
        );

        ttsenv.save();

        let ttsshare = tts_share.load(event.params.index.toString());
        if (ttsshare !== null) {
                ttsshare.share_leftamount = ttsshare.share_leftamount.minus(
                        event.params.mintamount
                );
                ttsshare.share_metric = ttsshare.share_metric.plus(ONE_BI);
                ttsshare.save();
        }
}

export function handle_e_burnShare(event: e_burnShare): void {
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;
                ttsenv.normalgoodid = "#";
                ttsenv.valuegoodid = "#";
                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
        }
        let ttsshare = tts_share.load(event.params.index.toString());
        if (ttsshare === null) {
                ttsshare = new tts_share(event.params.index.toString());
                ttsshare.share_owner = "#";
                ttsshare.share_leftamount = ZERO_BI;
                ttsshare.share_metric = ZERO_BI;
                ttsshare.share_chips = ZERO_BI;
        }

        ttsenv.left_share = ttsenv.left_share.minus(ttsshare.share_leftamount);
        ttsenv.save();
        ttsshare.share_owner = "#";
        ttsshare.share_leftamount = ZERO_BI;
        ttsshare.share_metric = ZERO_BI;
        ttsshare.share_chips = ZERO_BI;
        ttsshare.save();
}

export function handle_e_addreferer(event: e_addreferral): void {
        let newcustomer = Customer.load(event.params.users.toHexString());
        if (newcustomer === null) {
                newcustomer = new Customer(event.params.users.toHexString());
                newcustomer.tradeValue = ZERO_BI;
                newcustomer.investValue = ZERO_BI;
                newcustomer.disinvestValue = ZERO_BI;
                newcustomer.tradeCount = ZERO_BI;
                newcustomer.investCount = ZERO_BI;
                newcustomer.disinvestCount = ZERO_BI;
                newcustomer.userConfig = ZERO_BI;
                newcustomer.refer = "#";
                newcustomer.customerno = ZERO_BI;
                newcustomer.totalprofitvalue = ZERO_BI;
                newcustomer.totalcommissionvalue = ZERO_BI;
                newcustomer.referralnum = ZERO_BI;
                newcustomer.stakettsvalue = ZERO_BI;
                newcustomer.stakettscontruct = ZERO_BI;
                newcustomer.getfromstake = ZERO_BI;
        }

        newcustomer.refer = event.params.referral.toHexString();
        newcustomer.lastoptime = event.block.timestamp;
        newcustomer.save();
        log_CustomerData(newcustomer, event.block.timestamp);
        let referralcus = Customer.load(event.params.referral.toHexString());
        if (referralcus === null) {
                referralcus = new Customer(event.params.users.toHexString());
                referralcus.tradeValue = ZERO_BI;
                referralcus.investValue = ZERO_BI;
                referralcus.disinvestValue = ZERO_BI;
                referralcus.tradeCount = ZERO_BI;
                referralcus.investCount = ZERO_BI;
                referralcus.disinvestCount = ZERO_BI;
                referralcus.userConfig = ZERO_BI;
                referralcus.refer = "#";
                referralcus.customerno = ZERO_BI;
                referralcus.totalprofitvalue = ZERO_BI;
                referralcus.totalcommissionvalue = ZERO_BI;
                referralcus.referralnum = ZERO_BI;
                referralcus.stakettsvalue = ZERO_BI;
                referralcus.stakettscontruct = ZERO_BI;
                referralcus.getfromstake = ZERO_BI;
        }
        referralcus.referralnum = referralcus.referralnum.plus(ONE_BI);
        referralcus.save();
}

export function handle_e_publicsell(event: e_publicsell): void {
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;
                ttsenv.normalgoodid = "#";
                ttsenv.valuegoodid = "#";
                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
        }
        ttsenv.publicsell = ttsenv.publicsell.plus(event.params.ttsamount);
        ttsenv.usdt_amount = ttsenv.usdt_amount.plus(event.params.usdtamount);
        ttsenv.actual_amount = ttsenv.actual_amount.plus(
                event.params.ttsamount
        );
        ttsenv.save();
}

export function handle_e_unstake(event: e_unstake): void {
        let newcustomer = Customer.load(event.params.recipient.toHexString());
        if (newcustomer === null) {
                newcustomer = new Customer(
                        event.params.recipient.toHexString()
                );
                newcustomer.tradeValue = ZERO_BI;
                newcustomer.investValue = ZERO_BI;
                newcustomer.disinvestValue = ZERO_BI;
                newcustomer.tradeCount = ZERO_BI;
                newcustomer.investCount = ZERO_BI;
                newcustomer.disinvestCount = ZERO_BI;
                newcustomer.userConfig = ZERO_BI;
                newcustomer.refer = "#";
                newcustomer.customerno = ZERO_BI;
                newcustomer.totalprofitvalue = ZERO_BI;
                newcustomer.totalcommissionvalue = ZERO_BI;
                newcustomer.referralnum = ZERO_BI;
                newcustomer.stakettsvalue = ZERO_BI;
                newcustomer.stakettscontruct = ZERO_BI;
                newcustomer.getfromstake = ZERO_BI;
        }
        let proofvalue = event.params.proofvalue.div(BI_128);
        let proofcontrunct = event.params.proofvalue.mod(BI_128);

        let profit = event.params.unstakestate.mod(BI_128);
        newcustomer.getfromstake = newcustomer.getfromstake.plus(profit);
        newcustomer.stakettsvalue = proofvalue;
        newcustomer.stakettscontruct = proofcontrunct;
        newcustomer.save();

        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;
                ttsenv.normalgoodid = "#";
                ttsenv.valuegoodid = "#";
                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
        }
        ttsenv.actual_amount = ttsenv.actual_amount.plus(profit);
        ttsenv.poolcontruct = event.params.poolstate.mod(BI_128);
        ttsenv.poolvalue = event.params.stakestate.mod(BI_128);
        ttsenv.poolasset = event.params.poolstate.div(BI_128);
        ttsenv.save();
}
export function handle_e_updatepool(event: e_updatepool): void {
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;
                ttsenv.normalgoodid = "#";
                ttsenv.valuegoodid = "#";
                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
        }
        ttsenv.lasttime = event.block.timestamp;
        ttsenv.lsttime = event.params.poolstate.div(BI_128);
        ttsenv.poolasset = event.params.poolstate.mod(BI_128);
        ttsenv.save();
}

export function handle_e_syncChainStake(event: e_syncChainStake): void {
        let poolvalue = event.params.proofstate.div(BI_128);
        let construct = event.params.proofstate.mod(BI_128);
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;
                ttsenv.normalgoodid = "#";
                ttsenv.valuegoodid = "#";
                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
        }

        let chainstake = tts_chainstake.load(event.params.chain.toString());
        if (chainstake === null) {
                chainstake = new tts_chainstake(event.params.chain.toString());
                chainstake.chainvalue = ZERO_BI;
                chainstake.chaincontruct = ZERO_BI;
                chainstake.poolasset = ZERO_BI;
                chainstake.totalasset = ZERO_BI;
        }
        ttsenv.poolvalue = ttsenv.poolvalue.minus(chainstake.chainvalue);
        chainstake.chainvalue = poolvalue;
        ttsenv.poolvalue = ttsenv.poolvalue.plus(chainstake.chainvalue);

        ttsenv.poolcontruct = ttsenv.poolcontruct.minus(
                chainstake.chaincontruct
        );
        chainstake.chaincontruct = construct;
        ttsenv.poolcontruct = ttsenv.poolcontruct.plus(
                chainstake.chaincontruct
        );

        ttsenv.poolasset = ttsenv.poolasset.minus(event.params.poolasset);

        chainstake.poolasset = chainstake.poolasset.plus(
                event.params.poolasset
        );
        chainstake.totalasset = chainstake.totalasset.plus(
                event.params.poolasset
        );
        chainstake.save();

        ttsenv.lasttime = event.block.timestamp;
        ttsenv.save();
}
