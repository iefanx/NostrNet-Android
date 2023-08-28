import React, { Component } from 'react';

class BlockNumberComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockNumber: null,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchCurrentBlockNumber();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchCurrentBlockNumber = async () => {
    try {
      const response = await fetch('https://blockchain.info/q/getblockcount');
      const blockNumber = await response.text();
      this.setState({ blockNumber });
    } catch (error) {
      this.setState({ error: 'Error fetching block number' });
    }
  };

  render() {
    const { blockNumber, error } = this.state;



    // Extract the last 4 digits of blockNumber
    const lastFourDigits = blockNumber ? blockNumber.slice(-3) : '';

    return (
      <div>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-xl font-bold font-mono" id="blockNumber">
            <span >
              {blockNumber && blockNumber.slice(0, -3)}
            </span>
            <span style={{ color: '#f7931a' }}>{lastFourDigits}</span>
          </p>
        )}
      </div>
    );
  }
}

export default BlockNumberComponent;
