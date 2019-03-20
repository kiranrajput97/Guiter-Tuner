

let speechOutput;
let reprompt;
let welcomeOutput = "Welcome, to the Guitar Tuner.. You can ask me to play a note like a low E , or A. How can i assist you?";
let welcomeReprompt = "Hey, you can say something like: give me an E string, or play me an A";
// 2. Skill Code =======================================================================================================
"use strict";
const Alexa = require('alexa-sdk');
const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
speechOutput = '';
const handlers = {
	'LaunchRequest': function ()
	{   
		this.emit(':ask', welcomeOutput, welcomeReprompt);
	},
	'AMAZON.HelpIntent': function ()
	{
		speechOutput = 'you can say something like: give me an E string, or play me an A';
		reprompt = 'Hey, What happen? You can say like : play an E';
		this.emit(':ask', speechOutput , reprompt);
	},
   'AMAZON.CancelIntent': function ()
   {
		speechOutput = 'This skill has been canceled.';
		this.emit(':tell', speechOutput);
	},
   'AMAZON.StopIntent': function ()
   {
		speechOutput = 'OK, This skill has been stopped.';
		this.emit(':tell', speechOutput);
   },
   'SessionEndedRequest': function ()
   {
		speechOutput = 'Upps, Session has been ended. Do not worry You can try it again.';
        //this.emit(':saveState', true);   //uncomment to save attributes to db on session end
		this.emit(':tell', speechOutput);
   },
	'AMAZON.NavigateHomeIntent': function ()
	{
	
		speechOutput = 'Sorry, this intent can not run now.';
		this.emit(":tell", speechOutput);
    },
	'PlayNoteIntent': function ()
	{
		var speechOutput = '';
		var speechReprompt = '';

		let noteSlot = resolveCanonical(this.event.request.intent.slots.note);
		console.log('User requested note: ' + noteSlot);
	
		let pitchSlot = resolveCanonical(this.event.request.intent.slots.pitch);
		console.log('User requested pitch: ' + pitchSlot);
		
	var notes = {
		    'a' : {
		        'low' : 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/a.mp3',
		        'high': 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/a.mp3'
		    },
		    'b' : {
		        'low' : 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/b.mp3',
		        'high': 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/b.mp3'
		    },
		    'c' : {
		        'low' : 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/c.mp3',
		        'high': 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/c.mp3'
		    },
		    'd' : {
		        'low' : 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/d.mp3',
		        'high': 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/d.mp3'
		    },
		    'e' : {
		        'low' : 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/e_low.mp3',
		        'high': 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/e_high.mp3'
		    },
		    'f' : {
		        'low' : 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/f.mp3',
		        'high': 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/f.mp3'
		    },
		    'g' : {
		        'low' : 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/g.mp3',
		        'high': 'https://s3-eu-west-1.amazonaws.com/alexa-guitar/g.mp3'
		    }
		}
		
		var pitches = [
		    'low',
		    'high'
		    ];
		    
		    
		    var  note = noteSlot.toLowerCase();
		    
		    if(noteSlot && notes[note]) {
		        var audio = '';
		        var pitch = 'low'; //default pitch
		        
		        if(pitchSlot && pitch.indexOf(pitchSlot) > -1){
		            pitch = pitchSlot;
		        }
		        
		        var audioSrc = notes[note][pitch];
		        
		        speechOutput = 'Okkey, Here is your Note... lets hear it... <audio src="' + audioSrc + '" />';
		        speechReprompt = 'Wanna hear it again ? Say that again !';
		    } else {
		        speechOutput = 'Sorry, The note you asked for is not supported. Can you please say that again ?'
		        speechReprompt = 'I support: A, B, C, D, low E, high E, G, and F';
		    }
		    
		    this.emit(":tell", speechOutput, speechReprompt);

    },

		//Your custom intent handling goes here
	//	speechOutput = "Okkey, I will play a " + noteSlot + " with pithch " + pitchSlot + " . Here is your tune " + ' <audio src="https://s3-eu-west-1.amazonaws.com/alexa-guitar/d.mp3" />';
	//	this.emit(":ask", speechOutput, "would u like to listen it again?");
	'Unhandled': function () {
        speechOutput = "The skill didn't quite understand what you wanted. Please ask for appropriate note.";
        this.emit(':tell', speechOutput, speechOutput);
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
	//alexa.dynamoDBTableName = 'DYNAMODB_TABLE_NAME';//uncomment this line to save attributes to DB
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function resolveCanonical(slot){
	//this function looks at the entity resolution part of request and returns the slot value if a synonyms is provided
	let canonical;
    try{
		canonical = slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
	}catch(err){
	    console.log(err.message);
	    canonical = slot.value;
	};
	return canonical;
};

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
	  let updatedIntent= null;
	  // updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      //this.emit(":delegate", updatedIntent); //uncomment this is using ASK SDK 1.0.9 or newer
	  
	  //this code is necessary if using ASK SDK versions prior to 1.0.9 
	  if(this.isOverridden()) {
			return;
		}
		this.handler.response = buildSpeechletResponse({
			sessionAttributes: this.attributes,
			directives: getDialogDirectives('Dialog.Delegate', updatedIntent, null),
			shouldEndSession: false
		});
		this.emit(':responseReady', updatedIntent);
		
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      //this.emit(":delegate"); //uncomment this is using ASK SDK 1.0.9 or newer
	  
	  //this code necessary is using ASK SDK versions prior to 1.0.9
		if(this.isOverridden()) {
			return;
		}
		this.handler.response = buildSpeechletResponse({
			sessionAttributes: this.attributes,
			directives: getDialogDirectives('Dialog.Delegate', null, null),
			shouldEndSession: false
		});
		this.emit(':responseReady');
		
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}


function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
function isSlotValid(request, slotName){
        let slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        let slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}

//These functions are here to allow dialog directives to work with SDK versions prior to 1.0.9
//will be removed once Lambda templates are updated with the latest SDK

function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam['speech']
        };
    } else {
        return {
            type: optionsParam.type || 'PlainText',
            text: optionsParam['speech'] || optionsParam
        };
    }
}

