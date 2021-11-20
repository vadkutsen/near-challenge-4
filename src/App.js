import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import SignIn from './components/SignIn';
import Messages from './components/Messages';
import Notification from './components/Notification';
import spaceman from '../assets/small-spaceman.png';

const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [messages, setMessages] = useState([]);
  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = useState(false)
  const [isMessageSigned, setIsMessageSigned] = useState(false)
  useEffect(() => {
    // TODO: don't just fetch once; subscribe!
    contract.getMessages().then(setMessages);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const { fieldset, message, donation } = e.target.elements;

    fieldset.disabled = true;

    // TODO: optimistically update page with new message,
    // update blockchain data in background
    // add uuid to each message, so we know which one is already known
    contract.addMessage(
      {
        text: message.value,
        timestamp: new Date(),
      },
      BOATLOAD_OF_GAS,
      Big(donation.value || '0').times(10 ** 24).toFixed()
    ).then(() => {
      contract.getMessages().then(messages => {
        setMessages(messages);
        message.value = '';
        donation.value = SUGGESTED_DONATION;
        fieldset.disabled = false;
        message.focus();
      });
      // show Notification
      setShowNotification(true)

      // remove Notification again after css animation completes
      // this allows it to be shown again next time the form is submitted
      setTimeout(() => {
        setShowNotification(false)
      }, 11000)

      setIsMessageSigned(true)
    });
  };

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEAR Guest Book'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header>
        <div className="account">
          {currentUser ? <span>{currentUser.accountId}</span> : <span> </span> }
        </div>
        { currentUser
          ? <button className="signout" onClick={signOut}>Log out</button>
          : <button className="signin" onClick={signIn}>Log in</button>
        }
      </header>
      <h1 style={{ textAlign: 'center' }}>NEAR Challenge #4</h1>
      { currentUser
        ? <div className="message-area">
            <div style={{ marginRight: '20px', flex: 2 }}>
              <Form onSubmit={onSubmit} currentUser={currentUser} isMessageSigned={isMessageSigned} />
            </div>
            <div>
              <img src={spaceman} alt="Spaceman"/>
            </div>
          </div>
        : <SignIn/>
      }
      { !!currentUser && !!messages.length && <Messages messages={messages}/> }
      {showNotification && <Notification currentUser={currentUser} />}
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    addMessage: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
