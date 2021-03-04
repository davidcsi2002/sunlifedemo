import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const showToast = (title, message, variant, mode, messageData) => {
	const event = new ShowToastEvent({
		title: title,
		message: message,
		variant: variant,
		mode: mode,
		messageData: messageData
	});
	dispatchEvent(event);
}

export {  showToast }