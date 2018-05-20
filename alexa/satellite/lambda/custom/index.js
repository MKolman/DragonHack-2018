/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const rp = require('request-promise-native');

const api = 'http://dragon.kolman.si/alexa/command';

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const response = await rp(`${api}?type=init`);

    const speechText = 'Around the World in 80 seconds! Where do you want me to take you?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Welcome', speechText)
      .getResponse();
  },
};

const FindLocationIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'FindLocationIntent';
  },
  async handle(handlerInput) {
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);

    const country = slotValues.country ? slotValues.country.resolved : null;
    const weather = slotValues.weather ? slotValues.weather.resolved : null;

    let speechText = 'You did not specify anything specific.';
    if (country) {
      speechText = `You'd like to visit ${country}.`;
      const response = await rp(`${api}?type=location&value=${country}`);
    } else if (weather) {
      speechText = `You like ${weather} weather.`;
      const response = await rp(`${api}?type=weather&value=${weather}`);
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Find location', speechText)
      .getResponse();
  },
};

const moveResponses = [
  'how about this?',
  'is it better?',
  'yes, sir!',
  'moving..'
]

const MoveIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'MoveIntent';
  },
  async handle(handlerInput) {
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);

    const direction = slotValues.direction ? slotValues.direction.resolved : null;

    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    let speechText = '';
    if (direction) {
      let index = typeof sessionAttributes.currentMoveResponse !== 'undefined' ? sessionAttributes.currentMoveResponse + 1 : 0;

      index = index % moveResponses.length;
      speechText = moveResponses[index];

      const response = await rp(`${api}?type=move&value=${direction}`);

      sessionAttributes.currentMoveResponse = index;
      await handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Move', speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const ZoomIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'ZoomIntent';
  },
  async handle(handlerInput) {
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);

    const zoom = slotValues.zoom ? slotValues.zoom.resolved : null;

    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    let speechText = '';
    if (zoom) {
      let index = typeof sessionAttributes.currentMoveResponse !== 'undefined' ? sessionAttributes.currentMoveResponse + 1 : 0;

      index = index % moveResponses.length;
      speechText = moveResponses[index];

      const zoomValue = zoom == 'in' ? 1 : -1;
      const response = await rp(`${api}?type=zoom&value=${zoomValue}`);

      sessionAttributes.currentMoveResponse = index;
      await handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Move', speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const MapTypeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'MapTypeIntent';
  },
  async handle(handlerInput) {
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);

    const map = slotValues.map ? slotValues.map.resolved : null;

    let speechText = `Changing to ${map} map`;

    const response = await rp(`${api}?type=change_type&value=${map}`);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Move', speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const VRIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'VRIntent';
  },
  async handle(handlerInput) {
    let speechText = `Switching to VR`;

    const response = await rp(`${api}?type=vr`);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Move', speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  async handle(handlerInput) {
    const response = await rp(`${api}?type=reset`);

    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

function getSlotValues(filledSlots) {
  const slotValues = {};

  console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
  Object.keys(filledSlots).forEach((item) => {
    const name = filledSlots[item].name;

    if (filledSlots[item] &&
      filledSlots[item].resolutions &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
      switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
        case 'ER_SUCCESS_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
            isValidated: true,
          };
          break;
        case 'ER_SUCCESS_NO_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            resolved: filledSlots[item].value,
            isValidated: false,
          };
          break;
        default:
          break;
      }
    } else {
      slotValues[name] = {
        synonym: filledSlots[item].value,
        resolved: filledSlots[item].value,
        isValidated: false,
      };
    }
  }, this);

  return slotValues;
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    FindLocationIntentHandler,
    MoveIntentHandler,
    ZoomIntentHandler,
    MapTypeIntentHandler,
    VRIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
