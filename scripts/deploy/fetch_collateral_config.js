const assert = require('assert');
const {getProxyAdminAddress} = require('../upgrades/utils/upgrade_utils')
//const allConfig = require('./check_new_collateral.json');
const allConfig = require('./fetch_collateral_config_prod.json');
const {ethers} = require("hardhat");
const hre = require("hardhat");
const contractAddresses = require("./contract_address.json");

async function main() {
    const {
        VAT,
        DOG,
        SPOT,
        INTERACTION,
        VOW,
        ABACI,
        JUG
    } = (hre.network.name === 'bsc_testnet') ? contractAddresses["testnet"] : contractAddresses["mainnet"];

    const PROXY_ADMIN_ABI = ["function transferOwnership(address newOwner) public","function owner() public view returns (address)"]
    this.GemJoin = await hre.ethers.getContractFactory('GemJoin')
    const gemJoinContract = this.GemJoin.attach(allConfig["gemJoin"])

    const gemJoinGem = await gemJoinContract.gem();

    console.log("[gemJoin] check gem address ok:::", gemJoinGem);

    const gemJoinIlk = await gemJoinContract.ilk();

    console.log("[gemJoin] check ilk ok:::", gemJoinIlk);


    const gemJoinVat = await gemJoinContract.vat();

    console.log("[gemJoin] check vat ok:::", gemJoinVat)

    const gemJoinProxyAdminAddress = await getProxyAdminAddress(allConfig["gemJoin"]);

    console.log('[gemJoin] proxy admin ok:::', gemJoinProxyAdminAddress);


    let gemJoinProxyAdmin = await ethers.getContractAt(PROXY_ADMIN_ABI, gemJoinProxyAdminAddress);

    const gemJoinProxyAdminOwner = await gemJoinProxyAdmin.owner();

    console.log('[gemJoin] proxy admin owner ok:::', gemJoinProxyAdminOwner);


    this.Clipper = await hre.ethers.getContractFactory('Clipper')
    const clipperContract = this.Clipper.attach(allConfig["clipper"])

    const clipperVat = await clipperContract.vat();



    const clipperSpot = await clipperContract.spotter();


    const clipperDog = await clipperContract.dog();

    const clipperIlk = await clipperContract.ilk();



    const clipperVow = await clipperContract.vow();


    const clipperCalc = await clipperContract.calc();


    const clipperBuf = await clipperContract.buf();

    console.log("[clipper] buf ok:::", clipperBuf);

    const clipperTail = await clipperContract.tail();
    console.log("[clipper] tail ok:::", clipperTail);



    const clipperCusp = await clipperContract.cusp();
    console.log("[clipper] cusp ok:::", clipperCusp);


    const clipperChip = await clipperContract.chip();
    console.log("[clipper] chip ok:::", clipperChip);

    const clipperTip = await clipperContract.tip();
    console.log("[clipper] tip ok:::", clipperTip);




    const clipperStopped = await clipperContract.stopped();
    console.log("[clipper] stopped ok:::", clipperStopped);



    const clipperProxyAdminAddress = await getProxyAdminAddress(allConfig["clipper"]);
    console.log('[clipper] proxy admin ok:::', clipperProxyAdminAddress);


    let clipperProxyAdmin = await ethers.getContractAt(PROXY_ADMIN_ABI, gemJoinProxyAdminAddress);

    const clipperProxyAdminOwner = await clipperProxyAdmin.owner();
    console.log('[clipper] proxy admin owner ok:::', clipperProxyAdminOwner);



    const oracleProxyAdminAddress = await getProxyAdminAddress(allConfig["oracle"]);
    console.log('[oracle] proxy admin ok:::', oracleProxyAdminAddress);




    let oracleProxyAdmin = await ethers.getContractAt(PROXY_ADMIN_ABI, oracleProxyAdminAddress);

    const oracleProxyAdminOwner = await oracleProxyAdmin.owner();

    console.log('[oracle] proxy admin owner ok:::', oracleProxyAdminOwner);


    this.Spotter = await hre.ethers.getContractFactory('Spotter')
    const spotContract = this.Spotter.attach(SPOT)

    let spotIlk = await spotContract['ilks(bytes32)'](allConfig["ilk"]);


    console.log("[spot] mat ok:::", spotIlk[1]);

    this.Vat = await hre.ethers.getContractFactory('Vat')
    const vatContract = this.Vat.attach(VAT)

    let vatGemJoinRely = await vatContract['wards(address)'](allConfig["gemJoin"]);
    let vatClipperRely = await vatContract['wards(address)'](allConfig["clipper"]);

    let vatIlk = await vatContract['ilks(bytes32)'](allConfig["ilk"]);



    console.log("[vat] line ok:::", vatIlk[3]);
    console.log("[vat] dust ok:::", vatIlk[4]);


    this.Dog = await hre.ethers.getContractFactory('Dog')
    const dogContract = this.Dog.attach(DOG)

    let dogClipperRely = await dogContract['wards(address)'](allConfig["clipper"]);

    let dogIlk = await dogContract['ilks(bytes32)'](allConfig["ilk"]);


    console.log("[dog] chop ok:::", dogIlk[1]);
    console.log("[dog] hole ok:::", dogIlk[2]);


    this.Jug = await hre.ethers.getContractFactory('Jug')
    const jugContract = this.Jug.attach(JUG)

    let jugIlk = await jugContract['ilks(bytes32)'](allConfig["ilk"]);

    console.log("[jug] duty ok:::", jugIlk[0]);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
