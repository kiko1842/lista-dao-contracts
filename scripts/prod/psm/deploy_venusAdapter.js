const {ethers, upgrades, run} = require('hardhat')
const hre = require('hardhat')

let usdt = '0x55d398326f99059fF775485246999027B3197955';
let vusdt = "0xfD5840Cd36d94D7229439859C0112a4185BC0255";
let feeReceiver = "0x34B504A5CF0fF41F8A480580533b6Dda687fa3Da";

async function main() {
    const signers = await hre.ethers.getSigners();
    const deployer = signers[0].address;
    const admin = deployer;
    const manager = deployer;
    const token = usdt;
    const vToken = vusdt;
    // todo
    const vaultManagerAddress = "";
    const VenusAdapter = await hre.ethers.getContractFactory('VenusAdapter');
    const venusAdapter = await upgrades.deployProxy(VenusAdapter, [
        admin,
        manager,
        vaultManagerAddress,
        token,
        vToken,
        feeReceiver
    ]);

    await venusAdapter.waitForDeployment();

    const venusAdapterAddress = await venusAdapter.getAddress();

    try {
        await run("verify:verify", {
            address: venusAdapterAddress,
        });
    } catch (error) {
        console.error('error verifying contract:', error);
    }
    console.log(`VenusAdapter USDT deployed to:`, venusAdapterAddress);

    const vaultManagerContract = await ethers.getContractAt('VaultManager', vaultManagerAddress);

    await vaultManagerContract.addAdapter(venusAdapterAddress, 100);

    console.log('VenusAdapter deploy and setup done')
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
