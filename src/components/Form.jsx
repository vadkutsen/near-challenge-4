import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function Form({ onSubmit, currentUser, isMessageSigned }) {
  return (
    <form onSubmit={onSubmit}>
      {isMessageSigned ? <p>You already sent your message. Thanks for sharing your thoughts with us!</p> :
        <fieldset id="fieldset">
          <p>Hello, { currentUser.accountId }! Share something good with us</p>
          <p className="highlight">
            <label htmlFor="message">Message:</label>
            <input
              autoComplete="off"
              autoFocus
              id="message"
              required
            />
          </p>
          <p>
            <label htmlFor="donation">Donation (optional):</label>
            <input
              autoComplete="off"
              defaultValue={'0'}
              id="donation"
              max={Big(currentUser.balance).div(10 ** 24)}
              min="0"
              step="0.01"
              type="number"
            />
            <span title="NEAR Tokens">Ⓝ</span>
          </p>
          <button type="submit">
            Sign
          </button>
        </fieldset>
      }
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  })
};
