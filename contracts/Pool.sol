// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TourToken.sol";

contract Pool is ERC20 {
  uint256 _constProduct;
  uint16 _state;
  address _owner;
  uint256 _fee;

  address _tourTokenContract;
  uint256 _ethPool;
  uint256 _tourPool;

  constructor(address tokenContract, string memory name, string memory symbol, uint256 fee) ERC20(name, symbol) {
    _tourTokenContract = tokenContract;
    _state = 1;
    _owner = tx.origin;
    _fee = fee;
  }

  function activate(uint256 initialSupply) public returns (bool){
    require(msg.sender == _owner);
    require(_state == 1);
    require(initialSupply > 0);
    require(_ethPool > 0);
    require(_tourPool > 0);

    _constProduct = _ethPool * _tourPool;
    _state = 2;
    _mint(_owner, initialSupply);
    return true;
  }

  function swapToETH(uint256 amount) public {
    require(_state == 2);
    TourToken temp = TourToken(_tourTokenContract);
    require(temp.transferFrom(msg.sender, address(this), amount));
    _tourPool += amount;
    uint256 ethToSend = _ethPool - ( _constProduct / _tourPool);
    payable(msg.sender).transfer(ethToSend);
    _ethPool = _ethPool -  ethToSend;
  }

  function swapToTour() payable public {
    require(msg.value > 0);
    require(_state == 2);
    _ethPool += msg.value;
    uint256 tokToSend = _tourPool - ( _constProduct / _ethPool);
    
    TourToken temp = TourToken(_tourTokenContract);
    require(temp.transfer(msg.sender, tokToSend));
    _tourPool = _tourPool - tokToSend;
  }

  function addLiquidity() payable public {
    require(_state == 2);

    uint256 ethAdded = msg.value;
    uint256 sharesMinted = (ethAdded * totalSupply()) / _ethPool;
    uint256 tokensAdded = (sharesMinted * _tourPool) / totalSupply();

    _mint(msg.sender, tokensAdded);
    _ethPool += ethAdded;
    _tourPool += tokensAdded;
    
    _constProduct = _ethPool * _tourPool;

    TourToken temp = TourToken(_tourTokenContract);
    require(temp.transferFrom(msg.sender, address(this), tokensAdded));
  }

  function state() external view returns (uint16){
    return _state;
  }

  function token() external view returns (address){
    return _tourTokenContract;
  }

  function ethPool() external view returns (uint256) {
    return _ethPool;
  }

  function tourPool() external view returns (uint256) {
    return _tourPool;
  }

  function addInitialLiquidity(uint256 amount) public payable {
    require(_state == 1);
    require(msg.sender == _owner);

    TourToken temp = TourToken(_tourTokenContract);
    require(temp.transferFrom(msg.sender, address(this), amount));
    _tourPool += amount;
    _ethPool += msg.value;
  }

}
