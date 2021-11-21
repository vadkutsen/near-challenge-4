import { PostedMessage, messages, senders } from './model';

// --- contract code goes below

// The maximum number of latest messages the contract returns.
const MESSAGE_LIMIT = 50;

/**
 * Adds a new message under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */
export function addMessage(text: string, timestamp: string): void {
  // Creating a new message and populating fields with our data
  const message = new PostedMessage(text, timestamp);
  const sender = message.sender;
  assert(
    !senders.has(sender),
    "You can sign message only once."
  );
  // Adding the message to end of the the persistent collection
  messages.push(message);
  senders.add(sender);
}

/**
 * Returns an array of last N messages.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */
export function getMessages(): PostedMessage[] {
  const numMessages = min(MESSAGE_LIMIT, messages.length);
  const startIndex = messages.length - numMessages;
  const result = new Array<PostedMessage>(numMessages);
  for(let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
  }
  return result;
}

export function getSenders(): string[] {
return senders.values();
}