"use client";

import Script from "next/script";

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

let amplitudeInitialised = false;

declare global {
	interface Window {
		amplitude?: {
			add: (plugin: unknown) => unknown;
			init: (apiKey: string, config: Record<string, unknown>) => unknown;
		};

		sessionReplay?: {
			plugin: (options: { sampleRate: number }) => unknown;
		};
	}
}

export default function AmplitudeAnalytics() {
	if (!AMPLITUDE_API_KEY) {
		return null;
	}

	const initialiseAmplitude = () => {
		if (amplitudeInitialised || !window.amplitude || !window.sessionReplay) {
			return;
		}

		amplitudeInitialised = true;

		window.amplitude.add(
			window.sessionReplay.plugin({
				// 1 means 100% of eligible sessions are recorded.
				sampleRate: 1,
			}),
		);

		window.amplitude.init(AMPLITUDE_API_KEY, {
			fetchRemoteConfig: true,

			autocapture: {
				attribution: true,
				fileDownloads: true,
				formInteractions: true,
				pageViews: true,
				sessions: true,
				elementInteractions: true,
				networkTracking: true,
				webVitals: true,
				frustrationInteractions: true,
			},
		});
	};

	return (
		<Script
			id="amplitude-analytics"
			src={`https://cdn.amplitude.com/script/${AMPLITUDE_API_KEY}.js`}
			strategy="afterInteractive"
			onReady={initialiseAmplitude}
			onError={(error) => {
				console.error("Failed to load Amplitude:", error);
			}}
		/>
	);
}
