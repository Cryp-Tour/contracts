pragma solidity >=0.5.0;

interface ITourTokenAdditional {
    function initialize(
        string calldata name,
        string calldata symbol,
        address minter,
        uint256 cap,
        string calldata blob,
        address collector
    ) external returns (bool);

    function mint(address account, uint256 value) external;
    function minter() external view returns(address);    
    function cap() external view returns (uint256);
    function isMinter(address account) external view returns (bool);
    function isInitialized() external view returns (bool);
    function proposeMinter(address newMinter) external;
    function approveMinter() external;
}
