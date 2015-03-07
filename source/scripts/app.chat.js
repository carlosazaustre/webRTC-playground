"use strict";

// -- Dependencies -------------------------------------------------------------
var io = require('socket.io');

// -- Cached DOM elements ------------------------------------------------------

var chatEl = document.querySelector('[data-section="chat"]');

// -- Helpers ------------------------------------------------------------------
var socket = io();
