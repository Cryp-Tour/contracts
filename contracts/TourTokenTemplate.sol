pragma solidity 0.8.6;
// Based on Copyright BigchainDB GmbH and Ocean Protocol contributors
// SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
// Code is Apache-2.0 and docs are CC-BY-4.0

// import './ocean_interfaces/IERC20Template.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import './ocean_interfaces/ITourTokenAdditional.sol';


/**
* @title TourTokenTemplate
*  
* @dev TourTokenTemplate is an ERC20 compliant token template
*      Used by the factory contract as a bytecode reference to 
*      deploy new TourTokens.
*/
contract TourTokenTemplate is ITourTokenAdditional, ERC20 {
    using SafeMath for uint256;

    string private _name; // Need these, because of multiple initializations
    string private _symbol;

    string  private _tourID;
    uint256 private _cap;
    address private _communityFeeCollector;
    bool    private initialized = false;
    address private _minter;
    address private _proposedMinter;
    uint256 public constant BASE = 10**18;
    uint256 public constant BASE_COMMUNITY_FEE_PERCENTAGE = BASE / 1000;
    uint256 public constant BASE_MARKET_FEE_PERCENTAGE = BASE / 1000;

    event OrderStarted(
            address indexed consumer,
            address indexed payer,
            uint256 amount, 
            uint256 serviceId, 
            uint256 timestamp,
            address indexed mrktFeeCollector,
            uint256 marketFee
    );

    event OrderFinished(
            bytes32 orderTxId, 
            address indexed consumer,
            uint256 amount, 
            uint256 serviceId, 
            address indexed provider,
            uint256 timestamp
    );

    event MinterProposed(
        address currentMinter,
        address newMinter
    );

    event MinterApproved(
        address currentMinter,
        address newMinter
    );

    modifier onlyNotInitialized() {
        require(
            !initialized,
            'TourTokenTemplate: token instance already initialized'
        );
        _;
    }
    
    modifier onlyMinter() {
        require(
            msg.sender == _minter,
            'TourTokenTemplate: invalid minter' 
        );
        _;
    }
    
    /**
     * @dev constructor
     *      Called prior contract deployment
     * @param name_ refers to a template TourToken name
     * @param symbol_ refers to a template TourToken symbol
     * @param minterAddress_ refers to an address that has minter role
     * @param cap_ the total ERC20 cap
     * @param tourID_ data string refering to the ID of the Tour
     * @param feeCollector_ it is the community fee collector address
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address minterAddress_,
        uint256 cap_,
        string memory tourID_,
        address feeCollector_
    ) ERC20(name_, symbol_)
    {
        _initialize(
            name_,
            symbol_,
            minterAddress_,
            cap_,
            tourID_,
            feeCollector_
        );
    }
    
    /**
     * @dev Returns the name of the token.
     */
    function name() public view override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view override returns (string memory) {
        return _symbol;
    }
    
    /**
     * @dev initialize
     *      Called prior contract initialization (e.g creating new TourToken instance)
     *      Calls private _initialize function. Only if contract is not initialized.
     * @param name_ refers to a new TourToken name
     * @param symbol_ refers to a nea TourToken symbol
     * @param minterAddress_ refers to an address that has minter rights
     * @param cap_ the total ERC20 cap
     * @param tourID_ data string refering to the resolver for the metadata
     * @param feeCollector_ it is the community fee collector address
     */
    function initialize(
        string calldata name_,
        string calldata symbol_,
        address minterAddress_,
        uint256 cap_,
        string calldata tourID_,
        address feeCollector_
    ) 
        external
        override
        onlyNotInitialized
        returns(bool)
    {
        return _initialize(
            name_,
            symbol_,
            minterAddress_,
            cap_,
            tourID_,
            feeCollector_
        );
    }

    /**
     * @dev _initialize
     *      Private function called on contract initialization.
     * @param name_ refers to a new TourToken name
     * @param symbol_ refers to a nea TourToken symbol
     * @param minterAddress_ refers to an address that has minter rights
     * @param cap_ the total ERC20 cap
     * @param tourID_ data string refering to the resolver for the metadata
     * @param feeCollector_ it is the community fee collector address
     */
    function _initialize(
        string memory name_,
        string memory symbol_,
        address minterAddress_,
        uint256 cap_,
        string memory tourID_,
        address feeCollector_
    )
        private
        returns(bool)
    {
        require(
            minterAddress_ != address(0), 
            'TourTokenTemplate: Invalid minter,  zero address'
        );

        require(
            _minter == address(0), 
            'TourTokenTemplate: Invalid minter, zero address'
        );

        require(
            feeCollector_ != address(0),
            'TourTokenTemplate: Invalid community fee collector, zero address'
        );

        require(
            cap_ != 0,
            'TourTokenTemplate: Invalid cap value'
        );
        _cap = cap_;
        _name = name_;
        _tourID = tourID_;
        _symbol = symbol_;
        _minter = minterAddress_;
        _communityFeeCollector = feeCollector_;
        initialized = true;
        return initialized;
    }

    /**
     * @dev mint
     *      Only the minter address can call it.
     *      msg.value should be higher than zero and gt or eq minting fee
     * @param account refers to an address that token is going to be minted to.
     * @param value refers to amount of tokens that is going to be minted.
     */
    function mint(
        address account,
        uint256 value
    ) 
        external  
        override
        onlyMinter 
    {
        require(
            totalSupply().add(value) <= _cap, 
            'TourTokenTemplate: cap exceeded'
        );
        _mint(account, value);
    }

    /**
     * @dev startOrder
     *      called by payer or consumer prior ordering a service consume on a marketplace.
     * @param consumer is the consumer address (payer could be different address)
     * @param amount refers to amount of tokens that is going to be transfered.
     * @param serviceId service index in the metadata
     * @param mrktFeeCollector marketplace fee collector
     */
    function startOrder(
        address consumer,
        uint256 amount,
        uint256 serviceId,
        address mrktFeeCollector
    )
        external
    {
        require(amount >= BASE, "Amount must be at least 1");
        uint256 marketFee = 0;
        uint256 communityFee = calculateFee(
            amount, 
            BASE_COMMUNITY_FEE_PERCENTAGE
        );
        transfer(_communityFeeCollector, communityFee);
        if(mrktFeeCollector != address(0)){
            marketFee = calculateFee(
                amount, 
                BASE_MARKET_FEE_PERCENTAGE
            );
            transfer(mrktFeeCollector, marketFee);
        }
        uint256 totalFee = communityFee.add(marketFee);
        transfer(_minter, amount.sub(totalFee));
        emit OrderStarted(
            consumer,
            msg.sender,
            amount,
            serviceId,
            /* solium-disable-next-line */
            block.timestamp,
            mrktFeeCollector,
            marketFee
        );
    }

    /**
     * @dev finishOrder
     *      called by provider prior completing service delivery only
     *      if there is a partial or full refund.
     * @param orderTxId refers to the transaction Id  of startOrder acts 
     *                  as a payment reference.
     * @param consumer refers to an address that has consumed that service.
     * @param amount refers to amount of tokens that is going to be transfered.
     * @param serviceId service index in the metadata.
     */
    function finishOrder(
        bytes32 orderTxId, 
        address consumer, 
        uint256 amount,
        uint256 serviceId
    )
        external
    {
        if ( amount != 0 )  
            require(
                transfer(consumer, amount),
                'TourTokenTemplate: failed to finish order'
            );
        
        emit OrderFinished(
            orderTxId, 
            consumer, 
            amount, 
            serviceId, 
            msg.sender,
            /* solium-disable-next-line */
            block.timestamp
        );
    }

    /**
     * @dev proposeMinter
     *      It proposes a new token minter address.
     *      Only the current minter can call it.
     * @param newMinter refers to a new token minter address.
     */
    function proposeMinter(address newMinter) 
        external 
        override
        onlyMinter 
    {
        _proposedMinter = newMinter;
        emit MinterProposed(
            msg.sender,
            _proposedMinter
        );
    }

    /**
     * @dev approveMinter
     *      It approves a new token minter address.
     *      Only the current minter can call it.
     */
    function approveMinter()
        external
        override
    {
        require(
            msg.sender == _proposedMinter,
            'TourTokenTemplate: invalid proposed minter address'
        );
        emit MinterApproved(
            _minter,
            _proposedMinter
        );
        _minter = _proposedMinter;
        _proposedMinter = address(0);
    }

    /**
     * @dev blob
     *      It returns the blob (e.g https://123.com).
     * @return TourToken blob.
     */
    function tourID() external view returns(string memory) {
        return _tourID;
    }

    /**
     * @dev cap
     *      it returns the capital.
     * @return TourToken cap.
     */
    function cap() external override view returns (uint256) {
        return _cap;
    }

    /**
     * @dev isMinter
     *      It takes the address and checks whether it has a minter role.
     * @param account refers to the address.
     * @return true if account has a minter role.
     */
    function isMinter(address account) external override view returns(bool) {
        return (_minter == account);
    } 

    /**
     * @dev minter
     * @return minter's address.
     */
    function minter()
        external
        override
        view 
        returns(address)
    {
        return _minter;
    }

    /**
     * @dev isInitialized
     *      It checks whether the contract is initialized.
     * @return true if the contract is initialized.
     */ 
    function isInitialized() external override view returns(bool) {
        return initialized;
    }

    /**
     * @dev calculateFee
     *      giving a fee percentage, and amount it calculates the actual fee
     * @param amount the amount of token
     * @param feePercentage the fee percentage 
     * @return the token fee.
     */ 
    function calculateFee(
        uint256 amount,
        uint256 feePercentage
    )
        public
        pure
        returns(uint256)
    {
        if(amount == 0) return 0;
        if(feePercentage == 0) return 0;
        return amount.mul(feePercentage).div(BASE);
    }
}
