//import ether from './helpers/Ether';
/* Node.js uses CommonJS module syntax, otherwise will get compiler errors*/
const ether = require('./helpers/Ether');
const EVMrevert = require('./helpers/EVMrevert');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const AvsToken = artifacts.require('AvsToken');
const AvsTokenCrowdsale = artifacts.require('AvsTokenCrowdsale');

contract('AvsTokenCrowdsale', function([_, wallet, investor1, investor2]) {

  beforeEach(async function() {
    // Token config
    this.name = "AvsToken";
    this.symbol = "AvS";
    this.decimals = 18;

    // Deploy Token
    this.token = await AvsToken.new(
      this.name,
      this.symbol,
      this.decimals
    );

    // Crowdsale config
    this.rate = 500;
    this.wallet = wallet;
    this.cap = ether(100);

    // Investor Min & Max caps
    this.investorMinCap = ether(0.002);
    this.investorMaxCap = ether(50);

    this.crowdsale = await AvsTokenCrowdsale.new(
      this.rate,
      this.wallet,
      this.token.address,
      this.cap
    );

   // Transfer token ownership to crowdsale
    await this.token.transferOwnership(this.crowdsale.address);
  });

  describe('crowdsale', function() {
    it('tracks the rate', async function() {
      const rate = await this.crowdsale.rate();
      rate.should.be.bignumber.equal(this.rate);
    });

    it('tracks the wallet', async function() {
      const wallet = await this.crowdsale.wallet();
      wallet.should.equal(this.wallet);
    });

    it('tracks the token', async function() {
      const token = await this.crowdsale.token();
      token.should.equal(this.token.address);
    });
  });

  describe('minted crowdsale', function() {
    it('mints tokens after purchase', async function() {
      const originalTotalSupply = await this.token.totalSupply();
      await this.crowdsale.sendTransaction({ value: ether(1), from: investor1 });
      const newTotalSupply = await this.token.totalSupply();
      assert.isTrue(newTotalSupply > originalTotalSupply);
    });
  });

  describe('capped crowdsale', async function() {
    it('has correct hard cap', async function() {
      const cap = await this.crowdsale.cap();
      cap.should.be.bignumber.equal(this.cap);
    });
  });

  describe('buyTokens()', function() {
    describe('if contribution is less than the min cap', function() {
      it('rejects the transaction', async function() {
        const value = this.investorMinCap - 1;
        await this.crowdsale.buyTokens(investor2, {value: value, from: investor2}).should.be.rejectedWith(EVMrevert);
      });
    });

    describe('when the investor has already met the min cap', function() {
      it('allows investor contribute below the min cap', async function() {
        const value1 = ether(1);
        await this.crowdsale.buyTokens(investor1, {value: value1, from: investor1});
        const value2 = 1; // 1 wei
        await this.crowdsale.buyTokens(investor1, {value: value2, from: investor1}).should.be.fulfilled;
      });
    });
    
    describe('if the total contributions exceed the max cap', function() {
      it('rejects the transaction', async function() {
        //first contribution is in a valid range
        const value = ether(2);
        await this.crowdsale.buyTokens(investor1, {value: value, from: investor1});
        //second contribution sends total contribution over the max cap
        const value2 = ether(49);
        await this.crowdsale.buyTokens(investor1, {value: value2, from: investor1}).should.be.rejectedWith(EVMrevert);
      });
    });

    describe('if the contibution is within the allowed limits', function() {
      it('succeeds and updates the contribution amount', async function() {
          const value = ether(2);
          await this.crowdsale.buyTokens(investor2, {value: value, from: investor2}).should.be.fulfilled;
          const contribution = await this.crowdsale.getUserContribution(investor2);
          contribution.should.be.bignumber.equal(value);
      })
    })

  });

  describe('accepting payments', function() {
    it('should accept payments', async function() {
      const value = ether(1);
      const purchaser = investor2;
      await this.crowdsale.sendTransaction({ value: value, from: investor1 }).should.be.fulfilled;
      await this.crowdsale.buyTokens(investor1, { value: value, from: purchaser }).should.be.fulfilled;
    });
  });
});

