// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.

import { createConsumer } from "@rails/actioncable"

function cableUrl() {
  return document.querySelector('meta[name="action-cable-url"]').content;
}

function createAuthedConsumer(token) {
  return createConsumer(cableUrl() + "?t=" + token);
}

export default createAuthedConsumer