function buildSpeechletResponse(options) {
    let alexaResponse = {
        shouldEndSession: options.shouldEndSession
    };

    if (options.output) {
        alexaResponse.outputSpeech = createSpeechObject(options.output);
    }

    if (options.reprompt) {
        alexaResponse.reprompt = {
            outputSpeech: createSpeechObject(options.reprompt)
        };
    }

    if (options.directives) {
        alexaResponse.directives = options.directives;
    }

    if (options.cardTitle && options.cardContent) {
        alexaResponse.card = {
            type: 'Simple',
            title: options.cardTitle,
            content: options.cardContent
        };

        if(options.cardImage && (options.cardImage.smallImageUrl || options.cardImage.largeImageUrl)) {
            alexaResponse.card.type = 'Standard';
            alexaResponse.card['image'] = {};

            delete alexaResponse.card.content;
            alexaResponse.card.text = options.cardContent;

            if(options.cardImage.smallImageUrl) {
                alexaResponse.card.image['smallImageUrl'] = options.cardImage.smallImageUrl;
            }

            if(options.cardImage.largeImageUrl) {
                alexaResponse.card.image['largeImageUrl'] = options.cardImage.largeImageUrl;
            }
        }
    } else if (options.cardType === 'LinkAccount') {
        alexaResponse.card = {
            type: 'LinkAccount'
        };
    } else if (options.cardType === 'AskForPermissionsConsent') {
        alexaResponse.card = {
            type: 'AskForPermissionsConsent',
            permissions: options.permissions
        };
    }

    let returnResult = {
        version: '1.0',
        response: alexaResponse
    };

    if (options.sessionAttributes) {
        returnResult.sessionAttributes = options.sessionAttributes;
    }
    return returnResult;
}

function getDialogDirectives(dialogType, updatedIntent, slotName) {
    let directive = {
        type: dialogType
    };

    if (dialogType === 'Dialog.ElicitSlot') {
        directive.slotToElicit = slotName;
    } else if (dialogType === 'Dialog.ConfirmSlot') {
        directive.slotToConfirm = slotName;
    }

    if (updatedIntent) {
        directive.updatedIntent = updatedIntent;
    }
    return [directive];
}