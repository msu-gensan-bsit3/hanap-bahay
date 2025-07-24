import { days } from './utils';

export const DateFormatOption: Intl.DateTimeFormatOptions = {
	month: 'short',
	year: 'numeric',
	day: '2-digit'
};

export const TimeFormatOption: Intl.DateTimeFormatOptions = {
	hour: '2-digit',
	minute: '2-digit'
};

/** 30 days in ms */
export const SessionDuration = days(30);

/** 30 days */
export const SessionDurationSeconds = days(30) / 1000;

/** 5 minutes in ms */
export const ResetPasswordDuration = 1000 * 60 * 5;

/** 5 minutes in ms */
export const MailVerificationCodeDuration = 1000 * 60 * 5;

export const ArgonOpts = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};
